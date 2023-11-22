import React from "react";
import { Item } from "./Item";
import { ListVerticalNav, ListVerticalNavProps } from "./ListVerticalNav";
import { Subnav } from "./Subnav";
import { SupplementaryAction } from "./SupplementaryAction";
import { TreeVerticalNav } from "./TreeVerticalNav";

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
export function VerticalNav(props: ListVerticalNavProps) {
  return <ListVerticalNav {...props} />;
}

/**
 * Represents an item in a `<VerticalNav />`.
 */
VerticalNav.Item = Item;

/**
 * Represents a nested navigation within a `<VerticalNav />`.
 */
VerticalNav.Subnav = Subnav;

/**
 * Represents a default supplementary action in a `<VerticalNav />`.
 */
VerticalNav.SupplementaryAction = SupplementaryAction;

export { TreeVerticalNav as ExpandableVerticalNav };
