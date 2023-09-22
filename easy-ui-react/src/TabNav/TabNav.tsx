import { AriaLabelingProps } from "@react-types/shared";
import React, { ReactNode, useMemo, useRef, useState } from "react";
import { useEdgeInterceptors } from "../DataGrid/useEdgeInterceptors";
import { classNames, getComponentToken } from "../utilities/css";
import { TabNavItem } from "./TabNavItem";
import { TabNavContext } from "./context";
import { useScrollbar } from "./useScrollbar";

import styles from "./TabNav.module.scss";

export type TabNavProps = AriaLabelingProps & {
  /** The children of the <TabNav> element. Should include <TabNav.Item> elements. */
  children: ReactNode;
};

export function TabNav(props: TabNavProps) {
  const { children, ...labelingProps } = props;

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

  const style = {
    ...getComponentToken("tab-nav", "indicator-width", `${indicatorWidth}px`),
    ...getComponentToken(
      "tab-nav",
      "indicator-position",
      `${indicatorPosition}px`,
    ),
  };

  useScrollbar({ navRef, containerRef });

  return (
    <TabNavContext.Provider value={context}>
      <div className={styles.navContainer} ref={containerRef}>
        <nav
          {...labelingProps}
          ref={navRef}
          className={styles.TabNav}
          style={style}
        >
          <div className={styles.listContainer}>
            <ul role="list" className={styles.list}>
              {children}
            </ul>
            {renderInterceptors()}
          </div>
          {indicatorWidth !== 0 ? <div className={styles.indicator} /> : null}
        </nav>
        <div
          className={classNames(
            styles.edge,
            isLeftEdgeUnderScroll && styles.leftEdgeUnderScroll,
          )}
        />
        <div
          className={classNames(
            styles.edge,
            isRightEdgeUnderScroll && styles.rightEdgeUnderScroll,
          )}
        />
      </div>
    </TabNavContext.Provider>
  );
}

TabNav.Item = TabNavItem;
