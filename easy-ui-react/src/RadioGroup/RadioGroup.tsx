import { AriaLabelingProps } from "@react-types/shared";
import React, { ReactNode } from "react";
import { useRadioGroup } from "react-aria";
import { useRadioGroupState } from "react-stately";
import { Text } from "../Text";
import { RadioGroupContext, useRadioGroupContext } from "./RadioGroupContext";
import { RadioGroupItem, RadioGroupItemProps } from "./RadioGroupItem";

import styles from "./RadioGroup.module.scss";

export type RadioGroupProps<K extends string> = AriaLabelingProps & {
  /** Radio buttons to render inside the radio group. */
  children?: ReactNode;

  /** The default value (uncontrolled). */
  defaultValue?: K;

  /** Whether the radio is disabled. */
  isDisabled?: boolean;

  /** Whether the radio group can be selected but not changed by the user. */
  isReadOnly?: boolean;

  /** Label for the radio group. */
  label?: ReactNode;

  /**
   * The name of the radio group, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name_and_radio_buttons).
   */
  name?: string;

  /** Handler that is called when the value changes. */
  onChange?: (value: K) => void;

  /** The current value (controlled). */
  value?: K;
};

function RadioGroupContainer<K extends string>(props: RadioGroupProps<K>) {
  const { children, label } = props;

  // hate to do this, but react-aria doesn't support generics, but it would
  // really be ideal to have the select be generic. FIXME when react-aria's
  // types around `Key` are fixed.
  const castProps = props as RadioGroupProps<string>;

  const state = useRadioGroupState(castProps);
  const { radioGroupProps, labelProps } = useRadioGroup(castProps, state);

  return (
    <fieldset className={styles.RadioGroup} {...radioGroupProps}>
      {label && (
        <div>
          <Text
            as="legend"
            variant="subtitle1"
            color="gray.bold"
            {...labelProps}
          >
            {label}
          </Text>
        </div>
      )}
      <RadioGroupContext.Provider value={state}>
        {children}
      </RadioGroupContext.Provider>
    </fieldset>
  );
}

/**
 * A form element that lets users select a single choice from a list of at
 * least two options.
 *
 * @remarks
 * Use a radio group to select a single choice from a list of at least two
 * options. The user can only select one radio option at a time.
 *
 * @example
 * ```tsx
 * <RadioGroup label="Options:">
 *   <RadioGroup.Item value="first">First item</RadioGroup.Item>
 *   <RadioGroup.Item value="second">Second item</RadioGroup.Item>
 *   <RadioGroup.Item value="third">Third item</RadioGroup.Item>
 * </RadioGroup>
 * ```
 *
 * @example
 * _Default value:_
 * ```tsx
 * <RadioGroup label="Options:" defaultValue="first">
 *   <RadioGroup.Item value="first">First item</RadioGroup.Item>
 *   <RadioGroup.Item value="second">Second item</RadioGroup.Item>
 *   <RadioGroup.Item value="third">Third item</RadioGroup.Item>
 * </RadioGroup>
 * ```
 *
 * @example
 * _Controlled value:_
 * ```tsx
 * <RadioGroup label="Options:" value="first" onChange={(value) => {}}>
 *   <RadioGroup.Item value="first">First item</RadioGroup.Item>
 *   <RadioGroup.Item value="second">Second item</RadioGroup.Item>
 *   <RadioGroup.Item value="third">Third item</RadioGroup.Item>
 * </RadioGroup>
 * ```
 */
export function RadioGroup<K extends string>(props: RadioGroupProps<K>) {
  const { children, ...containerProps } = props;
  return (
    <RadioGroupContainer {...containerProps}>
      <div className={styles.list}>{children}</div>
    </RadioGroupContainer>
  );
}

/**
 * Represents the outermost element of a `<RadioGroup />`.
 */
RadioGroup.Container = RadioGroupContainer;

/**
 * Represents an item in a `<RadioGroup />`.
 */
RadioGroup.Item = RadioGroupItem;

export { useRadioGroupContext };
export type { RadioGroupItemProps };
