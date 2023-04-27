import { mergeRefs } from "@react-aria/utils";
import React, { forwardRef, useRef } from "react";
import { AriaButtonProps, mergeProps, useButton } from "react-aria";
import { ButtonColor } from "../Button";
import {
  filterButtonDOMProps,
  logWarningIfInvalidColorVariantCombination,
} from "../Button/utilities";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";
import styles from "./IconButton.module.scss";

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

  const ref = useRef(null);
  const { buttonProps } = useButton(props, ref);

  logWarningIfInvalidColorVariantCombination(color, variant);

  return (
    <button
      {...mergeProps(filterButtonDOMProps(restProps), buttonProps)}
      disabled={isDisabled}
      ref={mergeRefs(ref, inRef)}
      className={classNames(
        styles.IconButton,
        styles[variationName("variant", variant)],
        styles[variationName("color", color)],
      )}
    >
      <Text visuallyHidden>{accessibilityLabel}</Text>
      <Icon symbol={icon} />
    </button>
  );
});

IconButton.displayName = "IconButton";
