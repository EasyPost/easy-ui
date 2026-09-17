import ExpandMoreIcon400 from "@easypost/easy-ui-icons/ExpandMore400";
import { FocusableElement } from "@react-types/shared";
import React, { DOMAttributes, ReactNode, forwardRef } from "react";
import { AriaButtonProps } from "react-aria";
import { InputIcon } from "../InputField/InputIcon";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { UnstyledButton } from "../UnstyledButton";
import { classNames, variationName } from "../utilities/css";
import { SelectFieldSize } from "./SelectField";

import styles from "./Select.module.scss";

export type SelectButtonProps = AriaButtonProps<"button"> & {
  /**
   * Size affects the overall size of the button, but it also influences
   * the size of iconAtStart and iconAtEnd.
   * @default md
   */
  size?: SelectFieldSize;
  /**
   * Whether the button is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether or not to apply error styles to the button.
   * @default false
   */
  hasError?: boolean;
  /**
   * Whether the overlay attached to the button is open. Applies the same
   * engaged border a `<Select />` shows while its listbox is open.
   * @default false
   */
  isOpen?: boolean;
  /** Left aligned icon on the button. */
  iconAtStart?: IconSymbol;
  /**
   * Right aligned icon on the button.
   * @default ExpandMore400
   */
  iconAtEnd?: IconSymbol;
  /** Optional second line, rendered smaller and subdued beneath `children`. */
  description?: ReactNode;
  /** Props for the element wrapping the button's value. */
  valueProps?: DOMAttributes<FocusableElement>;
  /** Content to render. */
  children: ReactNode;
};

/**
 * A button shaped like a select field.
 *
 * @remarks
 * This is the visual `<Select />` renders for its own trigger, made available
 * on its own so an overlay that isn't a listbox—a `<Popover />`, say—can be
 * attached to a field-shaped trigger without reimplementing the field.
 *
 * It is purely presentational: it manages no open state and owns no overlay.
 * Behavior comes from whatever props are handed to it, so it works as the child
 * of `<Popover.Trigger />` and `<Menu.Trigger />`, both of which clone their
 * child with the props that open the overlay.
 *
 * Reach for `<Select />` instead when the overlay holds selectable options.
 *
 * @example
 * _Attached to a popover:_
 * ```tsx
 * import { Popover } from "@easypost/easy-ui/Popover";
 * import { SelectButton } from "@easypost/easy-ui/Select";
 *
 * export function Component() {
 *  return (
 *    <Popover>
 *      <Popover.Trigger>
 *        <SelectButton>Add Packaging</SelectButton>
 *      </Popover.Trigger>
 *      <Popover.Overlay aria-label="Shipment packaging">
 *        Content
 *      </Popover.Overlay>
 *    </Popover>
 *  );
 * }
 * ```
 *
 * @example
 * _With a description:_
 * ```tsx
 * import { SelectButton } from "@easypost/easy-ui/Select";
 *
 * export function Component() {
 *  return (
 *    <SelectButton description="12 x 12 x 8 in" onPress={() => {}}>
 *      Custom Package
 *    </SelectButton>
 *  );
 * }
 * ```
 */
export const SelectButton = forwardRef<null, SelectButtonProps>(
  (props, inRef) => {
    const {
      size = "md",
      isDisabled = false,
      hasError = false,
      isOpen = false,
      iconAtStart,
      iconAtEnd = ExpandMoreIcon400,
      description,
      valueProps,
      children,
      ...restProps
    } = props;

    const hasStartIcon = !!iconAtStart;
    const className = classNames(
      styles.selectField,
      styles.selectFieldIconEnd,
      isOpen && styles.listboxOpen,
      hasError && styles.selectFieldError,
      hasStartIcon && styles.selectFieldIconStart,
      styles[variationName("selectSize", size)],
    );

    return (
      <div className={styles.selectFieldIconContainer}>
        {hasStartIcon && (
          <InputIcon
            alignment="start"
            icon={iconAtStart}
            size={size}
            isDisabled={isDisabled}
          />
        )}
        {/* `restProps` spreads before `className` so a cloned `className` can't
        clobber the field styling that makes this component what it is. */}
        <UnstyledButton
          isDisabled={isDisabled}
          ref={inRef}
          {...restProps}
          className={className}
        >
          <div {...valueProps} className={styles.selectFieldText}>
            {children}
            {description && (
              <span className={styles.selectedDescription}>
                <Text variant="caption" color="neutral.600" truncate>
                  {description}
                </Text>
              </span>
            )}
          </div>
        </UnstyledButton>
        <InputIcon
          alignment="end"
          icon={iconAtEnd}
          size={size}
          isDisabled={isDisabled}
        />
      </div>
    );
  },
);

SelectButton.displayName = "SelectButton";
