import { ComponentProps, ElementType } from "react";
import { Item } from "react-stately";
import { getCollectionNode } from "./NavItem";

export type SubnavItemProps<T extends ElementType = "a"> = ComponentProps<T> & {
  as?: T;
  label: string;
};

export function SubnavItem<T extends ElementType = "a">(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: SubnavItemProps<T>,
) {
  return null;
}

Object.assign(SubnavItem, Item, { getCollectionNode });
