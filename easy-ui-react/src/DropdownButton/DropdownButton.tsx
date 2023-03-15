import React, { ReactNode, useRef } from "react";
import { Icon } from "../Icon";
import { useButton } from "@react-aria/button";
import ExpandMoreIcon from "@easypost/easy-ui-icons/ExpandMore";
import { classNames, variationName } from "../utilities/css";

import styles from "./DropdownButton.module.scss";

export type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "neutral"
  | "support"
  | "inverse";
export type ButtonVariant = "filled" | "outlined";

export type DropdownButtonProps = {
  /** Button color */
  color?: ButtonColor;
  /** Button variant */
  variant?: ButtonVariant;
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
      <div className={classNames(styles.PipeSeparator)}></div>
      <Icon symbol={ExpandMoreIcon} size="sm" />
    </button>
  );
}
