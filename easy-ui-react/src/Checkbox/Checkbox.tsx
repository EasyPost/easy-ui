import CheckIcon from "@easypost/easy-ui-icons/Check600";
import RemoveIcon from "@easypost/easy-ui-icons/Remove600";
import React, { ReactNode } from "react";
import { mergeProps, useCheckbox, useFocusRing, useHover } from "react-aria";
import { ValidationState, useToggleState } from "react-stately";
import { Icon } from "../Icon";
import { SelectorErrorTooltip } from "../SelectorErrorTooltip";
import { Text } from "../Text";
import { classNames, variationName } from "../utilities/css";

import styles from "./Checkbox.module.scss";

export const DEFAULT_SIZE = "md";

export type CheckboxSize = "md" | "lg";

export type CheckboxProps = {
  /**
   * The label for the checkbox.
   */
  children?: ReactNode;

  /**
   * Whether the checkbox should be selected (uncontrolled).
   */
  defaultSelected?: boolean;

  /**
   * Error text that appears in a tooltip.
   */
  errorText?: ReactNode;

  /**
   * Disables the checkbox.
   */
  isDisabled?: boolean;

  /**
   * Marks the checkbox as indeterminate.
   */
  isIndeterminate?: boolean;

  /**
   * Marks the checkbox as immutable.
   */
  isReadOnly?: boolean;

  /**
   * Whether the checkbox should be selected (controlled).
   */
  isSelected?: boolean;

  /**
   * Whether the checkbox is nested.
   */
  isNested?: boolean;

  /**
   * The name of the checkbox, used when submitting an HTML form.
   */
  name?: string;

  /**
   * Handler that is called when the checkbox's selection state changes.
   */
  onChange?: (isSelected: boolean) => void;

  /**
   * Size of the checkbox.
   * @default md
   */
  size?: CheckboxSize;

  /**
   * Whether the input should display its "valid" or "invalid" visual styling
   * @default valid
   */
  validationState?: ValidationState;

  /**
   * The value of the checkbox, used when submitting an HTML form.
   */
  value?: string;
};

/**
 * A form element that enables a binary choice.
 *
 * @remarks
 * Use a checkbox when users are required to make a binary choice.
 *
 * @example
 * ```tsx
 * <Checkbox>Checkbox item</Checkbox>
 * ```
 *
 * @example
 * _Default value:_
 * ```tsx
 * <Checkbox defaultSelected={true}>Checkbox item</Checkbox>
 * ```
 *
 * @example
 * _Controlled:_
 * ```tsx
 * <Checkbox
 *   isSelected={isSelected}
 *   onChange={(isSelected) => setIsSelected(isSelected)}
 * >
 *   Checkbox item
 * </Checkbox>
 * ```
 */
export function Checkbox(props: CheckboxProps) {
  const {
    children,
    errorText,
    isDisabled,
    isIndeterminate,
    isReadOnly,
    isNested,
    size = DEFAULT_SIZE,
    validationState,
  } = props;

  const ref = React.useRef(null);

  const state = useToggleState(props);
  const { inputProps: inputPropsFromAria } = useCheckbox(props, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover(props);

  const isSelected = state.isSelected && !isIndeterminate;

  const className = classNames(
    styles.Checkbox,
    isIndeterminate && styles.indeterminate,
    isSelected && styles.selected,
    isDisabled && styles.disabled,
    isReadOnly && styles.readOnly,
    isNested && styles.nested,
    isFocusVisible && styles.focusVisible,
    isHovered && styles.hovered,
    styles[variationName("size", size)],
    validationState === "invalid" && styles.invalid,
    !children && styles.standalone,
  );

  const textVariant =
    size === "lg" ? "subtitle1" : isNested ? "body2" : "body1";
  const textColor = isDisabled
    ? "disabled"
    : validationState === "invalid"
      ? "danger"
      : "primary";

  if (size === "lg" && isNested) {
    console.warn("isNested is incompatible with lg Checkbox");
  }

  const RootComponent = children ? "label" : "span";
  const rootProps = children ? hoverProps : {};
  const inputProps = children
    ? mergeProps(inputPropsFromAria, focusProps)
    : mergeProps(inputPropsFromAria, focusProps, hoverProps);

  return (
    <span className={className} data-testid="root">
      <RootComponent className={styles.label} {...rootProps}>
        <input {...inputProps} className={styles.input} ref={ref} />
        <span className={styles.box}>
          {(isIndeterminate || isSelected) && (
            <span className={styles.check}>
              {isIndeterminate ? (
                <Icon symbol={RemoveIcon} size={size === "lg" ? "md" : "xs"} />
              ) : (
                <Icon symbol={CheckIcon} size={size === "lg" ? "md" : "xs"} />
              )}
            </span>
          )}
        </span>
        {children && (
          <span className={styles.text}>
            <Text variant={textVariant} color={textColor}>
              {children}
            </Text>
          </span>
        )}
      </RootComponent>
      {validationState === "invalid" && errorText && (
        <SelectorErrorTooltip content={errorText} />
      )}
    </span>
  );
}
