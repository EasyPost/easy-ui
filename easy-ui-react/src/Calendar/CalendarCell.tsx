import React from "react";
import { has } from "lodash";
import { useCalendarCell, useLocale } from "react-aria";
import { CalendarState, RangeCalendarState } from "@react-stately/calendar";
import { CalendarDate, isSameDay, getDayOfWeek } from "@internationalized/date";
import { Text } from "../Text";
import { classNames } from "../utilities/css";

import styles from "./CalendarCell.module.scss";

export type CalendarCellProps = {
  state: CalendarState | RangeCalendarState;
  /**
   * The date that this cell represents.
   */
  date: CalendarDate;
};

export function CalendarCell({ state, date }: CalendarCellProps) {
  const ref = React.useRef(null);
  const { locale } = useLocale();
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);
  const isRangeCalendar = has(state, "highlightedRange");
  const rangeState = state as unknown as RangeCalendarState;
  const isNextMonth = date.compare(state.visibleRange.end) > 0;
  const isPreviousMonth = date.compare(state.visibleRange.start) < 0;

  const handleMonthNavigation = (e: React.MouseEvent<HTMLDivElement>) => {
    // Handle month navigation for dates outside current month
    if (
      isNextMonth &&
      !isUnavailable &&
      !state.isDisabled &&
      !state.isReadOnly
    ) {
      state.focusNextPage();
    } else if (
      isPreviousMonth &&
      !isUnavailable &&
      !state.isDisabled &&
      !state.isReadOnly
    ) {
      state.focusPreviousPage();
    }

    // Call react-aria's onClick handler to properly handle date selection
    if (buttonProps.onClick) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      buttonProps.onClick(e as any);
    }
  };

  const isSelectionStart = rangeState.highlightedRange
    ? isSameDay(date, rangeState.highlightedRange.start)
    : isSelected;

  const isSelectionEnd = rangeState.highlightedRange
    ? isSameDay(date, rangeState.highlightedRange.end)
    : isSelected;

  const isRangeSelection =
    isSelected && isRangeCalendar && !isSelectionStart && !isSelectionEnd;

  const dayOfWeek = getDayOfWeek(date, locale);

  const isRoundedRight =
    isSelected &&
    (isSelectionEnd ||
      dayOfWeek === 6 ||
      date.day === date.calendar.getDaysInMonth(date));

  return (
    <td {...cellProps} className={styles.CellContainer}>
      <div
        {...buttonProps}
        ref={ref}
        className={classNames(
          styles.CalendarCell,
          isSelected && styles.isSelected,
          (state.isDisabled || isDisabled) && styles.isDisabled,
          isUnavailable && styles.isUnavailable,
          state.isReadOnly && styles.isReadOnly,
          isOutsideVisibleRange && styles.isOutsideCurrentMonth,
          isSelectionStart && !isDisabled && styles.rangeSelectionStart,
          isRangeSelection && styles.rangeSelection,
          isRoundedRight && styles.roundedRight,
        )}
        onClick={handleMonthNavigation}
      >
        <Text variant="body1">{formattedDate}</Text>
      </div>
    </td>
  );
}
