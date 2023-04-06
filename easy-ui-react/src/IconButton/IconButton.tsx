import React, { useRef } from "react";
import { AriaButtonProps, useButton } from "react-aria";
import { Icon } from "../Icon";
import { ButtonColor } from "../Button";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";
import { logWarningIfInvalidColorVariantCombination } from "../Button/utilities";
import styles from "./IconButton.module.scss";

export type IconButtonVariant = "filled" | "outlined";

export type IconButtonProps = AriaButtonProps<"button"> & {
  /** Button color */
  color?: ButtonColor;
  /** Button variant */
  variant?: IconButtonVariant;
  /** Icon symbol */
  icon: IconSymbol;
  /** Description of icon */
  accessibilityLabel: string;
  /** Disables button */
  isDisabled?: boolean;
};

export function IconButton(props: IconButtonProps) {
  const {
    color = "primary",
    variant = "filled",
    icon,
    accessibilityLabel,
    isDisabled = false,
  } = props;

  const ref = useRef(null);
  const { buttonProps } = useButton(props, ref);

  logWarningIfInvalidColorVariantCombination(color, variant);

  return (
    <button
      disabled={isDisabled}
      ref={ref}
      className={classNames(
        styles.IconButton,
        styles[variationName("variant", variant)],
        styles[variationName("color", color)],
      )}
      {...buttonProps}
    >
      <Text visuallyHidden>{accessibilityLabel}</Text>
      <Icon symbol={icon} />
    </button>
  );
}
