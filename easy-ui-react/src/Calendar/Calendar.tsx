import React from "react";
import { useCalendar, useLocale } from "react-aria";
import { useCalendarState } from "react-stately";
import { createCalendar } from "@internationalized/date";
import { DateValue, MappedDateValue } from "@react-types/calendar";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarHeader } from "./CalendarHeader";
import styles from "./Calendar.module.scss";

export type CalendarProps = {
  /**
   * The minimum allowed date that a user may select.
   */
  minValue?: DateValue | null;
  /**
   * The maximum allowed date that a user may select.
   */
  maxValue?: DateValue | null;
  /**
   * Whether the calendar is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether the calendar value is immutable.
   * @default false
   */
  isReadOnly?: boolean;
  /**
   * The current value (controlled).
   */
  value?: DateValue | null;
  /**
   * The default value (uncontrolled).
   */
  defaultValue?: DateValue | null;
  /**
   * Handler that is called when the value changes.
   */
  onChange?: (value: MappedDateValue<DateValue | null>) => void;
  /**
   * Callback that is called for each date of the calendar. If
   * it returns true, then the date is unavailable.
   */
  isDateUnavailable?: (date: DateValue) => boolean;
};

export function Calendar(props: CalendarProps) {
  const { locale } = useLocale();
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar,
  });

  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useCalendar(props, state);
  return (
    <div {...calendarProps} className={styles.Calendar}>
      <CalendarHeader
        title={title}
        state={state}
        calendarProps={calendarProps}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
      />
      <CalendarGrid state={state} />
    </div>
  );
}

Calendar.displayName = "Calendar";
