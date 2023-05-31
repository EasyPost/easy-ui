import React, { ReactNode } from "react";
import { useCheckbox, useFocusRing, VisuallyHidden } from "react-aria";
import { useToggleState, ValidationState } from "react-stately";
import { Icon } from "../Icon";
import { Text } from "../Text";

import styles from "./Checkbox.module.scss";
import { classNames } from "../utilities/css";

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
  const state = useToggleState(props);
  const ref = React.useRef(null);
  const { inputProps } = useCheckbox(props, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const isSelected = state.isSelected && !props.isIndeterminate;

  const className = classNames(styles.Checkbox);

  return (
    <label className={className}>
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <svg width={24} height={24} aria-hidden="true" style={{ marginRight: 4 }}>
        <rect
          x={isSelected ? 4 : 5}
          y={isSelected ? 4 : 5}
          width={isSelected ? 16 : 14}
          height={isSelected ? 16 : 14}
          fill={isSelected ? "orange" : "none"}
          stroke={isSelected ? "none" : "gray"}
          strokeWidth={2}
        />
        {isSelected && (
          <path
            transform="translate(7 7)"
            d={`M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1
            1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712
            6A.999.999 0 0 1 3.788 9z`}
          />
        )}
        {props.isIndeterminate && (
          <rect x={7} y={11} width={10} height={2} fill="gray" />
        )}
        {isFocusVisible && (
          <rect
            x={1}
            y={1}
            width={22}
            height={22}
            fill="none"
            stroke="orange"
            strokeWidth={2}
          />
        )}
      </svg>
      {props.children}
    </label>
  );
}
