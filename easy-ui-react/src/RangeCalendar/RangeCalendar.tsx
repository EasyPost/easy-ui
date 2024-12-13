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
