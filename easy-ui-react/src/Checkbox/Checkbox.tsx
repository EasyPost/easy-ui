import React, { ReactNode } from "react";
import { useCheckbox, useFocusRing, VisuallyHidden } from "react-aria";
import { useToggleState, ValidationState } from "react-stately";
import { Icon } from "../Icon";
import { Text } from "../Text";
import CheckIcon from "@easypost/easy-ui-icons/Check600";
import ErrorIcon from "@easypost/easy-ui-icons/ErrorFill";
import { classNames, variationName } from "../utilities/css";

import styles from "./Checkbox.module.scss";
import { Tooltip } from "../Tooltip";

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
  const { inputProps } = useCheckbox(props, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  const isSelected = state.isSelected && !isIndeterminate;

  const className = classNames(
    styles.Checkbox,
    isIndeterminate && styles.indeterminate,
    isSelected && styles.selected,
    isDisabled && styles.disabled,
    isReadOnly && styles.readOnly,
    isFocusVisible && styles.focusVisible,
    isNested && styles.nested,
    styles[variationName("size", size)],
    validationState === "invalid" && styles.invalid,
  );

  const textVariant =
    size === "lg" ? "subtitle1" : isNested ? "body2" : "body1";
  const textColor = isDisabled
    ? "disabled"
    : validationState === "invalid"
    ? "danger"
    : "primary";

  return (
    <label className={className}>
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <span className={styles.box}>
        {(isIndeterminate || isSelected) && (
          <span className={styles.mark}>
            {isIndeterminate ? (
              <IndeterminateIcon size={size === "lg" ? 24 : 16} />
            ) : (
              <Icon symbol={CheckIcon} size={size === "lg" ? "md" : "xs"} />
            )}
          </span>
        )}
      </span>
      <span className={styles.text}>
        <Text variant={textVariant} color={textColor}>
          {children}
        </Text>
      </span>
      {validationState === "invalid" && errorText && (
        <Tooltip content={errorText}>
          <span tabIndex={0} className={styles.errorIcon}>
            <Icon symbol={ErrorIcon} />
          </span>
        </Tooltip>
      )}
    </label>
  );
}

function IndeterminateIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={10 * (size / 16)}
      height={2 * (size / 16)}
      viewBox="0 0 10 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.indeterminateSvg}
    >
      <path d="M0 1L10 1" stroke="currentColor" strokeLinejoin="round" />
    </svg>
  );
}
