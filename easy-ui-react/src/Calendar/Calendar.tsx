import React from "react";
import { useCalendar, useLocale } from "react-aria";
import { useCalendarState } from "react-stately";
import { createCalendar } from "@internationalized/date";
import { DateValue, MappedDateValue } from "@react-types/calendar";
import { CalendarBase, CalendarBaseStateProps } from "./CalendarBase";

export type CalendarProps = CalendarBaseStateProps & {
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
  const calendarRef = React.useRef(null);
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar,
  });
  const calendarProps = useCalendar(props, state);

  return (
    <CalendarBase
      {...props}
      {...calendarProps}
      state={state}
      calendarRef={calendarRef}
    />
  );
}

Calendar.displayName = "Calendar";
