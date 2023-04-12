import React, { ReactNode, useRef } from "react";
import { AriaButtonProps, useButton } from "react-aria";
import { Icon } from "../Icon";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";
import { logWarningIfInvalidColorVariantCombination } from "./utilities";

import styles from "./Button.module.scss";

export type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "neutral"
  | "support"
  | "inverse";

export type ButtonVariant = "filled" | "outlined" | "link";
export type ButtonSize = "sm" | "md";

export type ButtonProps = AriaButtonProps<"button"> & {
  /** Button color */
  color?: ButtonColor;
  /** Button variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Disables button */
  isDisabled?: boolean;
  /** Button will grow to width of container */
  isBlock?: boolean;
  /** Positions icon symbol before children */
  iconAtStart?: IconSymbol;
  /** Positions icon symbol after children */
  iconAtEnd?: IconSymbol;
  /** Content inside button  */
  children?: ReactNode;
  /** Link's destination */
  href?: string;
};

export function Button(props: ButtonProps) {
  const {
    color = "primary",
    variant = "filled",
    size = "md",
    isDisabled = false,
    isBlock = false,
    iconAtStart,
    iconAtEnd,
    children = "Button",
    href = "",
  } = props;

  const ref = useRef(null);
  const As = href ? "a" : "button";
  const { buttonProps: elementProps } = useButton(
    { ...props, elementType: As },
    ref,
  );

  const bothIconPropsDefined = iconAtEnd && iconAtStart;
  if (bothIconPropsDefined) {
    // eslint-disable-next-line no-console
    console.warn("Cannot simultaneously define `iconAtEnd` and `iconAtStart`");
  }

  const canUseIcon =
    (iconAtEnd || iconAtStart) &&
    !bothIconPropsDefined &&
    variant !== "link" &&
    size !== "sm";

  logWarningIfInvalidColorVariantCombination(color, variant);

  return (
    <As
      disabled={isDisabled}
      ref={ref}
      className={classNames(
        styles.Button,
        styles[variationName("color", color)],
        styles[variationName("variant", variant)],
        styles[variationName("size", size)],
        isBlock && styles.block,
      )}
      {...elementProps}
    >
      {iconAtStart && canUseIcon && <Icon symbol={iconAtStart} />}
      <span
        className={classNames(
          iconAtStart && canUseIcon && styles.iconAtStart,
          iconAtEnd && canUseIcon && styles.iconAtEnd,
        )}
      >
        {children}
      </span>
      {iconAtEnd && canUseIcon && <Icon symbol={iconAtEnd} />}
    </As>
  );
}

Button.ezuiName = "Button";
