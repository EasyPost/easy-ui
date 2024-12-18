import React, { ReactNode } from "react";
import { useDateRangePicker } from "react-aria";
import { useDateRangePickerState } from "react-stately";
import { RangeValue } from "@react-types/shared";
import { DateValue, MappedDateValue } from "@react-types/calendar";
import { HorizontalStack } from "../HorizontalStack";
import { DatePicker } from "../DatePicker";
import { Text } from "../Text";
import { RangeCalendar } from "../RangeCalendar";
import { OptionProps } from "./DatePickerQuickSelect";
import { classNames, variationName } from "../utilities/css";
import styles from "../DatePicker/DatePicker.module.scss";

export type DateRangePickerProps = {
  /**
   * The content to display as the label.
   */
  label?: string;
  /**
   * The default value (uncontrolled).
   */
  defaultValue?: RangeValue<DateValue> | null;
  /**
   * The current value (controlled).
   */
  value?: RangeValue<DateValue> | null;
  /**
   * Handler that is called when the value changes.
   */
  onChange?: (value: RangeValue<MappedDateValue<DateValue>> | null) => void;
  /**
   * The minimum allowed date that a user may select.
   */
  minValue?: DateValue;
  /**
   * The maximum allowed date that a user may select.
   */
  maxValue?: DateValue;
  /**
   * Whether the input is disabled.
   */
  isDisabled?: boolean;
  /**
   * Whether the input value is invalid.
   */
  isInvalid?: boolean;
  /**
   * An error message to display when the selected value is invalid.
   */
  errorMessage?: ReactNode;
  /**
   * Callback that is called for each date of the calendar. If
   * it returns true, then the date is unavailable.
   */
  isDateUnavailable?: (date: DateValue) => boolean;
  /**
   * The size of the DateRangePicker.
   * @default md
   */
  size?: "sm" | "md";
  /**
   * A list of quick select options that provide users the
   * ability to make selection faster.
   */
  quickSelectOptions?: OptionProps[];
};

export function DateRangePicker(props: DateRangePickerProps) {
  const {
    label,
    size = "md",
    isDisabled,
    quickSelectOptions,
    isInvalid,
    errorMessage,
  } = props;
  const datePickerRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const state = useDateRangePickerState(props);
  const {
    groupProps,
    labelProps,
    startFieldProps,
    endFieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDateRangePicker(props, state, datePickerRef);

  const triggerProps = {
    triggerRef,
    datePickerRef,
    buttonProps,
    groupProps,
    startFieldProps,
    endFieldProps,
    isDisabled,
    size,
    isInvalid,
    errorMessage: errorMessage || calendarProps.errorMessage,
    state,
  };
  const overlayProps = { state, triggerRef, dialogProps };

  const className = classNames(
    styles.DatePicker,
    size && styles[variationName("datePicker", size)],
  );
  return (
    <div className={className}>
      {label && (
        <Text
          {...labelProps}
          variant={size === "sm" ? "body2" : "body1"}
          color="primary.800"
        >
          {label}
        </Text>
      )}
      <DatePicker.Trigger {...triggerProps} />
      <DatePicker.Overlay {...overlayProps}>
        <HorizontalStack gap="8">
          {quickSelectOptions && (
            <DatePicker.QuickSelect
              quickSelectOptions={quickSelectOptions}
              state={state}
            />
          )}
          <RangeCalendar {...calendarProps} />
        </HorizontalStack>
      </DatePicker.Overlay>
    </div>
  );
}
