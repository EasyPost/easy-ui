import React, { ReactNode } from "react";
import { useDatePicker } from "react-aria";
import { useDatePickerState } from "react-stately";
import { DateValue, MappedDateValue } from "@react-types/calendar";
import { DatePickerBase } from "./DatePickerBase";
import { Calendar } from "../Calendar";

export type DatePickerProps = {
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
  defaultValue?: DateValue | null;
  /**
   * The current value (controlled).
   */
  value?: DateValue | null;
  /**
   * Handler that is called when the value changes.
   */
  onChange?: (value: MappedDateValue<DateValue> | null) => void;
  // onChange?: (value: DateValue | null) => void;
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
   * The size of the DatePicker.
   * @default md
   */
  size?: "sm" | "md";
};

/**
 * A `DatePicker` has a `DateField` and a calendar popover to
 * allow users to enter or select a date.
 *
 * @remarks
 * Use a DatePciker when you want to provide a view that allows
 * the users to select a date.
 *
 * @example
 * _Standalone:_
 * ```tsx
 * import { DatePicker } from "@easypost/easy-ui/DatePicker";
 *
 * function PageWithDatePicker() {
 *   return <DatePicker />;
 * }
 * ```
 *
 * @example
 * _Controlled:_
 * ```tsx
 * import { DatePicker } from "@easypost/easy-ui/DatePicker";
 *
 * function PageWithDatePicker() {
 *   const [date, setDate] = React.useState(null);
 *   return (
 *      <DatePicker value={date} onChange={setDate}
 *      aria-label="Date picker" />
 *    );
 * }
 * ```
 */
export function DatePicker(props: DatePickerProps) {
  const {
    label,
    size = "md",
    isDisabled,
    isInvalid,
    errorMessage,
    "aria-label": ariaLabel,
  } = props;
  const datePickerRef = React.useRef(null);
  const state = useDatePickerState(props);
  const {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDatePicker(props, state, datePickerRef);

  const triggerProps = {
    datePickerRef,
    buttonProps,
    groupProps,
    fieldProps,
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
      <Calendar {...calendarProps} isInvalid={false} />
    </DatePickerBase>
  );
}

DatePicker.displayName = "DatePicker";
