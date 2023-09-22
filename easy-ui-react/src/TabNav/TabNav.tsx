import { AriaLabelingProps } from "@react-types/shared";
import React, { ReactNode, useMemo, useRef, useState } from "react";
import { useEdgeInterceptors } from "../DataGrid/useEdgeInterceptors";
import { getComponentToken } from "../utilities/css";
import { Edge } from "./Edge";
import { TabNavItem } from "./TabNavItem";
import { TabNavContext } from "./context";
import { useScrollbar } from "./useScrollbar";

import styles from "./TabNav.module.scss";

export type TabNavProps = AriaLabelingProps & {
  /** The children of the <TabNav> element. Should include <TabNav.Item> elements. */
  children: ReactNode;
};

/**
 * A `TabNav` is a set of styled links that lets users navigate between
 * related pages.
 *
 * @remarks
 * Use a `TabNav` for tabs that navigate across URLs. For navigation within
 * the same URL, use `TabPanels`.
 *
 * @example
 * <TabNav aria-label="Account">
 *   <TabNav.Item href="/billing" isCurrentPage={true}>Billing</TabNav.Item>
 *   <TabNav.Item href="/members">Members</TabNav.Item>
 *   <TabNav.Item href="/api-keys">API Keys</TabNav.Item>
 *   <TabNav.Item href="/branded-tracker">Branded Tracker</TabNav.Item>
 *   <TabNav.Item href="/shipping-settings">Shipping Settings</TabNav.Item>
 * </TabNav>
 */
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

  useScrollbar({ navRef, containerRef });

  const style = {
    ...getComponentToken("tab-nav", "indicator-width", `${indicatorWidth}px`),
    ...getComponentToken(
      "tab-nav",
      "indicator-position",
      `${indicatorPosition}px`,
    ),
  };

  return (
    <TabNavContext.Provider value={context}>
      <div className={styles.TabNav} ref={containerRef}>
        <nav
          {...labelingProps}
          ref={navRef}
          className={styles.nav}
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
        <Edge side="left" isUnderScroll={isLeftEdgeUnderScroll} />
        <Edge side="right" isUnderScroll={isRightEdgeUnderScroll} />
      </div>
    </TabNavContext.Provider>
  );
}

/**
 * Represents an item in a `<TabNav />`.
 */
TabNav.Item = TabNavItem;
