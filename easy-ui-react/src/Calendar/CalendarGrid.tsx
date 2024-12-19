import React from "react";
import { useCalendarGrid, useLocale } from "react-aria";
import { getWeeksInMonth } from "@internationalized/date";
import { CalendarState, RangeCalendarState } from "@react-stately/calendar";
import { CalendarDate, isSameMonth } from "@internationalized/date";
import { Text } from "../Text";
import { CalendarCell } from "./CalendarCell";
import styles from "./CalendarGrid.module.scss";

export type CalendarGridProps = {
  state: CalendarState | RangeCalendarState;
  weekdayStyle?: "narrow" | "short" | "long";
  showDaysOutsideCurrentMonth?: boolean;
};

export function CalendarGrid({ state, ...props }: CalendarGridProps) {
  const { locale } = useLocale();
  const { showDaysOutsideCurrentMonth } = props;
  const visibleStartDate = state.visibleRange.start;
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(visibleStartDate, locale);
  return (
    <table {...gridProps} className={styles.CalendarGrid}>
      <thead {...headerProps} className={styles.CalendarGridHeader}>
        <tr>
          {weekDays.map((day, index) => (
            <th key={index}>
              <Text variant="caption3" color="neutral.000">
                {day}
              </Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date: CalendarDate | null, i: number) =>
                date &&
                (isSameMonth(visibleStartDate, date) ||
                  showDaysOutsideCurrentMonth) ? (
                  <CalendarCell key={i} state={state} date={date} />
                ) : (
                  <td key={i} />
                ),
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
