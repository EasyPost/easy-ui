import ExpandMoreIcon400 from "@easypost/easy-ui-icons/ExpandMore400";
import { mergeRefs } from "@react-aria/utils";
import React, { ReactNode, forwardRef, useRef } from "react";
import { AriaButtonProps, mergeProps, useButton } from "react-aria";
import { ButtonColor } from "../Button";
import {
  filterButtonDOMProps,
  logWarningIfInvalidColorVariantCombination,
} from "../Button/utilities";
import { Icon } from "../Icon";
import { classNames, variationName } from "../utilities/css";
import styles from "./DropdownButton.module.scss";

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

    const ref = useRef(null);
    const { buttonProps } = useButton(props, ref);

    logWarningIfInvalidColorVariantCombination(color, variant);

    return (
      <button
        {...mergeProps(filterButtonDOMProps(restProps), buttonProps)}
        disabled={isDisabled}
        ref={mergeRefs(ref, inRef)}
        className={classNames(
          styles.DropdownButton,
          styles[variationName("variant", variant)],
          styles[variationName("color", color)],
        )}
      >
        <span>{children}</span>
        <span className={classNames(styles.pipeSeparator)}></span>
        <Icon symbol={ExpandMoreIcon400} />
      </button>
    );
  },
);

DropdownButton.displayName = "DropdownButton";
