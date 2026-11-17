import React, { forwardRef } from "react";
import { AriaButtonProps } from "react-aria";
import { ButtonColor } from "../Button";
import { logWarningIfInvalidColorVariantCombination } from "../Button/utilities";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";
import { RouterLinkProps } from "../utilities/router";
import styles from "./IconButton.module.scss";
import { UnstyledButton } from "../UnstyledButton";

export type IconButtonVariant = "filled" | "outlined" | "ghost";
export type IconButtonSize = "xs" | "sm" | "md";

export type IconButtonProps = AriaButtonProps &
  RouterLinkProps & {
    /** Button color */
    color?: ButtonColor;
    /** Button variant */
    variant?: IconButtonVariant;
    /** Icon symbol */
    icon: IconSymbol;
    /**
     * Button size. `sm` and `md` match `<Button />`'s heights (32px and
     * 48px). `xs` is 24px, a 24px icon with no padding, the height of a
     * line of `body1` text, for actions inline with text or in a table
     * row. `xs` is only supported with the `ghost` variant.
     */
    size?: IconButtonSize;
    /** Description of icon */
    accessibilityLabel: string;
    /** Disables button */
    isDisabled?: boolean;
  };

/**
 * Button element that represents its behavior with a contextually
 * appropriate icon instead of text.
 *
 * @remarks
 * Use to communicate an action the user can take in order to continue
 * flow in the UI. Supports multiple colors, outlined and ghost
 * variations, and an accessibility label that describes the icon.
 * Underlying element is a button.
 *
 * Use the ghost variant for quiet actions, such as a back arrow in a
 * page header, an edit icon beside a value, or a row's actions. It's
 * transparent and borderless until hovered, and holds a solid fill
 * while a menu or popover it triggers is open.
 *
 * @example
 * _Default:_
 * ```tsx
 * import { IconButton } from "@easypost/easy-ui/IconButton";
 * import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
 *
 * export function Component() {
 *  return (
 *    <IconButton
 *      onPress={() => alert("clicked")}
 *      icon={ArrowBackIcon}
 *      accessibilityLabel="Back"
 *    />
 *  );
 * }
 * ```
 *
 * @example
 * _Outlined variant:_
 * ```tsx
 * import { IconButton } from "@easypost/easy-ui/IconButton";
 * import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
 *
 * export function Component() {
 *  return (
 *    <IconButton
 *      onPress={() => alert("clicked")}
 *      icon={ArrowBackIcon}
 *      accessibilityLabel="Back"
 *      variant="outlined"
 *    />
 *  );
 * }
 * ```
 * @example
 * _Ghost variant, inline beside text:_
 * ```tsx
 * import { IconButton } from "@easypost/easy-ui/IconButton";
 * import DeleteIcon from "@easypost/easy-ui-icons/Delete";
 *
 * export function Component() {
 *  return (
 *    <IconButton
 *      onPress={() => alert("clicked")}
 *      icon={DeleteIcon}
 *      accessibilityLabel="Delete"
 *      variant="ghost"
 *      color="support"
 *      size="xs"
 *    />
 *  );
 * }
 * ```
 *
 * @example
 * _Success color:_
 * ```tsx
 * import { IconButton } from "@easypost/easy-ui/IconButton";
 * import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
 *
 * export function Component() {
 *  return (
 *    <IconButton
 *      onPress={() => alert("clicked")}
 *      icon={ArrowBackIcon}
 *      accessibilityLabel="Back"
 *      color="success"
 *    />
 *  );
 * }
 * ```
 */
export const IconButton = forwardRef<null, IconButtonProps>((props, inRef) => {
  const {
    color = "primary",
    variant = "filled",
    icon,
    size = "md",
    accessibilityLabel,
    isDisabled = false,
    ...restProps
  } = props;

  logWarningIfInvalidColorVariantCombination(color, variant);
  if (size === "xs" && variant !== "ghost") {
    console.warn(
      `The size 'xs' is not supported with the '${variant}' variant`,
    );
  }

  // `sm` uses an xs icon, which is more consistent with a non-icon button's
  // `sm` size. `xs` has no padding, so its full-size icon sets its height.
  const iconSize = size === "sm" ? "xs" : "md";

  return (
    <UnstyledButton
      isDisabled={isDisabled}
      ref={inRef}
      className={classNames(
        styles.IconButton,
        styles[variationName("variant", variant)],
        styles[variationName("color", color)],
        styles[variationName("size", size)],
      )}
      {...restProps}
    >
      <Text visuallyHidden>{accessibilityLabel}</Text>
      <Icon symbol={icon} size={iconSize} />
    </UnstyledButton>
  );
});

IconButton.displayName = "IconButton";
