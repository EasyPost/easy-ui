import React from "react";
import { Key } from "react-aria";
import { Node, TreeProps, TreeState, useTreeState } from "react-stately";
import { classNames, variationName } from "../utilities/css";
import { Container } from "./Container";
import { ExpandButton } from "./ExpandButton";
import { NavItem } from "./NavItem";
import { VerticalNavTypeContext } from "./context";
import type { BaseVerticalNavProps } from "./types";

import navItemStyles from "./NavItem.module.scss";

export type TreeVerticalNavProps = BaseVerticalNavProps & {
  /**
   * List of navigation items to render within the navigation.
   */
  children?: TreeProps<object>["children"];

  /**
   * The initial expanded keys in the navigation (uncontrolled).
   */
  defaultExpandedKeys?: TreeProps<object>["defaultExpandedKeys"];

  /**
   * The currently expanded keys in the navigation (controlled).
   */
  expandedKeys?: TreeProps<object>["expandedKeys"];

  /**
   * Handler that is called when navigation items are expanded or collapsed.
   */
  onExpandedChange?: TreeProps<object>["onExpandedChange"];

  /**
   * The currently selected key in the navigation list.
   */
  selectedKey?: Key;
};

/**
 * A vertical list of expandable navigation links.
 *
 * @example
 * ```tsx
 * <ExpandableVerticalNav
 *   aria-label="Sidebar"
 *   selectedKey="1"
 *   expandedKeys={expandedKeys}
 *   onExpandedChange={(keys) => {
 *     setExpandedKeys(keys);
 *   }}
 * >
 *   <VerticalNav.Item key="1" href="/item-1" icon={Symbol} label="Item 1" />
 *   <VerticalNav.Item key="2" href="/item-2" icon={Symbol} label="Item 2">
 *     <VerticalNav.Subnav selectedKey="2a">
 *       <VerticalNav.Item key="2a" href="/subitem-1" label="Subitem 1">
 *         <VerticalNav.Subnav selectedKey="2a1">
 *           <VerticalNav.Item key="2a1" href="/subitem-1a" label="Item 1" />
 *           <VerticalNav.Item key="2a2" href="/subitem-1b" label="Item 2" />
 *         </VerticalNav.Subnav>
 *       </VerticalNav.Item>
 *       <VerticalNav.Item key="2b" href="/subitem-2" label="Subitem 2" />
 *     </VerticalNav.Subnav>
 *   </VerticalNav.Item>
 *   <VerticalNav.Item key="3" href="/item-3" icon={Symbol} label="Item 3" />
 *   <VerticalNav.Item key="4" href="/item-4" icon={Symbol} label="Item 4" />
 * </ExpandableVerticalNav>
 * ```
 */
export function TreeVerticalNav(props: TreeVerticalNavProps) {
  const { selectedKey, ...treeStateProps } = props;
  const state = useTreeState({
    ...treeStateProps,
    selectedKeys: selectedKey ? [selectedKey] : [],
    selectionMode: "single",
  });
  return (
    <VerticalNavTypeContext.Provider value="tree">
      <Container {...props}>
        {[...state.collection].map((item) => (
          <TreeNavItem key={item.key} item={item} state={state} />
        ))}
      </Container>
    </VerticalNavTypeContext.Provider>
  );
}

type TreeNavItemProps = {
  item: Node<object>;
  state: TreeState<object>;
};

function TreeNavItem({ item, state }: TreeNavItemProps) {
  const isSelected = state.selectionManager.isSelected(item.key);
  const isExpanded = state.expandedKeys.has(item.key);
  return (
    <NavItem
      item={item}
      className={classNames(
        isSelected && navItemStyles[variationName("selected", "tree")],
      )}
      isChildrenVisible={isExpanded}
      isSelected={isSelected}
      isExpanded={isExpanded}
      expansionSlot={
        item.props.children && (
          <ExpandButton
            isExpanded={isExpanded}
            onPress={() => {
              state.toggleKey(item.key);
            }}
          />
        )
      }
    />
  );
}
