import omit from "lodash/omit";
import React, {
  ComponentPropsWithoutRef,
  ElementType,
  MutableRefObject,
  ReactNode,
} from "react";
import { mergeProps, useMenuItem } from "react-aria";
import { Item, Node, TreeState } from "react-stately";
import { Checkbox } from "../Checkbox";
import { Text } from "../Text";
import { NoInfer } from "../types";
import {
  isSelectAllIndeterminate,
  isSelectAllSelected,
  SELECT_ALL_KEY,
} from "./utilities";

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
   * If `href` is provided, a custom component to render for the link. Useful for
   * framework link components like next/link.
   * @default "a"
   */
  hrefComponent?: ElementType;

  /** If `href` is provided, the relationship between the linked resource and the current page. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel). */
  rel?: string;

  /** If `href` is provided, the target window for the link. */
  target?: string;
};

/**
 * @privateRemarks
 * This is what is exposed as `<Menu.Item />`. This is a wrapper around
 * @react-stately's Item collection component to control the props that are
 * allowed for the component.
 */
export function MenuItem<T>(_props: MenuItemProps & NoInfer<T>) {
  return null;
}
Object.assign(MenuItem, Item);

type MenuItemContentProps<T> = {
  item: Node<T>;
  state: TreeState<T>;
};

export function MenuItemContent<T>({ item, state }: MenuItemContentProps<T>) {
  const ref = React.useRef(null);
  const {
    selectionManager: { selectionMode },
  } = state;
  const { closeOnSelect, href } = item.props;
  const { menuItemProps, isFocused, isSelected, isDisabled } = useMenuItem(
    { ...item, closeOnSelect },
    state,
    ref,
  );

  const MenuItemContainer = href
    ? LinkMenuItemContainer
    : StandardMenuItemContainer;

  const props = mergeProps(
    menuItemProps,
    href
      ? omit(item.props, ["aria-label", "as", "children", "closeOnSelect"])
      : item.key === SELECT_ALL_KEY
        ? { "aria-checked": isSelectAllSelected(state) }
        : {},
  );

  return (
    <MenuItemContainer
      {...props}
      itemRef={ref}
      className={styles.item}
      data-is-disabled={isDisabled}
      data-is-focused={isFocused}
      data-is-selected={
        item.key === SELECT_ALL_KEY ? isSelectAllSelected(state) : isSelected
      }
    >
      <div className={styles.itemContent}>
        {selectionMode !== "multiple" ? (
          <Text variant="body1" truncate>
            {item.rendered}
          </Text>
        ) : (
          <Checkbox
            isDisabled={isDisabled}
            isIndeterminate={
              item.key === SELECT_ALL_KEY
                ? isSelectAllIndeterminate(state)
                : undefined
            }
            isSelected={
              item.key === SELECT_ALL_KEY
                ? isSelectAllSelected(state)
                : isSelected
            }
          >
            {item.rendered}
          </Checkbox>
        )}
      </div>
    </MenuItemContainer>
  );
}

type ContainerProps = ComponentPropsWithoutRef<ElementType> & {
  itemRef: MutableRefObject<null>;
  hrefComponent?: ElementType;
};

function StandardMenuItemContainer({ itemRef, ...props }: ContainerProps) {
  return <li ref={itemRef} {...props} />;
}

function LinkMenuItemContainer({
  itemRef,
  hrefComponent: Component = "a",
  ...props
}: ContainerProps) {
  return (
    <li role="none">
      <Component ref={itemRef} {...props} />
    </li>
  );
}
