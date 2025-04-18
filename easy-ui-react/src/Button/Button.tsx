import React, { ReactNode, forwardRef } from "react";
import { UnstyledButton } from "../UnstyledButton";
import { Icon } from "../Icon";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";
import { AriaButtonProps } from "react-aria";
import { logWarningIfInvalidColorVariantCombination } from "./utilities";

import styles from "./Button.module.scss";

export type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "neutral"
  | "support"
  | "inverse";

export type ButtonVariant = "filled" | "outlined" | "link" | "text";
export type ButtonSize = "sm" | "md";

export type ButtonProps = AriaButtonProps & {
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
  /** Positions icon symbol before children */
  iconAtStart?: IconSymbol;
  /** Positions icon symbol after children */
  iconAtEnd?: IconSymbol;
  /** Content inside button  */
  children?: ReactNode;
  /** Link's destination */
  href?: string;
};

/**
 * A `<Button />` enables users to take an action or transition to other pages.
 * They are designed with multiple styles to address various needs, and they are
 * ideal for highlighting an action for the user to take in order to move forward in a flow.
 *
 * @remarks
 * Use to communicate an action the user can take in order to continue
 * flow in the UI. Supports icons, multiple colors, outlined and link variations,
 * and small size buttons. Underlying element is a button, but becomes an
 * anchor when `href` is provided.
 *
 * @example
 * _Default:_
 * ```tsx
 * import { Button } from "@easypost/easy-ui/Button";
 *
 * export function Component() {
 *  return <Button onPress={() => alert("clicked")}>Button</Button>;
 * }
 * ```
 *
 * @example
 * _Outlined variant:_
 * ```tsx
 * import { Button } from "@easypost/easy-ui/Button";
 *
 * export function Component() {
 *   return (
 *    <Button onPress={() => alert("clicked")} variant="outlined">
 *      Button
 *    </Button>
 *   );
 * }
 * ```
 *
 * @example
 * _Success color:_
 * ```tsx
 * import { Button } from "@easypost/easy-ui/Button";
 *
 * export function Component() {
 *   return (
 *    <Button onPress={() => alert("clicked")} color="success">
 *      Button
 *    </Button>
 *   );
 * }
 * ```
 * @example
 * _With href and icon:_
 * ```tsx
 * import { Button } from "@easypost/easy-ui/Button";
 * import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
 *
 * export function Component() {
 *   return (
 *    <Button href="https://www.easypost.com/" iconAtEnd={ArrowBackIcon}>
 *      Button
 *    </Button>
 *   );
 * }
 * ```
 */
export const Button = forwardRef<null, ButtonProps>((props, inRef) => {
  const {
    color = "primary",
    variant = "filled",
    size = "md",
    isDisabled = false,
    isBlock = false,
    iconAtStart,
    iconAtEnd,
    children = "Button",
    href = "",
    ...restProps
  } = props;

  const bothIconPropsDefined = iconAtEnd && iconAtStart;
  if (bothIconPropsDefined) {
    console.warn("Cannot simultaneously define `iconAtEnd` and `iconAtStart`");
  }

  const canUseIcon =
    (iconAtEnd || iconAtStart) &&
    !bothIconPropsDefined &&
    variant !== "link" &&
    size !== "sm";

  logWarningIfInvalidColorVariantCombination(color, variant);

  return (
    <UnstyledButton
      isDisabled={isDisabled}
      ref={inRef}
      href={href}
      {...restProps}
      className={classNames(
        styles.Button,
        styles[variationName("color", color)],
        styles[variationName("variant", variant)],
        styles[variationName("size", size)],
        isBlock && styles.block,
      )}
    >
      {iconAtStart && canUseIcon && <Icon symbol={iconAtStart} />}
      <span
        className={classNames(
          iconAtStart && canUseIcon && styles.iconAtStart,
          iconAtEnd && canUseIcon && styles.iconAtEnd,
        )}
      >
        {children}
      </span>
      {iconAtEnd && canUseIcon && <Icon symbol={iconAtEnd} />}
    </UnstyledButton>
  );
});

Button.displayName = "Button";
