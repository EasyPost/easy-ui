import React from "react";
import { ListProps, ListState, Node, useListState } from "react-stately";
import { classNames } from "../utilities/css";
import { Container } from "./Container";
import { NavItem } from "./NavItem";
import { VerticalNavTypeContext } from "./context";
import type { BaseVerticalNavProps } from "./types";

import navItemStyles from "./NavItem.module.scss";

export type ListVerticalNavProps = BaseVerticalNavProps & ListProps<object>;

export function ListVerticalNav(props: ListVerticalNavProps) {
  const state = useListState({ ...props, selectionMode: "single" });
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
      className={classNames(isSelected && navItemStyles.listSelected)}
      isChildrenVisible={isSelected}
      isSelected={isSelected}
    />
  );
}
