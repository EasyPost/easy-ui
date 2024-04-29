import React from "react";
import { Key } from "react-aria";
import { ListProps, ListState, Node, useListState } from "react-stately";
import { classNames, variationName } from "../utilities/css";
import { Container } from "./Container";
import { NavItem } from "./NavItem";
import { VerticalNavTypeContext } from "./context";
import type { BaseVerticalNavProps } from "./types";

import navItemStyles from "./NavItem.module.scss";

export type ListVerticalNavProps = BaseVerticalNavProps & {
  /**
   * List of navigation items to render within the navigation.
   */
  children?: ListProps<object>["children"];

  /**
   * The currently selected key in the navigation list.
   */
  selectedKey?: Key;
};

/**
 * A vertical list of navigation links.
 *
 * @example
 * ```tsx
 * <VerticalNav aria-label="Sidebar" selectedKey="1">
 *   <VerticalNav.Item key="1" href="/item-1" icon={Symbol} label="Item 1" />
 *   <VerticalNav.Item key="2" href="/item-2" icon={Symbol} label="Item 2" />
 *   <VerticalNav.Item key="3" href="/item-3" icon={Symbol} label="Item 3" />
 *   <VerticalNav.Item key="4" href="/item-4" icon={Symbol} label="Item 4" />
 * </VerticalNav>
 * ```
 */
export function ListVerticalNav(props: ListVerticalNavProps) {
  const { selectedKey, ...listStateProps } = props;
  const state = useListState({
    ...listStateProps,
    selectedKeys: selectedKey ? [selectedKey] : [],
    selectionMode: "single",
  });
  return (
    <VerticalNavTypeContext.Provider value="list">
      <Container {...props}>
        {[...state.collection].map((item) => (
          <ListNavItem key={item.key} item={item} state={state} />
        ))}
      </Container>
    </VerticalNavTypeContext.Provider>
  );
}

type ListNavItemProps = {
  item: Node<object>;
  state: ListState<object>;
};

function ListNavItem({ item, state }: ListNavItemProps) {
  const isSelected = state.selectionManager.isSelected(item.key);
  return (
    <NavItem
      key={item.key}
      item={item}
      className={classNames(
        isSelected && navItemStyles[variationName("selected", "list")],
      )}
      isChildrenVisible={isSelected}
      isSelected={isSelected}
    />
  );
}
