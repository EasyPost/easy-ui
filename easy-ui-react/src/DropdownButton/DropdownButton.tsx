import React, { ReactNode, useRef } from "react";
import ExpandMoreIcon from "@easypost/easy-ui-icons/ExpandMore";
import { useButton } from "react-aria";
import { Icon } from "../Icon";
import { ButtonColor } from "../types";
import { classNames, variationName } from "../utilities/css";
import { LogWarningIfInvalidColorVariantCombination } from "../utilities/button";

import styles from "./DropdownButton.module.scss";

export type DropdownButtonVariant = "filled" | "outlined";

export type DropdownButtonProps = {
  /** Button color */
  color?: ButtonColor;
  /** Button variant */
  variant?: DropdownButtonVariant;
  /** Disables button */
  isDisabled?: boolean;
  /** Content inside button  */
  children?: ReactNode;
};

export function DropdownButton(props: DropdownButtonProps) {
  const {
    color = "primary",
    variant = "filled",
    isDisabled = false,
    children = "Button",
  } = props;

  const ref = useRef(null);
  const { buttonProps } = useButton(props, ref);

  LogWarningIfInvalidColorVariantCombination(color, variant);

  return (
    <button
      disabled={isDisabled}
      ref={ref}
      className={classNames(
        styles.DropdownButton,
        styles[variationName("color", color)],
        styles[variationName("variant", variant)],
      )}
      {...buttonProps}
    >
      <span>{children}</span>
      <div className={classNames(styles.pipeSeparator)}></div>
      <Icon symbol={ExpandMoreIcon} size="sm" />
    </button>
  );
}
