import { ListCollection } from "@react-stately/list";
import { Node } from "@react-types/shared";
import React, { ReactElement, ReactNode, useCallback } from "react";
import { AriaTabPanelProps, useTabPanel } from "react-aria";
import { TabListState, useCollection } from "react-stately";
import { useTabPanels } from "./context";

type TabPanelsPanelsProps = {
  /**
   * The contents of each tab. Item keys should match the key of the
   * corresponding <Item> within the <TabPanels.Tabs> element.
   */
  children: ReactElement | ReactElement[];
};

type TabPanelProps = AriaTabPanelProps & {
  /** Children of the tab panel. */
  children: ReactNode;

  /** State for the tab list. */
  state: TabListState<object>;
};

export function TabPanelsPanels(props: TabPanelsPanelsProps) {
  const { tabListState } = useTabPanels();

  const factory = useCallback(
    (nodes: Iterable<Node<object>>) => new ListCollection(nodes),
    [],
  );

  const collection = useCollection(props, factory, {
    suppressTextValueWarning: true,
  });

  if (!tabListState) {
    return null;
  }

  const selectedItem = collection.getItem(tabListState.selectedKey);

  return (
    <TabPanelsPanel
      {...props}
      key={tabListState?.selectedKey}
      state={tabListState}
    >
      {selectedItem && selectedItem.props.children}
    </TabPanelsPanel>
  );
}

function TabPanelsPanel({ state, ...props }: TabPanelProps) {
  const ref = React.useRef(null);
  const { tabPanelProps } = useTabPanel(props, state, ref);
  return (
    <div {...tabPanelProps} ref={ref}>
      {props.children}
    </div>
  );
}
