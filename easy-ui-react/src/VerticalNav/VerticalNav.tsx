import React from "react";
import { Item } from "./Item";
import { ListVerticalNav, ListVerticalNavProps } from "./ListVerticalNav";
import { Subnav } from "./Subnav";
import { SupplementaryAction } from "./SupplementaryAction";
import { TreeVerticalNav } from "./TreeVerticalNav";

export function VerticalNav(props: ListVerticalNavProps) {
  return <ListVerticalNav {...props} />;
}

VerticalNav.Item = Item;
VerticalNav.Subnav = Subnav;
VerticalNav.SupplementaryAction = SupplementaryAction;

export { TreeVerticalNav as ExpandableVerticalNav };
