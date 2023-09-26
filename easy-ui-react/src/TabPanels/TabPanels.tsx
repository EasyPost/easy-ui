import { ListCollection } from "@react-stately/list";
import { AriaLabelingProps, ItemElement, Node } from "@react-types/shared";
import React, {
  Key,
  ReactElement,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AriaTabPanelProps, useTab, useTabList, useTabPanel } from "react-aria";
import { TabListState, useCollection, useTabListState } from "react-stately";
import { classNames } from "../utilities/css";

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

type TabPanelsTabsProps = AriaLabelingProps & {
  /**
   * The tab items to display. Item keys should match the key of the
   * corresponding <Item> within the <TabPanels.Panels> element.
   */
  children: ItemElement<object> | ItemElement<object>[];
};

type TabPanelsPanelsProps = {
  /**
   * The contents of each tab. Item keys should match the key of the
   * corresponding <Item> within the <TabPanels.Tabs> element.
   */
  children: ReactElement | ReactElement[];
};

type TabProps = {
  item: Node<object>;
  state: TabListState<object>;
};

type TabPanelProps = AriaTabPanelProps & {
  children: ReactNode;
  state: TabListState<object>;
};

type TabPanelsContextType = {
  tabListState: TabListState<object> | null;
  setTabListState: (state: TabListState<object>) => void;
};

const TabPanelsContext = createContext<TabPanelsContextType | null>(null);

const useTabPanels = () => {
  const tabPanelsContext = useContext(TabPanelsContext);
  if (!tabPanelsContext) {
    throw new Error("useTabPanels must be used within a TabPanels");
  }
  return tabPanelsContext;
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

function TabPanelTabs(props: TabPanelsTabsProps) {
  const { setTabListState } = useTabPanels();

  const ref = React.useRef(null);

  const state = useTabListState({ ...props, children: props.children });

  const { tabListProps } = useTabList(props, state, ref);

  useEffect(
    () => {
      setTabListState(state);
    },
    // state is too comprehensive of a dependency in and of itself. only change
    // when specific requirements are met
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.disabledKeys, state.selectedItem, state.selectedKey, props.children],
  );

  return (
    <div {...tabListProps} ref={ref}>
      {[...state.collection].map((item) => (
        <Tab key={item.key} item={item} state={state} />
      ))}
    </div>
  );
}

function Tab({ item, state }: TabProps) {
  const { key, rendered } = item;
  const ref = React.useRef(null);
  const { tabProps } = useTab({ key }, state, ref);
  return (
    <div {...tabProps} ref={ref}>
      {rendered}
    </div>
  );
}

function TabPanelPanels(props: TabPanelsPanelsProps) {
  const { tabListState } = useTabPanels();

  const factory = useCallback(
    (nodes: Iterable<Node<object>>) => new ListCollection(nodes),
    [],
  );

  const collection = useCollection(props, factory, {
    suppressTextValueWarning: true,
  });

  const selectedItem = tabListState
    ? collection.getItem(tabListState.selectedKey)
    : null;

  if (!tabListState) {
    return null;
  }

  return (
    <TabPanel {...props} key={tabListState?.selectedKey} state={tabListState}>
      {selectedItem && selectedItem.props.children}
    </TabPanel>
  );
}

function TabPanel({ state, ...props }: TabPanelProps) {
  const ref = React.useRef(null);
  const { tabPanelProps } = useTabPanel(props, state, ref);
  return (
    <div {...tabPanelProps} ref={ref}>
      {props.children}
    </div>
  );
}

TabPanels.Tabs = TabPanelTabs;
TabPanels.Panels = TabPanelPanels;
