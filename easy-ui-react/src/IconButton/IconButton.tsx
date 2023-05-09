import React, { forwardRef } from "react";
import { AriaButtonProps } from "react-aria";
import { ButtonColor } from "../Button";
import { logWarningIfInvalidColorVariantCombination } from "../Button/utilities";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";
import styles from "./IconButton.module.scss";
import { UnstyledButton } from "../UnstyledButton";

export type IconButtonVariant = "filled" | "outlined";

export type IconButtonProps = AriaButtonProps & {
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

export const IconButton = forwardRef<null, IconButtonProps>((props, inRef) => {
  const {
    color = "primary",
    variant = "filled",
    icon,
    accessibilityLabel,
    isDisabled = false,
    ...restProps
  } = props;

  logWarningIfInvalidColorVariantCombination(color, variant);

  return (
    <UnstyledButton
      isDisabled={isDisabled}
      ref={inRef}
      className={classNames(
        styles.IconButton,
        styles[variationName("variant", variant)],
        styles[variationName("color", color)],
      )}
      {...restProps}
    >
      <Text visuallyHidden>{accessibilityLabel}</Text>
      <Icon symbol={icon} />
    </UnstyledButton>
  );
});

IconButton.displayName = "IconButton";
