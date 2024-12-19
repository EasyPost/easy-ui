import React, { ReactNode } from "react";
import { useDateRangePicker } from "react-aria";
import { useDateRangePickerState } from "react-stately";
import { RangeValue } from "@react-types/shared";
import { DateValue, MappedDateValue } from "@react-types/calendar";
import { DatePicker } from "../DatePicker";
import { Text } from "../Text";
import { RangeCalendar } from "../RangeCalendar";
import { classNames, variationName } from "../utilities/css";
import styles from "../DatePicker/DatePicker.module.scss";
import { logWarningForMissingAriaLabel } from "../InputField/utilities";

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

  logWarningForMissingAriaLabel(label, ariaLabel);

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
        {/** Set Calendar to always valid to prevent displaying error message under Calendar */}
        <RangeCalendar {...calendarProps} isInvalid={false} />
      </DatePicker.Overlay>
    </div>
  );
}
