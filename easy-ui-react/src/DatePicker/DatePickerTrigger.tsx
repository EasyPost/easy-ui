import React, { MutableRefObject, ReactNode } from "react";
import CalendarMonth from "@easypost/easy-ui-icons/CalendarMonth";
import { GroupDOMAttributes } from "@react-types/shared";
import { AriaDatePickerProps, DateValue, AriaButtonProps } from "react-aria";
import { DatePickerState, DateRangePickerState } from "react-stately";
import { InputIcon } from "../InputField/InputIcon";
import { UnstyledButton } from "../UnstyledButton";
import { DateFieldField } from "./DateField";
import { VerticalStack } from "../VerticalStack";
import { Text } from "../Text";
import { classNames } from "../utilities/css";
import styles from "./DatePicker.module.scss";

export type DatePickerTriggerProps = {
  isDisabled?: boolean;
  size?: "sm" | "md";
  triggerRef: MutableRefObject<null>;
  datePickerRef: MutableRefObject<null>;
  buttonProps: AriaButtonProps;
  groupProps: GroupDOMAttributes;
  startFieldProps?: AriaDatePickerProps<DateValue>;
  endFieldProps?: AriaDatePickerProps<DateValue>;
  fieldProps?: AriaDatePickerProps<DateValue>;
  isInvalid?: boolean;
  errorMessage?: ReactNode;
  state: DatePickerState | DateRangePickerState;
};

export function DatePickerTrigger(props: DatePickerTriggerProps) {
  const {
    isDisabled,
    size,
    triggerRef,
    datePickerRef,
    buttonProps,
    groupProps,
    startFieldProps,
    endFieldProps,
    fieldProps,
    isInvalid,
    errorMessage,
    state,
  } = props;

  const className = classNames(
    styles.datePickerTrigger,
    (isInvalid || state.isInvalid) && styles.errorInput,
    isDisabled && styles.disabled,
  );

  return (
    <VerticalStack gap="1">
      <div
        className={styles.datePickerTriggerContainer}
        ref={datePickerRef}
        {...groupProps}
      >
        <UnstyledButton {...buttonProps} className={className} ref={triggerRef}>
          <DateFieldField {...(fieldProps ? fieldProps : startFieldProps)} />
          {endFieldProps && (
            <>
              <Text variant="caption">&mdash;</Text>
              <DateFieldField {...endFieldProps} />
            </>
          )}
          <InputIcon
            alignment="end"
            icon={CalendarMonth}
            size={size}
            isDisabled={isDisabled}
          />
        </UnstyledButton>
      </div>
      {(isInvalid || state.isInvalid) && (
        <Text color="negative.500" variant="caption">
          {errorMessage}
        </Text>
      )}
    </VerticalStack>
  );
}
