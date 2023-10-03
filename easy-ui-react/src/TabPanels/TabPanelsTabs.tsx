import { AriaLabelingProps, ItemElement, Node } from "@react-types/shared";
import React, { useEffect } from "react";
import { mergeProps, useTab, useTabList } from "react-aria";
import { TabListState, useTabListState } from "react-stately";
import { Tabs } from "../Tabs";
import { useTabPanels } from "./context";

type TabPanelsTabsProps = AriaLabelingProps & {
  /**
   * The tab items to display. Item keys should match the key of the
   * corresponding `<Item>` within the `<TabPanels.Panels>` element.
   */
  children: ItemElement<object> | ItemElement<object>[];
};

type TabPanelsTabProps = {
  /** The item for the tab. */
  item: Node<object>;

  /** The state for the tab. */
  state: TabListState<object>;
};

/**
 * Represents a container of tabs in a `<TabPanels />`.
 */
export function TabPanelsTabs(props: TabPanelsTabsProps) {
  const { tabProps, setTabListState } = useTabPanels();
  const ref = React.useRef(null);
  const mergedProps = mergeProps(tabProps, props);
  const state = useTabListState(mergedProps);
  const { tabListProps } = useTabList(mergedProps, state, ref);

  useEffect(
    () => {
      setTabListState(state);
    },
    // we don't want to listen to all state changes, only the specific ones
    // listed below since only those are relevant for updating the main
    // tab list state.
    //
    // see the reference implementation for React Spectrum:
    // https://github.com/adobe/react-spectrum/blob/main/packages/%40react-spectrum/tabs/src/Tabs.tsx#L273
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.disabledKeys, state.selectedItem, state.selectedKey, props.children],
  );

  return (
    <Tabs
      containerComponent="div"
      containerProps={{}}
      listComponent="div"
      listProps={tabListProps}
      listRef={ref}
    >
      {[...state.collection].map((item) => (
        <TabPanelsTab key={item.key} item={item} state={state} />
      ))}
    </Tabs>
  );
}

/**
 * Represents a single tab item.
 */
function TabPanelsTab({ item, state }: TabPanelsTabProps) {
  const ref = React.useRef(null);
  const { tabProps } = useTab({ key: item.key }, state, ref);
  const isSelected = state.selectedItem === item;
  const isDisabled = state.disabledKeys.has(item.key) || state.isDisabled;
  return (
    <Tabs.Item
      tabComponent="div"
      tabRef={ref}
      isSelected={isSelected}
      isDisabled={isDisabled}
      {...tabProps}
    >
      {item.rendered}
    </Tabs.Item>
  );
}
