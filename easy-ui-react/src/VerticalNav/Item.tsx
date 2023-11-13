import { ComponentProps, ElementType, ReactNode } from "react";
import { Item as ReactStatelyItem } from "react-stately";
import { IconSymbol } from "../types";

export type ItemProps<T extends ElementType = "a"> = ComponentProps<T> & {
  as?: T;
  label: string;
  iconSymbol?: IconSymbol;
  children?: ReactNode;
};

type ReactStatelyItemInterface = {
  getCollectionNode: (
    props: ItemProps & { textValue: string },
    context: object,
  ) => Generator;
};

/**
 * This is a wrapper around React Stately's Item to be able to control the
 * properties and behavior of the items in our VerticalNav and
 * VerticalNav.Subnav lists.
 *
 * We map our Item's label prop to the underlying textValue prop to silence
 * warnings about Aria's accessibility paradigm.
 */
export function Item<T extends ElementType = "a">(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: ItemProps<T>,
) {
  return null;
}

const originalGetCollectionNode = (
  ReactStatelyItem as unknown as ReactStatelyItemInterface
).getCollectionNode;

const getCollectionNode = (props: ItemProps, context: object) =>
  originalGetCollectionNode({ ...props, textValue: props.label }, context);

Object.assign(Item, ReactStatelyItem, { getCollectionNode });
