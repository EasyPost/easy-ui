import React, { ReactNode, HTMLAttributes } from "react";
import { AriaButtonProps } from "react-aria";
import { Text } from "../Text";
import { CalendarState, RangeCalendarState } from "@react-stately/calendar";
import { RefObject } from "@react-types/shared";
import { DateValue } from "@react-types/calendar";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import styles from "./Calendar.module.scss";

export type CalendarBaseStateProps = {
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
   * Callback that is called for each date of the calendar. If
   * it returns true, then the date is unavailable.
   */
  isDateUnavailable?: (date: DateValue) => boolean;
  /**
   * Whether the current selection is invalid according to application logic.
   */
  isInvalid?: boolean;
  /**
   * An error message to display when the selected value is invalid.
   */
  errorMessage?: ReactNode;
  /**
   * Display the days falling into the other months.
   * @default false
   */
  showDaysOutsideCurrentMonth?: boolean;
};

type CalendarBaseProps = {
  state: CalendarState | RangeCalendarState;
  isInvalid?: boolean;
  showDaysOutsideCurrentMonth?: boolean;
  errorMessage?: ReactNode;
  calendarProps: HTMLAttributes<HTMLElement>;
  nextButtonProps: AriaButtonProps;
  prevButtonProps: AriaButtonProps;
  errorMessageProps: HTMLAttributes<HTMLElement>;
  calendarRef: RefObject<HTMLDivElement | null>;
};

export function CalendarBase(props: CalendarBaseProps) {
  const {
    state,
    isInvalid,
    errorMessage,
    calendarProps,
    nextButtonProps,
    prevButtonProps,
    calendarRef,
    showDaysOutsideCurrentMonth,
    ...restProps
  } = props;
  return (
    <div className={styles.calendarContainer}>
      <div {...calendarProps} className={styles.Calendar} ref={calendarRef}>
        <CalendarHeader
          state={state}
          calendarProps={calendarProps}
          prevButtonProps={prevButtonProps}
          nextButtonProps={nextButtonProps}
        />
        <CalendarGrid
          state={state}
          showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth}
          {...restProps}
        />
      </div>
      {isInvalid && (
        <Text color="negative.500" variant="caption">
          {errorMessage}
        </Text>
      )}
    </div>
  );
}
