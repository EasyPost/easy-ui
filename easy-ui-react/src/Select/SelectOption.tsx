import React, { ReactNode } from "react";
import { useOption } from "react-aria";
import { Item, Node, SelectState } from "react-stately";
import { Text } from "../Text";
import { NoInfer } from "../types";

import styles from "./Select.module.scss";

export type SelectOptionProps = {
  /** An accessibility label for the option. */
  "aria-label"?: string;
  /** Rendered contents of the option or child options. */
  children: ReactNode;
};

/**
 * @privateRemarks
 * This is what is exposed as `<Select.Option />`. This is a wrapper around
 * @react-stately's Item component to control the props that are
 * allowed for the component.
 */
export function SelectOption<T>(_props: SelectOptionProps & NoInfer<T>) {
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
