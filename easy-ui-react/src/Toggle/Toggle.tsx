import { AriaLabelingProps } from "@react-types/shared";
import React, { ReactNode } from "react";
import {
  VisuallyHidden,
  mergeProps,
  useFocusRing,
  useHover,
  useSwitch,
} from "react-aria";
import { useToggleState } from "react-stately";
import { Text } from "../Text";
import { Noop } from "../utilities/Noop";
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

export function Toggle(props: ToggleProps) {
  const { children, isDisabled } = props;

  const ref = React.useRef(null);
  const state = useToggleState(props);
  const { inputProps: inputPropsFromSwitch } = useSwitch(props, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover(props);
  const isSelected = state.isSelected;

  const className = classNames(styles.Toggle, !children && styles.standalone);
  const textColor = isDisabled ? "disabled" : "primary";

  const RootComponent = children ? "label" : "span";
  const rootProps = children ? hoverProps : {};
  const InputWrapperComponent = children ? VisuallyHidden : Noop;
  const inputProps = children
    ? mergeProps(inputPropsFromSwitch, focusProps)
    : mergeProps(inputPropsFromSwitch, focusProps, hoverProps);

  return (
    <RootComponent {...rootProps} className={className}>
      <InputWrapperComponent>
        <input {...inputProps} className={styles.input} ref={ref} />
      </InputWrapperComponent>
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
}
