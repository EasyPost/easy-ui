import { AriaLabelingProps } from "@react-types/shared";
import React, { Key, ReactNode, useMemo, useState } from "react";
import { TabListState } from "react-stately";
import { classNames } from "../utilities/css";
import { TabPanelsContext } from "./context";
import { TabPanelsPanels } from "./TabPanelsPanels";
import { TabPanelsTabs } from "./TabPanelsTabs";

import styles from "./TabPanels.module.scss";

type TabPanelsProps = AriaLabelingProps & {
  /**
   * The children of the <TabPanels> element. Should include <TabPanels.Tabs>
   * and <TabPanels.Panels> elements.
   */
  children: ReactNode;

  /**
   * The initial selected key in the collection (uncontrolled).
   */
  defaultSelectedKey?: Key;

  /**
   * The keys of the tabs that are disabled. These tabs cannot be selected,
   * focused, or otherwise interacted with.
   */
  disabledKeys?: Iterable<Key>;

  /**
   * Whether tabs are activated automatically on focus or manually.
   *
   * @default "automatic"
   */
  keyboardActivation?: "automatic" | "manual";

  /**
   * Handler that is called when the selection changes.
   */
  onSelectionChange?: (key: Key) => void;

  /**
   * The currently selected key in the collection (controlled).
   */
  selectedKey?: Key | null;
};

export function TabPanels(props: TabPanelsProps) {
  const { children } = props;

  const className = classNames(styles.TabPanels);
  const [tabListState, setTabListState] = useState<TabListState<object> | null>(
    null,
  );

  const context = useMemo(() => {
    return { tabListState, setTabListState };
  }, [tabListState]);

  return (
    <TabPanelsContext.Provider value={context}>
      <div className={className}>{children}</div>
    </TabPanelsContext.Provider>
  );
}

TabPanels.Tabs = TabPanelsTabs;
TabPanels.Panels = TabPanelsPanels;
