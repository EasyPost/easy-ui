import React, { Key } from "react";
import { ListProps, ListState, Node, useListState } from "react-stately";
import { classNames, variationName } from "../utilities/css";
import { Container } from "./Container";
import { NavItem } from "./NavItem";
import { VerticalNavTypeContext } from "./context";
import type { BaseVerticalNavProps } from "./types";

import navItemStyles from "./NavItem.module.scss";

export type ListVerticalNavProps = BaseVerticalNavProps & {
  selectedKey?: Key;
  children?: ListProps<object>["children"];
};

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
