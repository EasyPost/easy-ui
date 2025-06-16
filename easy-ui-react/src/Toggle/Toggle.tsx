import { mergeRefs, useObjectRef } from "@react-aria/utils";
import { AriaLabelingProps } from "@react-types/shared";
import React, { ReactNode, forwardRef } from "react";
import { mergeProps, useFocusRing, useHover, useSwitch } from "react-aria";
import { useToggleState } from "react-stately";
import { Text } from "../Text";
import { classNames } from "../utilities/css";
import { Switch } from "./Switch";

import styles from "./Toggle.module.scss";

export type ToggleProps = AriaLabelingProps & {
  /**
   * The label for the toggle.
   */
  children?: ReactNode;

  /**
   * Whether the toggle should be selected (uncontrolled).
   */
  defaultSelected?: boolean;

  /**
   * Disables the toggle.
   */
  isDisabled?: boolean;

  /**
   * Marks the toggle as immutable.
   */
  isReadOnly?: boolean;

  /**
   * Whether the toggle should be selected (controlled).
   */
  isSelected?: boolean;

  /**
   * The name of the toggle, used when submitting an HTML form.
   */
  name?: string;

  /**
   * Handler that is called when the toggle's selection state changes.
   */
  onChange?: (isSelected: boolean) => void;

  /**
   * The value of the toggle, used when submitting an HTML form.
   */
  value?: string;
};

/**
 * An interactive binary control.
 *
 * @remarks
 * Use a Toggle when an "on/off" or "yes/no" input is needed.
 *
 * @example
 * ```tsx
 * <Toggle>Toggle item</Toggle>
 * ```
 *
 * @example
 * _Default value:_
 * ```tsx
 * <Toggle defaultSelected={true}>Toggle item</Toggle>
 * ```
 *
 * @example
 * _Controlled:_
 * ```tsx
 * <Toggle
 *   isSelected={isSelected}
 *   onChange={(isSelected) => setIsSelected(isSelected)}
 * >
 *   Toggle item
 * </Toggle>
 * ```
 *
 * @example
 * _Disabled:_
 * ```tsx
 * <Toggle isDisabled>Toggle item</Toggle>
 * ```
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (props, externalRef) => {
    const {
      children,
      isDisabled,
      defaultSelected: _defaultSelected,
      isReadOnly: _isReadOnly,
      isSelected: _isSelected,
      name: _name,
      onChange: _onChange,
      value: _value,
      ...restProps
    } = props;

    const ref = React.useRef(null);
    const mergedRef = useObjectRef(mergeRefs(ref, externalRef));
    const state = useToggleState(props);
    const { inputProps: inputPropsFromSwitch } = useSwitch(props, state, ref);
    const { isFocusVisible, focusProps } = useFocusRing();
    const { isHovered, hoverProps } = useHover(props);
    const isSelected = state.isSelected;

    const className = classNames(styles.Toggle, !children && styles.standalone);
    const textColor = isDisabled ? "neutral.300" : "primary.800";

    const RootComponent = children ? "label" : "span";
    const rootProps = children ? hoverProps : {};
    const inputProps = children
      ? mergeProps(restProps, inputPropsFromSwitch, focusProps)
      : mergeProps(restProps, inputPropsFromSwitch, focusProps, hoverProps);

    return (
      <RootComponent {...rootProps} className={className}>
        <input {...inputProps} className={styles.input} ref={mergedRef} />
        <Switch
          isDisabled={isDisabled}
          isFocusVisible={isFocusVisible}
          isHovered={isHovered}
          isSelected={isSelected}
        />
        {children && (
          <span className={styles.text}>
            <Text variant="body1" color={textColor}>
              {children}
            </Text>
          </span>
        )}
      </RootComponent>
    );
  },
);

Toggle.displayName = "Toggle";
