import React, { ReactElement, ReactNode, useRef } from "react";
import { IconProps } from "Icon";
import { useButton } from "@react-aria/button";
import { classNames, variationName } from "../utilities/css";

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

  if (!isValidColorVariantCombination(color, variant)) {
    // eslint-disable-next-line no-console
    console.warn(
      `The color '${color}' is not supported with the '${variant}' variant`,
    );
  }

  return (
    <As
      disabled={isDisabled}
      ref={ref}
      className={classNames(
        styles.Button,
        styles[variationName("color", color)],
        styles[variationName("variant", variant)],
        styles[variationName("size", size)],
        isBlock && styles.ButtonBlock,
      )}
      {...elementProps}
    >
      {iconAtStart && canUseIcon && React.cloneElement(iconAtStart)}
      <span
        className={classNames(
          iconAtStart && canUseIcon && styles.StartIcon,
          iconAtEnd && canUseIcon && styles.EndIcon,
        )}
      >
        {children}
      </span>
      {iconAtEnd && canUseIcon && React.cloneElement(iconAtEnd)}
    </As>
  );
}

function isValidColorVariantCombination(
  color: ButtonColor,
  variant: ButtonVariant,
): boolean {
  const validColorVariantCombinations = {
    filled: ["primary", "secondary", "success", "warning", "neutral"],
    outlined: [
      "primary",
      "secondary",
      "success",
      "warning",
      "support",
      "inverse",
    ],
    link: ["primary", "secondary"],
  };
  return validColorVariantCombinations[variant].includes(color);
}
