import React, { useRef, ReactElement } from "react";
import { useButton } from "react-aria";
import { IconProps } from "../Icon";
import { ButtonColor } from "../Button";
import { classNames, variationName } from "../utilities/css";
import { logWarningIfInvalidColorVariantCombination } from "../Button/utilities";
import styles from "./IconButton.module.scss";
import commonButtonStyles from "../Button/Button.module.scss";

export type IconButtonVariant = "filled" | "outlined";

export type IconButtonProps = {
  /** Button color */
  color?: ButtonColor;
  /** Button variant */
  variant?: IconButtonVariant;
  /** Icon */
  icon: ReactElement<IconProps>;
  /** Disables button */
  isDisabled?: boolean;
};

export function IconButton(props: IconButtonProps) {
  const {
    color = "primary",
    variant = "filled",
    icon,
    isDisabled = false,
  } = props;

  const ref = useRef(null);
  const { buttonProps } = useButton(props, ref);

  logWarningIfInvalidColorVariantCombination(color, variant);

  return (
    <button
      disabled={isDisabled}
      ref={ref}
      className={classNames(
        styles.IconButton,
        styles[variationName("variant", variant)],
        commonButtonStyles[variationName("color", color)],
        commonButtonStyles[variationName("variant", variant)],
      )}
      {...buttonProps}
    >
      {React.cloneElement(icon)}
    </button>
  );
}
