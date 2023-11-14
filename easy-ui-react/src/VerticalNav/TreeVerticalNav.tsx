import React from "react";
import { Node, TreeProps, TreeState, useTreeState } from "react-stately";
import { classNames, variationName } from "../utilities/css";
import { Container } from "./Container";
import { ExpandButton } from "./ExpandButton";
import { NavItem } from "./NavItem";
import { VerticalNavTypeContext } from "./context";
import type { BaseVerticalNavProps } from "./types";

import navItemStyles from "./NavItem.module.scss";

export type TreeVerticalNavProps = BaseVerticalNavProps & TreeProps<object>;

export function TreeVerticalNav(props: TreeVerticalNavProps) {
  const state = useTreeState({ ...props, selectionMode: "single" });
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
