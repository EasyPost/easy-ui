import React from "react";
import { useDateField, useDateSegment, useLocale } from "react-aria";
import {
  useDateFieldState,
  DateFieldState,
  DateSegment as DateSegmentType,
} from "react-stately";
import { createCalendar } from "@internationalized/date";
import { DateValue } from "@react-types/calendar";
import { HorizontalStack } from "../HorizontalStack";
import { classNames } from "../utilities/css";

import styles from "./DatePicker.module.scss";

type DateFieldFieldProps = {
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  isOpen?: boolean;
  defaultOpen?: boolean;
  value?: DateValue | null;
  onChange?: (value: DateValue | null) => void;
};
export function DateFieldField(props: DateFieldFieldProps) {
  const dateFieldRef = React.useRef(null);
  const { locale } = useLocale();
  const state = useDateFieldState({ ...props, locale, createCalendar });
  const { fieldProps } = useDateField(props, state, dateFieldRef);

  return (
    <div {...fieldProps} ref={dateFieldRef}>
      <HorizontalStack blockAlign="center">
        {state.segments.map((segment, i) => (
          <DateSegment key={i} segment={segment} state={state} />
        ))}
      </HorizontalStack>
    </div>
  );
}

type DateSegmentProps = {
  segment: DateSegmentType;
  state: DateFieldState;
};

function DateSegment(props: DateSegmentProps) {
  const { segment, state } = props;
  const { type } = segment;
  const dateSegmentRef = React.useRef(null);
  const { segmentProps } = useDateSegment(segment, state, dateSegmentRef);

  return (
    <div
      {...segmentProps}
      ref={dateSegmentRef}
      className={classNames(
        styles.DateSegment,
        type === "literal" && !state.value && styles.literalSegment,
      )}
    >
      {segment.text}
    </div>
  );
}
