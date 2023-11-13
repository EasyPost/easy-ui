import React from "react";
import { NavItem } from "./Item";
import { ListVerticalNav, ListVerticalNavProps } from "./ListVerticalNav";
import { Subnav } from "./Subnav";
import { TreeVerticalNav } from "./TreeVerticalNav";

export function VerticalNav(props: ListVerticalNavProps) {
  return <ListVerticalNav {...props} />;
}

VerticalNav.Item = NavItem;
VerticalNav.Subnav = Subnav;

export { TreeVerticalNav as ExpandableVerticalNav };
