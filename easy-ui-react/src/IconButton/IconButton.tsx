import React, { forwardRef } from "react";
import { AriaButtonProps } from "react-aria";
import { ButtonColor } from "../Button";
import { logWarningIfInvalidColorVariantCombination } from "../Button/utilities";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";
import styles from "./IconButton.module.scss";
import { UnstyledButton } from "../UnstyledButton";

export type IconButtonVariant = "filled" | "outlined";

export type IconButtonProps = AriaButtonProps & {
  /** Button color */
  color?: ButtonColor;
  /** Button variant */
  variant?: IconButtonVariant;
  /** Icon symbol */
  icon: IconSymbol;
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
 * Use to call attention to a place in the UI where the user needs to do something
 * in order to continue flow. Supports multiple colors, an outlined variation, and
 * an accessibility label that describes the icon. Underlying element is a button.
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
    accessibilityLabel,
    isDisabled = false,
    ...restProps
  } = props;

  logWarningIfInvalidColorVariantCombination(color, variant);

  return (
    <UnstyledButton
      isDisabled={isDisabled}
      ref={inRef}
      className={classNames(
        styles.IconButton,
        styles[variationName("variant", variant)],
        styles[variationName("color", color)],
      )}
      {...restProps}
    >
      <Text visuallyHidden>{accessibilityLabel}</Text>
      <Icon symbol={icon} />
    </UnstyledButton>
  );
});

IconButton.displayName = "IconButton";
