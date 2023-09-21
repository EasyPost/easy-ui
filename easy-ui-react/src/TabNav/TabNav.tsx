import { AriaLabelingProps } from "@react-types/shared";
import React, { ReactNode, useMemo, useState } from "react";
import { getComponentToken } from "../utilities/css";
import { TabNavItem } from "./TabNavItem";
import { TabNavContext } from "./context";

import styles from "./TabNav.module.scss";

type TabNavProps = AriaLabelingProps & {
  children: ReactNode;
};

export function TabNav(props: TabNavProps) {
  const { children, ...labelingProps } = props;

  const [indicatorWidth, setIndicatorWidth] = useState<number>(0);
  const [indicatorPosition, setIndicatorPosition] = useState<number>(0);

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

  return (
    <TabNavContext.Provider value={context}>
      <nav {...labelingProps} className={styles.TabNav} style={style}>
        <ul role="list" className={styles.list}>
          {children}
        </ul>
        {indicatorWidth !== 0 ? <div className={styles.indicator} /> : null}
      </nav>
    </TabNavContext.Provider>
  );
}

TabNav.Item = TabNavItem;
