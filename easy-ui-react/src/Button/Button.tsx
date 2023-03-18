import React, { ReactElement, ReactNode, useRef } from "react";
import { useButton } from "react-aria";
import { IconProps } from "../Icon";
import { classNames, variationName } from "../utilities/css";
import { ButtonColor } from "../types";
import { logWarningIfInvalidColorVariantCombination } from "./utilities";

import styles from "./Button.module.scss";

export type ButtonVariant = "filled" | "outlined" | "link";
export type ButtonSize = "sm" | "md";

export type ButtonProps = {
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
  /** Positions icon before children */
  iconAtStart?: ReactElement<IconProps>;
  /** Positions icon after children */
  iconAtEnd?: ReactElement<IconProps>;
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
    iconAtStart = null,
    iconAtEnd = null,
    children = "Button",
    href = "",
  } = props;

  const ref = useRef(null);
  const As = href ? "a" : "button";
  const { buttonProps: elementProps } = useButton(
    { ...props, elementType: As },
    ref,
  );
  const canUseIcon =
    (iconAtEnd || iconAtStart) && variant !== "link" && size !== "sm";

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
      {iconAtStart && canUseIcon && React.cloneElement(iconAtStart)}
      <span
        className={classNames(
          iconAtStart && canUseIcon && styles.iconAtStart,
          iconAtEnd && canUseIcon && styles.iconAtEnd,
        )}
      >
        {children}
      </span>
      {iconAtEnd && canUseIcon && React.cloneElement(iconAtEnd)}
    </As>
  );
}
