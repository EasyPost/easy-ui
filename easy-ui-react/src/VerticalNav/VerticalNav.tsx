import React from "react";
import { ListVerticalNav, ListVerticalNavProps } from "./ListVerticalNav";
import { Item } from "./Item";
import { Subnav } from "./Subnav";
import { TreeVerticalNav } from "./TreeVerticalNav";

export function VerticalNav(props: ListVerticalNavProps) {
  return <ListVerticalNav {...props} />;
}

VerticalNav.Item = Item;
VerticalNav.Subnav = Subnav;

export { TreeVerticalNav as ExpandableVerticalNav };
