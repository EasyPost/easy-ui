import React from "react";
import { DateRange } from "react-aria";
import { UnstyledButton } from "../UnstyledButton";
import { DateRangePickerState } from "react-stately";
import styles from "../DatePicker/DatePicker.module.scss";

export type OptionProps = {
  label: string;
  dateRange: DateRange;
};

export type DatePickerQuickSelectProps = {
  quickSelectOptions: OptionProps[];
  state: DateRangePickerState;
};

export function DatePickerQuickSelect(props: DatePickerQuickSelectProps) {
  const { quickSelectOptions, state } = props;

  return (
    <ul className={styles.quickSelection}>
      {quickSelectOptions.map(({ label, dateRange }) => (
        <li key={label} className={styles.option}>
          <UnstyledButton onPress={() => state.setValue(dateRange)}>
            {label}
          </UnstyledButton>
        </li>
      ))}
    </ul>
  );
}
