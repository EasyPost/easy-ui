import React from "react";
import { TreeProps, useTreeState } from "react-stately";
import { Container } from "./Container";
import { TreeVerticalNavItem } from "./TreeVerticalNavItem";
import { VerticalNavTypeContext } from "./context";
import type { BaseVerticalNavProps } from "./types";

export type TreeVerticalNavProps = BaseVerticalNavProps & TreeProps<object>;

export function TreeVerticalNav(props: TreeVerticalNavProps) {
  const state = useTreeState({ ...props, selectionMode: "single" });
  return (
    <VerticalNavTypeContext.Provider value="tree">
      <Container {...props}>
        {[...state.collection].map((item) => (
          <TreeVerticalNavItem key={item.key} state={state} item={item} />
        ))}
      </Container>
    </VerticalNavTypeContext.Provider>
  );
}
