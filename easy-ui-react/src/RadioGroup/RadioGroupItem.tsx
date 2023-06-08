import React, { ReactNode } from "react";
import { VisuallyHidden, useFocusRing, useHover, useRadio } from "react-aria";
import { ValidationState } from "react-stately";
import { HorizontalStack } from "../HorizontalStack";
import { SelectorErrorTooltip } from "../SelectorErrorTooltip";
import { Text } from "../Text";
import { classNames } from "../utilities/css";
import { useRadioGroupContext } from "./RadioGroupContext";

import styles from "./RadioGroupItem.module.scss";

export type RadioGroupItemProps = {
  /**
   * The label for the radio.
   */
  children: ReactNode;

  /**
   * Error text that appears in a tooltip.
   */
  errorText?: ReactNode;

  /**
   * Whether the radio button is disabled or not.
   */
  isDisabled?: boolean;

  /**
   * Whether the radio should display its "valid" or "invalid" visual styling
   * @default valid
   */
  validationState?: ValidationState;

  /**
   * The value of the radio button, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#Value).
   */
  value: string;
};

export function RadioGroupItem(props: RadioGroupItemProps) {
  const { children, errorText, validationState } = props;

  const ref = React.useRef(null);
  const state = useRadioGroupContext();

  const { inputProps, isSelected, isDisabled } = useRadio(props, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover(props);

  const className = classNames(
    styles.RadioGroupItem,
    isSelected && styles.selected,
    isDisabled && styles.disabled,
    isFocusVisible && styles.focusVisible,
    isHovered && styles.hovered,
    validationState === "invalid" && styles.invalid,
  );

  const textColor = isDisabled
    ? "disabled"
    : validationState === "invalid"
    ? "danger"
    : "primary";

  return (
    <HorizontalStack
      gap="1"
      inline
      blockAlign="center"
      className={className}
      data-testid="root"
    >
      <HorizontalStack
        as="label"
        inline
        blockAlign="start"
        gap="1"
        wrap={false}
        {...hoverProps}
      >
        <VisuallyHidden>
          <input {...inputProps} {...focusProps} ref={ref} />
        </VisuallyHidden>
        <span className={styles.radioOuter}>
          <span className={styles.radioInner} />
        </span>
        <Text variant="body1" color={textColor}>
          {children}
        </Text>
      </HorizontalStack>
      {validationState === "invalid" && errorText && (
        <SelectorErrorTooltip content={errorText} />
      )}
    </HorizontalStack>
  );
}
