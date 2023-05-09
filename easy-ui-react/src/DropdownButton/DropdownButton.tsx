import ExpandMoreIcon400 from "@easypost/easy-ui-icons/ExpandMore400";
import React, { ReactNode, forwardRef } from "react";
import { AriaButtonProps } from "react-aria";
import { ButtonColor } from "../Button";
import { logWarningIfInvalidColorVariantCombination } from "../Button/utilities";
import { Icon } from "../Icon";
import { classNames, variationName } from "../utilities/css";
import styles from "./DropdownButton.module.scss";
import { UnstyledButton } from "../UnstyledButton";

export type DropdownButtonVariant = "filled" | "outlined";

export type DropdownButtonProps = AriaButtonProps & {
  /** Button color */
  color?: ButtonColor;
  /** Button variant */
  variant?: DropdownButtonVariant;
  /** Disables button */
  isDisabled?: boolean;
  /** Content inside button  */
  children?: ReactNode;
};

export const DropdownButton = forwardRef<null, DropdownButtonProps>(
  (props, inRef) => {
    const {
      color = "primary",
      variant = "filled",
      isDisabled = false,
      children = "Button",
      ...restProps
    } = props;

    logWarningIfInvalidColorVariantCombination(color, variant);

    return (
      <UnstyledButton
        isDisabled={isDisabled}
        ref={inRef}
        className={classNames(
          styles.DropdownButton,
          styles[variationName("variant", variant)],
          styles[variationName("color", color)],
        )}
        {...restProps}
      >
        <span>{children}</span>
        <span className={classNames(styles.pipeSeparator)}></span>
        <Icon symbol={ExpandMoreIcon400} />
      </UnstyledButton>
    );
  },
);

DropdownButton.displayName = "DropdownButton";
