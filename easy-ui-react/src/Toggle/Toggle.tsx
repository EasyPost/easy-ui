import React, { ReactNode } from "react";
import {
  mergeProps,
  useFocusRing,
  useHover,
  useSwitch,
  VisuallyHidden,
} from "react-aria";
import { useToggleState } from "react-stately";
import { Text } from "../Text";
import { classNames } from "../utilities/css";

import styles from "./Toggle.module.scss";

export type ToggleProps = {
  /**
   * The label for the toggle.
   */
  children?: ReactNode;

  /**
   * Whether the toggle should be selected (uncontrolled).
   */
  defaultSelected?: boolean;

  /**
   * Disables the toggle.
   */
  isDisabled?: boolean;

  /**
   * Marks the toggle as immutable.
   */
  isReadOnly?: boolean;

  /**
   * Whether the toggle should be selected (controlled).
   */
  isSelected?: boolean;

  /**
   * The name of the toggle, used when submitting an HTML form.
   */
  name?: string;

  /**
   * Handler that is called when the toggle's selection state changes.
   */
  onChange?: (isSelected: boolean) => void;

  /**
   * The value of the toggle, used when submitting an HTML form.
   */
  value?: string;
};

export function Toggle(props: ToggleProps) {
  const { children, isDisabled, isReadOnly } = props;

  const ref = React.useRef(null);
  const state = useToggleState(props);
  const { inputProps } = useSwitch(props, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover(props);
  const isSelected = state.isSelected;

  const className = classNames(
    styles.Toggle,
    isSelected && styles.selected,
    isDisabled && styles.disabled,
    isReadOnly && styles.readOnly,
    isFocusVisible && styles.focusVisible,
    isHovered && styles.hovered,
  );

  const textColor = isDisabled ? "disabled" : "primary";

  const LabelComponent = children ? "label" : "span";
  const labelProps = children ? hoverProps : {};
  const additionalInputProps = children
    ? focusProps
    : mergeProps(focusProps, hoverProps);

  return (
    <LabelComponent className={className} {...labelProps}>
      <VisuallyHidden>
        <input {...mergeProps(inputProps, additionalInputProps)} ref={ref} />
      </VisuallyHidden>
      <span className={styles.switch}>
        <svg width={32} height={16} aria-hidden="true">
          <rect
            className={styles.switchRect}
            x={0}
            y={0}
            width={32}
            height={16}
            rx={8}
          />
          <circle
            className={styles.switchCircle}
            cx={isSelected ? 32 - 8 : 8}
            cy={8}
            r={6}
          />
        </svg>
      </span>
      {children && (
        <span className={styles.text}>
          <Text variant="body1" color={textColor}>
            {children}
          </Text>
        </span>
      )}
    </LabelComponent>
  );
}
