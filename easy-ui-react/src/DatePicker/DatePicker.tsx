import React, { ReactNode } from "react";
import { useDatePicker } from "react-aria";
import { useDatePickerState } from "react-stately";
import { DatePickerTrigger } from "./DatePickerTrigger";
import { DatePickerOverlay } from "./DatePickerOverlay";
import { DatePickerQuickSelect } from "../DateRangePicker/DatePickerQuickSelect";
import { classNames, variationName } from "../utilities/css";
import { Calendar } from "../Calendar";
import { Text } from "../Text";
import styles from "./DatePicker.module.scss";
import { DateValue, MappedDateValue } from "@react-types/calendar";

export type DatePickerProps = {
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
export function DatePicker(props: DatePickerProps) {
  const { label, size = "md", isDisabled, isInvalid, errorMessage } = props;
  const datePickerRef = React.useRef(null);
  const triggerRef = React.useRef(null);
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
    triggerRef,
    datePickerRef,
    buttonProps,
    groupProps,
    fieldProps,
    isDisabled,
    size,
    isInvalid,
    errorMessage,
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
        <Calendar {...calendarProps} />
      </DatePicker.Overlay>
    </div>
  );
}

DatePicker.displayName = "DatePicker";

DatePicker.Trigger = DatePickerTrigger;

DatePicker.Overlay = DatePickerOverlay;

DatePicker.QuickSelect = DatePickerQuickSelect;
