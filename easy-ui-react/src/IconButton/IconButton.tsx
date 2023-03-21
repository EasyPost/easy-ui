import React, { useRef } from "react";
import { useButton } from "react-aria";
import { Icon } from "../Icon";
import { ButtonColor } from "../Button";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";
import { logWarningIfInvalidColorVariantCombination } from "../Button/utilities";
import commonButtonStyles from "../Button/Button.module.scss";

export type IconButtonVariant = "filled" | "outlined";

export type IconButtonProps = {
  /** Button color */
  color?: ButtonColor;
  /** Button variant */
  variant?: IconButtonVariant;
  /** Icon symbol SVG source from @easypost/easy-ui-icons */
  symbol: IconSymbol;
  /** Disables button */
  isDisabled?: boolean;
};

export function IconButton(props: IconButtonProps) {
  const {
    color = "primary",
    variant = "filled",
    symbol,
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
        commonButtonStyles.Button,
        commonButtonStyles[variationName("color", color)],
        commonButtonStyles[variationName("variant", variant)],
      )}
      {...buttonProps}
    >
      <Icon symbol={symbol} />
    </button>
  );
}
