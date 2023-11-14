import React from "react";
import { ListProps, useListState } from "react-stately";
import { classNames } from "../utilities/css";
import { Container } from "./Container";
import { NavItem } from "./NavItem";
import { VerticalNavTypeContext } from "./context";
import type { BaseVerticalNavProps } from "./types";

import styles from "./NavItem.module.scss";

export type ListVerticalNavProps = BaseVerticalNavProps & ListProps<object>;

export function ListVerticalNav(props: ListVerticalNavProps) {
  const state = useListState({ ...props, selectionMode: "single" });
  return (
    <VerticalNavTypeContext.Provider value="list">
      <Container {...props}>
        {[...state.collection].map((item) => {
          const isSelected = state.selectionManager.isSelected(item.key);
          return (
            <NavItem
              key={item.key}
              item={item}
              className={classNames(isSelected && styles.listSelected)}
              isChildrenVisible={isSelected}
              isSelected={isSelected}
            />
          );
        })}
      </Container>
    </VerticalNavTypeContext.Provider>
  );
}
