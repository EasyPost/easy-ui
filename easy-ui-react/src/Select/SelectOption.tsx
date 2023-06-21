import React, { ReactNode } from "react";
import { useOption } from "react-aria";
import { Item, Node, SelectState } from "react-stately";
import { Text } from "../Text";
import { NoInfer } from "../types";

import styles from "./Select.module.scss";

export type SelectOptionProps = {
  /** An accessibility label for the item. */
  "aria-label"?: string;
  /** Rendered contents of the item or child items. */
  children: ReactNode;
};

export function SelectOption<T>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: SelectOptionProps & NoInfer<T>,
) {
  return null;
}

Object.assign(SelectOption, Item);

type SelectOptionContentProps<T> = {
  item: Node<T>;
  state: SelectState<T>;
};

export function SelectOptionContent<T>({
  item,
  state,
}: SelectOptionContentProps<T>) {
  const ref = React.useRef(null);
  const { optionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: item.key },
    state,
    ref,
  );

  return (
    <li
      {...optionProps}
      ref={ref}
      className={styles.option}
      data-is-disabled={isDisabled}
      data-is-focused={isFocused}
      data-is-selected={isSelected}
    >
      <div className={styles.optionContent}>
        <Text variant="body1" truncate>
          {item.rendered}
        </Text>
      </div>
    </li>
  );
}
