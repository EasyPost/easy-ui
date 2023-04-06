import React, { ReactNode, useRef } from "react";
import ExpandMoreIcon400 from "@easypost/easy-ui-icons/ExpandMore400";
import { AriaButtonProps, useButton } from "react-aria";
import { Icon } from "../Icon";
import { ButtonColor } from "../Button";
import { classNames, variationName } from "../utilities/css";
import { logWarningIfInvalidColorVariantCombination } from "../Button/utilities";
import styles from "./DropdownButton.module.scss";

export type DropdownButtonVariant = "filled" | "outlined";

export type DropdownButtonProps = AriaButtonProps<"button"> & {
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

  logWarningIfInvalidColorVariantCombination(color, variant);

  return (
    <button
      disabled={isDisabled}
      ref={ref}
      className={classNames(
        styles.DropdownButton,
        styles[variationName("variant", variant)],
        styles[variationName("color", color)],
      )}
      {...buttonProps}
    >
      <span>{children}</span>
      <span className={classNames(styles.pipeSeparator)}></span>
      <Icon symbol={ExpandMoreIcon400} />
    </button>
  );
}
