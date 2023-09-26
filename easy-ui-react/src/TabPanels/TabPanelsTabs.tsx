import { AriaLabelingProps, ItemElement, Node } from "@react-types/shared";
import React, { useEffect } from "react";
import { mergeProps, useTab, useTabList } from "react-aria";
import { TabListState, useTabListState } from "react-stately";
import { useTabPanels } from "./context";

import styles from "./TabPanelsTabs.module.scss";

type TabPanelsTabsProps = AriaLabelingProps & {
  /**
   * The tab items to display. Item keys should match the key of the
   * corresponding <Item> within the <TabPanels.Panels> element.
   */
  children: ItemElement<object> | ItemElement<object>[];
};

type TabPanelsTabProps = {
  /** The item for the tab. */
  item: Node<object>;

  /** The state for the tab. */
  state: TabListState<object>;
};

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
    // state is too comprehensive of a dependency in and of itself. only change
    // when specific requirements are met
    // https://github.com/adobe/react-spectrum/blob/main/packages/%40react-spectrum/tabs/src/Tabs.tsx#L273
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.disabledKeys, state.selectedItem, state.selectedKey, props.children],
  );

  return (
    <div ref={ref} {...tabListProps} className={styles.TabPanelsTabs}>
      {[...state.collection].map((item) => (
        <TabPanelsTab key={item.key} item={item} state={state} />
      ))}
    </div>
  );
}

function TabPanelsTab({ item, state }: TabPanelsTabProps) {
  const ref = React.useRef(null);
  const { tabProps } = useTab({ key: item.key }, state, ref);
  return (
    <div {...tabProps} ref={ref}>
      {item.rendered}
    </div>
  );
}
