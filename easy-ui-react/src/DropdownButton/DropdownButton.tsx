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

/**
 * Typically used as a trigger to display a set of options for
 * the user to choose from.
 *
 * @remarks
 * Can be used alongside Easy UI's `<Menu />` as the trigger element.
 * Comes pre-styled with separator and right-aligned arrow icon. Supports
 * multiple colors and an outlined variant. Underlying element is a button.
 *
 * @example
 * _Default:_
 * ```tsx
 * import { DropdownButton } from "@easypost/easy-ui/DropdownButton";
 *
 * export function Component() {
 *  return (
 *   <DropdownButton onPress={() => alert("clicked")}>Button</DropdownButton>
 *  );
 * }
 * ```
 *
 * @example
 * _Outlined variant:_
 * ```tsx
 * import { DropdownButton } from "@easypost/easy-ui/DropdownButton";
 *
 * export function Component() {
 *  return (
 *    <DropdownButton onPress={() => alert("clicked")} variant="outlined">
 *      Button
 *    </DropdownButton>
 *  );
 * }
 * ```
 * @example
 * _Success color:_
 * ```tsx
 * import { DropdownButton } from "@easypost/easy-ui/DropdownButton";
 *
 * export function Component() {
 *  return (
 *    <DropdownButton onPress={() => alert("clicked")} color="success">
 *      Button
 *    </DropdownButton>
 *  );
 * }
 * ```
 */
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
