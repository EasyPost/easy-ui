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

  const [width, setWidth] = useState<number | null>(null);
  const [left, setLeft] = useState<number | null>(null);

  const context = useMemo(() => {
    return { setWidth, setLeft };
  }, []);

  const style = {
    ...getComponentToken("tab-nav", "selected-tab-width", `${width}px`),
    ...getComponentToken("tab-nav", "selected-tab-left", `${left}px`),
  };

  return (
    <TabNavContext.Provider value={context}>
      <nav {...labelingProps} className={styles.TabNav} style={style}>
        <ul role="list" className={styles.list}>
          {children}
          <div className={styles.line} />
        </ul>
      </nav>
    </TabNavContext.Provider>
  );
}

TabNav.Item = TabNavItem;
