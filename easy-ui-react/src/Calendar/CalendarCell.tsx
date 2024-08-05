import React from "react";
import { useCalendarCell } from "react-aria";
import { CalendarState } from "@react-stately/calendar";
import { CalendarDate } from "@internationalized/date";
import { Text } from "../Text";
import { classNames } from "../utilities/css";

import styles from "./CalendarCell.module.scss";

export type CalendarCellProps = {
  state: CalendarState;
  /**
   * The date that this cell represents.
   */
  date: CalendarDate;
};

export function CalendarCell({ state, date }: CalendarCellProps) {
  const ref = React.useRef(null);
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);

  const isNextMonth = date.compare(state.visibleRange.end) > 0;
  const isPreviousMonth = date.compare(state.visibleRange.start) < 0;

  const handleNextPage = () => {
    if (isNextMonth) {
      state.focusNextPage();
    }
    if (isPreviousMonth) {
      state.focusPreviousPage();
    }
  };
  return (
    <td {...cellProps} className={styles.CellContainer}>
      <div
        {...buttonProps}
        ref={ref}
        className={classNames(
          styles.CalendarCell,
          isSelected && styles.isSelected,
          isDisabled && styles.isDisabled,
          isUnavailable && styles.isUnavailable,
          isOutsideVisibleRange && styles.isOutsideCurrentMonth,
        )}
        onClick={handleNextPage}
      >
        <Text variant="body1">{formattedDate}</Text>
      </div>
    </td>
  );
}
