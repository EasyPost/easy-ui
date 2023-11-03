import { ComponentProps, ElementType } from "react";
import { Item } from "react-stately";
import { IconSymbol } from "../types";

export type NavItemProps<T extends ElementType = "a"> = ComponentProps<T> & {
  as?: T;
  label: string;
  iconSymbol: IconSymbol;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function NavItem<T extends ElementType = "a">(_props: NavItemProps<T>) {
  return null;
}

const originalGetCollectionNode = (
  Item as unknown as {
    getCollectionNode: (
      props: NavItemProps & { textValue: string },
      context: object,
    ) => void;
  }
).getCollectionNode;
function getCollectionNode(props: NavItemProps, context: object) {
  return originalGetCollectionNode(
    { ...props, textValue: props.label },
    context,
  );
}

Object.assign(NavItem, Item, { getCollectionNode });
