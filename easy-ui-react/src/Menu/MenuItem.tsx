import noop from "lodash/noop";
import omit from "lodash/omit";
import React, { ElementType, ReactNode } from "react";
import { mergeProps, useMenuItem } from "react-aria";
import { Item, Node, TreeState } from "react-stately";
import { Text } from "../Text";
import { NoInfer } from "../types";

import styles from "./Menu.module.scss";

export type MenuItemProps = {
  /** An accessibility label for the item. */
  "aria-label"?: string;

  /** Rendered contents of the item or child items. */
  children: ReactNode;

  /**
   * Whether the menu should close when the menu item is selected.
   * @default true
   */
  closeOnSelect?: boolean;

  /** A URL to link to if the menu item should be a link. */
  href?: string;

  /**
   * If href is provided, a custom component to render for the link. Useful for
   * framework link components like next/link.
   * @default "a"
   */
  hrefComponent?: ElementType;

  /** The relationship between the linked resource and the current page. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel). */
  rel?: string;

  /** The target window for the link. */
  target?: string;
};

type MenuItemContentProps<T> = {
  item: Node<T>;
  state: TreeState<T>;
};

export function MenuItemContent<T>({ item, state }: MenuItemContentProps<T>) {
  const ref = React.useRef(null);
  const { closeOnSelect, href } = item.props;
  const { menuItemProps, isFocused, isSelected, isDisabled } = useMenuItem(
    { ...item, closeOnSelect },
    state,
    ref,
  );
  if (href) {
    const { hrefComponent: Component = "a", ...restProps } = item.props;
    const linkProps = omit(restProps, [
      "aria-label",
      "as",
      "children",
      "closeOnSelect",
    ]);
    return (
      <li role="none">
        <Component
          {...mergeProps(menuItemProps, linkProps)}
          onPointerUp={noop}
          onKeyDown={noop}
          className={styles.item}
          ref={ref}
          data-is-disabled={isDisabled}
          data-is-focused={isFocused}
          data-is-selected={isSelected}
        >
          <div className={styles.itemContent}>
            <Text variant="body1" truncate>
              {item.rendered}
            </Text>
          </div>
        </Component>
      </li>
    );
  }
  return (
    <li
      {...menuItemProps}
      title={item.textValue}
      className={styles.item}
      ref={ref}
      data-is-disabled={isDisabled}
      data-is-focused={isFocused}
      data-is-selected={isSelected}
    >
      <div className={styles.itemContent}>
        <Text variant="body1" truncate>
          {item.rendered}
        </Text>
      </div>
    </li>
  );
}

// Lightweight component wrapper around @react-stately's Item component
// to control the props that are allowed into the component
//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function MenuItem<T>(_props: MenuItemProps & NoInfer<T>) {
  return null;
}
Object.assign(MenuItem, Item);
