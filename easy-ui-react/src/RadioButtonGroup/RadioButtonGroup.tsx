import React, { ReactNode } from "react";
import { Key } from "react-aria";
import { AriaLabelingProps } from "@react-types/shared";
import { ToggleButtonGroup, ToggleButton } from "react-aria-components";
import { classNames, getComponentThemeToken } from "../utilities/css";
import { ThemeColorAliases } from "../types";
import { Text } from "../Text";

import styles from "./RadioButtonGroup.module.scss";

export type RadioButtonGroupButtonProps = {
  /**
   * The label for the radio button.
   */
  children: ReactNode;
  /**
   * Whether the radio button is disabled or not.
   */
  isDisabled?: boolean;
  /**
   * An identifier for the item in selectedKeys.
   */
  id: string;
};

/**
 * Represents an button in a `<RadioButtonGroup />`.
 */

function RadioButtonGroupButton(props: RadioButtonGroupButtonProps) {
  const { children, isDisabled, id } = props;

  return (
    <ToggleButton
      className={classNames(styles.RadioButtonGroupButton)}
      isDisabled={isDisabled}
      id={id}
    >
      <Text variant="small_button">{children}</Text>
    </ToggleButton>
  );
}

export type RadioButtonGroupProps = AriaLabelingProps & {
  /**
   * Color for the selected button in the group.
   * @default "primary.500"
   */
  color?: ThemeColorAliases;
  /**
   * Whether single or multiple selection is enabled.
   * @default "single"
   */
  selectionMode?: "single" | "multiple";
  /**
   * Whether the collection allows empty selection.
   */
  disallowEmptySelection?: boolean;
  /**
   * The currently selected keys in the collection (controlled).
   */
  selectedKeys?: Iterable<Key>;
  /**
   * The initial selected keys in the collection (uncontrolled).
   */
  defaultSelectedKeys?: Iterable<Key>;
  /**
   * Whether all items are disabled.
   */
  isDisabled?: boolean;
  /**
   * RadioButtonGroup Buttons
   */
  children: ReactNode;
  /**
   * Handler that is called when the selection changes.
   */
  onSelectionChange?: (keys: Set<Key>) => void;
};

/**
 * A group of connected buttons that act as a radio group.
 *
 * @remarks
 * Use a radio button group to toggle between two or more
 * values for a given attribute.
 *
 * @example
 * ```tsx
 * <RadioButtonGroup defaultSelectedKeys={["first"]}>
 *   <RadioButtonGroup.Button id="first">First item</RadioButtonGroup.Button>
 *   <RadioButtonGroup.Button id="second">
 *     Second item
 *   </RadioButtonGroup.Button>
 * </RadioButtonGroup>
 * ```
 *
 * @example
 * _Default selected keys:_
 * ```tsx
 * <RadioButtonGroup defaultSelectedKeys={["first"]}>
 *   <RadioButtonGroup.Button id="first">First item</RadioButtonGroup.Button>
 *   <RadioButtonGroup.Button id="second">
 *     Second item
 *   </RadioButtonGroup.Button>
 * </RadioButtonGroup>
 * ```
 *
 * @example
 * _Controlled value:_
 * ```tsx
 * <RadioButtonGroup selectedKeys={["first"]}  onSelectionChange={(value) => ()}>
 *   <RadioButtonGroup.Button id="first">First item</RadioButtonGroup.Button>
 *   <RadioButtonGroup.Button id="second">
 *     Second item
 *   </RadioButtonGroup.Button>
 * </RadioButtonGroup>
 * ```
 */

export function RadioButtonGroup(props: RadioButtonGroupProps) {
  const {
    color = "primary.500",
    children,
    onSelectionChange,
    selectedKeys,
    selectionMode = "single",
    disallowEmptySelection,
    defaultSelectedKeys,
    isDisabled,
  } = props;

  const style = {
    ...getComponentThemeToken("radio-button-group", "color", "color", color),
  };
  return (
    <ToggleButtonGroup
      style={style}
      className={styles.RadiobuttonGroup}
      onSelectionChange={onSelectionChange}
      selectedKeys={selectedKeys}
      selectionMode={selectionMode}
      disallowEmptySelection={disallowEmptySelection}
      defaultSelectedKeys={defaultSelectedKeys}
      isDisabled={isDisabled}
    >
      {children}
    </ToggleButtonGroup>
  );
}

RadioButtonGroup.Button = RadioButtonGroupButton;
