import React, { AriaAttributes } from "react";
import { CalendarState, RangeCalendarState } from "@react-stately/calendar";
import { AriaButtonProps } from "react-aria";
import { Text } from "../Text";
import { Icon } from "../Icon";
import { HorizontalStack } from "../HorizontalStack";
import DoubleArrowLeftIcon from "@easypost/easy-ui-icons/KeyboardDoubleArrowLeft";
import DoubleArrowRightIcon from "@easypost/easy-ui-icons/KeyboardDoubleArrowRight";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { UnstyledButton } from "../UnstyledButton";

import styles from "./CalendarHeader.module.scss";

export type CalendarHeaderProps = {
  state: CalendarState | RangeCalendarState;
  /**
   * Props for the calendar grouping element.
   */
  calendarProps: AriaAttributes;
  /**
   * A description of the visible date range, for use in the calendar
   * title.
   */
  title: string;
  /**
   * Props for the previous button.
   */
  prevButtonProps: AriaButtonProps;
  /**
   * Props for the next button.
   */
  nextButtonProps: AriaButtonProps;
};
export function CalendarHeader({
  title,
  calendarProps,
  prevButtonProps,
  nextButtonProps,
}: CalendarHeaderProps) {
  return (
    <div className={styles.CalendarHeader}>
      <VisuallyHidden>
        <h2>{calendarProps["aria-label"]}</h2>
      </VisuallyHidden>
      <HorizontalStack align="space-between" blockAlign="center">
        <UnstyledButton {...prevButtonProps}>
          <Icon symbol={DoubleArrowLeftIcon} color="neutral.000" />
        </UnstyledButton>
        <Text variant="subtitle2" color="neutral.000">
          {title}
        </Text>
        <UnstyledButton {...nextButtonProps}>
          <Icon symbol={DoubleArrowRightIcon} color="neutral.000" />
        </UnstyledButton>
      </HorizontalStack>
    </div>
  );
}
