import { AriaLabelingProps } from "@react-types/shared";
import React, {
  Key,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTab, useTabList, useTabPanel } from "react-aria";
import {
  Item,
  TabListState,
  useCollection,
  useTabListState,
} from "react-stately";
import { ListCollection } from "@react-stately/list";
import { classNames } from "../utilities/css";

import styles from "./TabPanels.module.scss";

type TabPanels = AriaLabelingProps & {
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

type TabPanelsTabs = {
  /**
   * The tab items to display. Item keys should match the key of the
   * corresponding <Item> within the <TabPanels.Panels> element.
   */
  children: ReactNode;
};

type TabPanelsPanels = {
  /**
   * The contents of each tab. Item keys should match the key of the
   * corresponding <Item> within the <TabPanels.Tabs> element.
   */
  children: ReactNode;
};

type TabPanelsContextType = {
  tabListState: TabListState<object>;
  setTabListState: (state: TabListState<object>) => void;
};

const TabPanelsContext = createContext<TabPanelsContextType<object> | null>(
  null,
);

const useTabPanels = () => {
  const tabPanelsContext = useContext(TabPanelsContext);
  if (!tabPanelsContext) {
    throw new Error("useTabPanels must be used within a TabPanels");
  }
  return tabPanelsContext;
};

export function TabPanels(props: TabPanelsProps) {
  const { children } = props;

  const className = classNames(styles.TabPanels, styles[props.orientation]);
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

function TabPanelTabs(props) {
  const { setTabListState } = useTabPanels();

  let ref = React.useRef(null);

  let state = useTabListState({ ...props, children: props.children });

  let { tabListProps } = useTabList(props, state, ref);

  useEffect(() => {
    setTabListState(state);
  }, [
    state.disabledKeys,
    state.selectedItem,
    state.selectedKey,
    props.children,
  ]);

  return (
    <div {...tabListProps} ref={ref}>
      {[...state.collection].map((item) => (
        <Tab key={item.key} item={item} state={state} />
      ))}
    </div>
  );
}

function Tab({ item, state }) {
  let { key, rendered } = item;
  let ref = React.useRef(null);
  let { tabProps } = useTab({ key }, state, ref);
  return (
    <div {...tabProps} ref={ref}>
      {rendered}
    </div>
  );
}

// <TabPanel key={state.selectedItem?.key} state={state} />

function TabPanelPanels(props) {
  const { tabListState } = useTabPanels();

  const factory = useCallback((nodes) => new ListCollection(nodes), []);
  const collection = useCollection({ ...props }, factory, {
    suppressTextValueWarning: true,
  });
  const selectedItem = tabListState
    ? collection.getItem(tabListState.selectedKey)
    : null;

  console.log("selected item", selectedItem);

  return (
    <TabPanel {...props} key={tabListState?.selectedKey} state={tabListState}>
      {selectedItem && selectedItem.props.children}
    </TabPanel>
  );
}

function TabPanel({ state, ...props }) {
  let ref = React.useRef(null);
  let { tabPanelProps } = useTabPanel(props, state, ref);
  return (
    <div {...tabPanelProps} ref={ref}>
      {props.children}
    </div>
  );
}

TabPanels.Tabs = TabPanelTabs;
TabPanels.Panels = TabPanelPanels;
