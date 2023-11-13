import React from "react";
import { ListProps, useListState } from "react-stately";
import { Container } from "./Container";
import { ListVerticalNavItem } from "./ListVerticalNavItem";
import { VerticalNavTypeContext } from "./context";
import type { BaseVerticalNavProps } from "./types";

export type ListVerticalNavProps = BaseVerticalNavProps & ListProps<object>;

export function ListVerticalNav(props: ListVerticalNavProps) {
  const state = useListState({ ...props, selectionMode: "single" });
  return (
    <VerticalNavTypeContext.Provider value="list">
      <Container {...props}>
        {[...state.collection].map((item) => (
          <ListVerticalNavItem key={item.key} state={state} item={item} />
        ))}
      </Container>
    </VerticalNavTypeContext.Provider>
  );
}
