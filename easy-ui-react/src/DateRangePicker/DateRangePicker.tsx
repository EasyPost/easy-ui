import React, { ReactNode } from "react";
import {
  useDateRangePicker,
  DateValue,
  MappedDateValue,
  RangeValue,
} from "react-aria";
import { useDateRangePickerState } from "react-stately";
import { RangeCalendar } from "../RangeCalendar";
import { DatePickerBase } from "../DatePicker/DatePickerBase";
import { NecessityIndicator } from "../InputField";

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
   * Whether user input is required before form submission. Marks the label
   * as required.
   * @default false
   */
  isRequired?: boolean;
  /**
   * How the label marks whether the input is required. `"icon"` shows a `*`
   * on required inputs; `"label"` shows "(required)" or "(optional)".
   * @default icon
   */
  necessityIndicator?: NecessityIndicator;
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

/**
 * A `DateRangePicker` has a `DateField` and a calendar popover
 * to allow users to enter or select a date.
 *
 * @remarks
 * Use a DateRangePicker when you want to provide a view that
 * allows the users to select a date.
 *
 * @example
 * _Standalone:_
 * ```tsx
 * import { DateRangePicker } from "@easypost/easy-ui/DateRangePicker";
 *
 * function PageWithDateRangePicker() {
 *   return <DateRangePicker />;
 * }
 * ```
 *
 * @example
 * _Controlled:_
 * ```tsx
 * import { DateRangePicker } from "@easypost/easy-ui/DateRangePicker";
 *
 * function PageWithDateRangePicker() {
 *   const [date, setDate] = React.useState(null);
 *   return (
 *      <DateRangePicker value={date} onChange={setDate}
 *      aria-label="Date picker" />
 *    );
 * }
 * ```
 */
export function DateRangePicker(props: DateRangePickerProps) {
  const {
    label,
    size = "md",
    isDisabled,
    isInvalid,
    isRequired,
    necessityIndicator,
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
      isRequired={isRequired}
      necessityIndicator={necessityIndicator}
      aria-label={ariaLabel}
    >
      {/** When DatePicker is invalid, error message display under both DatePicker and Calendar. Set calendar to valid prevent error message displaying twice  */}
      <RangeCalendar {...calendarProps} isInvalid={false} />
    </DatePickerBase>
  );
}
