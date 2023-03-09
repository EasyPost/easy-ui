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
export type ButtonAppearance = "filled" | "outlined" | "link";
export type ButtonSize = "sm" | "md";

export type ButtonProps = {
  /** Button color */
  color?: ButtonColor;
  /** Button appearance */
  appearance?: ButtonAppearance;
  /** Button size */
  size?: ButtonSize;
  /** Disables button */
  isDisabled?: boolean;
  /** Button will grow to width of container */
  isBlock?: boolean;
  /** Positions icon before children */
  startIcon?: ReactElement<IconProps>;
  /** Positions icon after children */
  endIcon?: ReactElement<IconProps>;
  /** Content inside button  */
  children?: ReactNode;
  /** Link's destination */
  href?: string;
};

export function Button(props: ButtonProps) {
  const {
    color = "primary",
    appearance = "filled",
    size = "md",
    isDisabled = false,
    isBlock = false,
    startIcon = null,
    endIcon = null,
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
    (startIcon || endIcon) && appearance !== "link" && size !== "sm";

  return (
    <As
      disabled={isDisabled}
      ref={ref}
      className={classNames(
        styles.Button,
        styles[variationName("color", [color, appearance])],
        styles[variationName("size", [size, appearance])],
        isBlock && styles.ButtonBlock,
      )}
      {...elementProps}
    >
      {startIcon && canUseIcon && React.cloneElement(startIcon)}
      <span
        className={classNames(
          startIcon && canUseIcon && styles.StartIcon,
          endIcon && canUseIcon && styles.EndIcon,
        )}
      >
        {children}
      </span>
      {endIcon && canUseIcon && React.cloneElement(endIcon)}
    </As>
  );
}
