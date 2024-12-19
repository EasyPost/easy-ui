import React, { ReactNode } from "react";
import { useDateRangePicker } from "react-aria";
import { useDateRangePickerState } from "react-stately";
import { RangeValue } from "@react-types/shared";
import { DateValue, MappedDateValue } from "@react-types/calendar";
import { RangeCalendar } from "../RangeCalendar";
import { DatePickerBase } from "../DatePicker/DatePickerBase";

export type DateRangePickerProps = {
  /**
   * Accessibility label for input field.
   */
  "aria-label"?: string;
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
};

export function DateRangePicker(props: DateRangePickerProps) {
  const {
    label,
    size = "md",
    isDisabled,
    isInvalid,
    errorMessage,
    "aria-label": ariaLabel,
  } = props;
  const datePickerRef = React.useRef(null);
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
    datePickerRef,
    buttonProps,
    groupProps,
    startFieldProps,
    endFieldProps,
    isDisabled,
    size,
    isInvalid,
    errorMessage: errorMessage || calendarProps.errorMessage,
  };
  const overlayProps = { dialogProps };

  return (
    <DatePickerBase
      labelProps={labelProps}
      triggerProps={triggerProps}
      overlayProps={overlayProps}
      state={state}
      label={label}
      aria-label={ariaLabel}
    >
      {/** When DatePicker is invalid, error message display under both DatePicker and Calendar. Set calendar to valid prevent error message displaying twice  */}
      <RangeCalendar {...calendarProps} isInvalid={false} />
    </DatePickerBase>
  );
}
