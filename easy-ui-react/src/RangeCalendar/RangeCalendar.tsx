import React from "react";
import { useRangeCalendar, useLocale } from "react-aria";
import { useRangeCalendarState } from "react-stately";
import { RangeValue } from "@react-types/shared";
import { createCalendar } from "@internationalized/date";
import { DateValue, MappedDateValue, DateRange } from "@react-types/calendar";
import { CalendarBase, CalendarBaseStateProps } from "../Calendar/CalendarBase";

export type RangeCalendarProps = CalendarBaseStateProps & {
  /**
   * The current value (controlled).
   */
  value?: DateRange | null;
  /**
   * The default value (uncontrolled).
   */
  defaultValue?: DateRange | null;
  /**
   * Handler that is called when the value changes.
   */
  onChange?: (value: RangeValue<MappedDateValue<DateValue>>) => void;
};

/**
 *
 * A `RangeCalendar` displays a grid of days and allows users to select a range of dates.
 *
 * @example
 * _Default Value:_
 * ```tsx
 * <Calendar
 *   defaultValue={{
 *     start: new CalendarDate(2024, 7, 15),
 *     end: new CalendarDate(2024, 7, 25),
 *   }}
 * />
 * ```
 *
 * @example
 * _Set limited available dates:_
 * ```tsx
 * <RangeCalendar
 *  minValue={new CalendarDate(2024, 7, 24)}
 *  maxValue={new CalendarDate(2024, 8, 5)}
 * />
 * ```
 *
 * @example
 * _Date availability:_
 * ```tsx
 * <RangeCalendar
 *  isDateUnavailable={(date: DateValue) =>
 *    today(getLocalTimeZone()).compare(date) > 0
 *  }
 * />
 * ```
 *
 * @example
 * _Controlled:_
 * ```tsx
 * const [date, setDate] = React.useState({
 *   start: today(getLocalTimeZone()).subtract({ days: 7 }),
 *   end: today(getLocalTimeZone()),
 * });
 *
 * <RangeCalendar
 *  value={date}
 *  onChange={setDate}
 * />
 * ```
 */
export function RangeCalendar(props: RangeCalendarProps) {
  const { locale } = useLocale();
  const calendarRef = React.useRef(null);
  const state = useRangeCalendarState({
    ...props,
    locale,
    createCalendar,
  });
  const rangeCalendarProps = useRangeCalendar(props, state, calendarRef);

  return (
    <CalendarBase
      {...props}
      {...rangeCalendarProps}
      state={state}
      calendarRef={calendarRef}
    />
  );
}

RangeCalendar.displayName = "RangeCalendar";
