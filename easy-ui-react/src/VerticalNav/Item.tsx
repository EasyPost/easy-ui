import { ComponentProps, ElementType, ReactNode } from "react";
import { Item as ReactStatelyItem } from "react-stately";
import { IconSymbol } from "../types";
import { RouterLinkProps } from "../utilities/router";

export type ItemProps<T extends ElementType = "a"> = ComponentProps<T> &
  RouterLinkProps & {
    /**
     * Custom element to render the item as.
     */
    as?: T;

    /**
     * Nested subnavigation for the navigation item.
     */
    children?: ReactNode;

    /**
     * Icon symbol of the navigation item. This is only applicable on top-level
     * navigation items.
     */
    icon?: IconSymbol;
  } & ItemLabelProps;

type ItemLabelProps =
  | {
      /**
       * Label shown on the navigation item.
       */
      label: string;

      /**
       * Plain-text representation of the item, used for the underlying
       * collection. Defaults to `label`.
       */
      textValue?: string;
    }
  | {
      /**
       * Label shown on the navigation item.
       */
      label: ReactNode;

      /**
       * Plain-text representation of the item, used for the underlying
       * collection. Required when `label` isn't a string.
       */
      textValue: string;
    };

export type ItemPropsForStately = ItemProps & { textValue: string };

type ReactStatelyItemInterface = {
  getCollectionNode: (props: ItemPropsForStately, context: object) => Generator;
};

/**
 * Represents a link in a navigation list.
 *
 * @privateRemarks
 * This is a wrapper around React Stately's Item to be able to control the
 * properties and behavior of the items in our VerticalNav and
 * VerticalNav.Subnav lists.
 *
 * When no textValue is given, we map a string label to the underlying
 * textValue prop to silence warnings about Aria's accessibility paradigm.
 */
export function Item<T extends ElementType = "a">(_props: ItemProps<T>) {
  return null;
}

const originalGetCollectionNode = (
  ReactStatelyItem as unknown as ReactStatelyItemInterface
).getCollectionNode;

const getCollectionNode = (props: ItemProps, context: object) =>
  originalGetCollectionNode(
    {
      ...props,
      textValue:
        props.textValue ?? (typeof props.label === "string" ? props.label : ""),
    },
    context,
  );

Object.assign(Item, ReactStatelyItem, { getCollectionNode });
