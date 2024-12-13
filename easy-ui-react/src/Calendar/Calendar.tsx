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

/**
 *
 * A `Calendar` displays a grid of days and allows users to select a single date.
 *
 * @example
 * _Default Value:_
 * ```tsx
 * <Calendar defaultValue={new CalendarDate(2024, 7, 25)} />
 * ```
 *
 * @example
 * _Set limited available dates:_
 * ```tsx
 * <Calendar
 *  minValue={new CalendarDate(2024, 7, 24)}
 *  maxValue={new CalendarDate(2024, 8, 5)}
 * />
 * ```
 *
 * @example
 * _Date availability:_
 * ```tsx
 * <Calendar
 *  isDateUnavailable={(date: DateValue) =>
 *    today(getLocalTimeZone()).compare(date) > 0
 *  }
 * />
 * ```
 *
 * @example
 * _Controlled:_
 * ```tsx
 * const [date, setDate] = React.useState(null);
 * 
 * <Calendar
 *  value={date}
 *  onChange={setDate}
 * />
 * ```
 */
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
