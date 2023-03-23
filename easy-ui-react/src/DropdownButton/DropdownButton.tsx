import React, { ReactNode, useRef } from "react";
import ExpandMoreIcon400 from "@easypost/easy-ui-icons/ExpandMore400";
import { useButton } from "react-aria";
import { Icon } from "../Icon";
import { ButtonColor } from "../Button";
import { classNames, variationName } from "../utilities/css";
import { logWarningIfInvalidColorVariantCombination } from "../Button/utilities";
import styles from "./DropdownButton.module.scss";
import commonButtonStyles from "../Button/Button.module.scss";

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

  logWarningIfInvalidColorVariantCombination(color, variant);

  return (
    <button
      disabled={isDisabled}
      ref={ref}
      className={classNames(
        styles.DropdownButton,
        commonButtonStyles[variationName("color", color)],
        commonButtonStyles[variationName("variant", variant)],
      )}
      {...buttonProps}
    >
      <span>{children}</span>
      <span className={classNames(styles.pipeSeparator)}></span>
      <Icon symbol={ExpandMoreIcon400} />
    </button>
  );
}
