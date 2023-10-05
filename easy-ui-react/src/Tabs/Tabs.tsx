import React, {
  MutableRefObject,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import { useEdgeInterceptors } from "../DataGrid/useEdgeInterceptors";
import { getComponentToken } from "../utilities/css";
import { Edge } from "./Edge";
import { TabsItem } from "./TabsItem";
import { TabsContext } from "./context";
import { useScrollbar } from "./useScrollbar";

import styles from "./Tabs.module.scss";

export type TabsProps = {
  containerComponent: "div" | "nav";
  containerProps: object;
  listComponent: "div" | "ul";
  listProps: object;
  listRef?: MutableRefObject<null>;
  children: ReactNode;
};

/**
 * `Tabs` is the underlying implementation to the presentation of tabs in
 * `TabNav` and `TabPanels`. The specifics of each implementation is handled
 * by the respective component.
 *
 * @private
 * @ignore
 */
export function Tabs(props: TabsProps) {
  const {
    children,
    containerComponent: ContainerComponent,
    containerProps,
    listComponent: ListComponent,
    listRef,
    listProps,
  } = props;

  const navRef = useRef(null);
  const containerRef = useRef(null);

  const [indicatorWidth, setIndicatorWidth] = useState<number>(0);
  const [indicatorPosition, setIndicatorPosition] = useState<number>(0);

  const [
    renderInterceptors,
    { isLeftEdgeUnderScroll, isRightEdgeUnderScroll },
  ] = useEdgeInterceptors(navRef);

  const context = useMemo(() => {
    return { setIndicatorWidth, setIndicatorPosition };
  }, []);

  useScrollbar({ navRef, containerRef });

  const style = {
    ...getComponentToken("tab-nav", "indicator-width", String(indicatorWidth)),
    ...getComponentToken(
      "tab-nav",
      "indicator-position",
      `${indicatorPosition}px`,
    ),
  };

  return (
    <TabsContext.Provider value={context}>
      <div className={styles.Tabs} ref={containerRef}>
        <ContainerComponent
          {...containerProps}
          ref={navRef}
          className={styles.nav}
          style={style}
          data-ezui-tabs-indicator-parent="true"
        >
          <div className={styles.listContainer}>
            <ListComponent ref={listRef} {...listProps} className={styles.list}>
              {children}
            </ListComponent>
            {renderInterceptors()}
          </div>
          {indicatorWidth !== 0 ? <div className={styles.indicator} /> : null}
        </ContainerComponent>
        <Edge side="left" isUnderScroll={isLeftEdgeUnderScroll} />
        <Edge side="right" isUnderScroll={isRightEdgeUnderScroll} />
      </div>
    </TabsContext.Provider>
  );
}

Tabs.Item = TabsItem;
