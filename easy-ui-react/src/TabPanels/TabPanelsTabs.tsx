import { AriaLabelingProps, ItemElement, Node } from "@react-types/shared";
import React, { useEffect } from "react";
import { useTab, useTabList } from "react-aria";
import { TabListState, useTabListState } from "react-stately";
import { useTabPanels } from "./context";

type TabPanelsTabsProps = AriaLabelingProps & {
  /**
   * The tab items to display. Item keys should match the key of the
   * corresponding <Item> within the <TabPanels.Panels> element.
   */
  children: ItemElement<object> | ItemElement<object>[];
};

type TabProps = {
  item: Node<object>;
  state: TabListState<object>;
};

export function TabPanelsTabs(props: TabPanelsTabsProps) {
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
        <TabPanelsTab key={item.key} item={item} state={state} />
      ))}
    </div>
  );
}

function TabPanelsTab({ item, state }: TabProps) {
  const { key, rendered } = item;
  const ref = React.useRef(null);
  const { tabProps } = useTab({ key }, state, ref);
  return (
    <div {...tabProps} ref={ref}>
      {rendered}
    </div>
  );
}
