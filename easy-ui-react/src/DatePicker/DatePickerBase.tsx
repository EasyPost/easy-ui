import React, { DOMAttributes, MutableRefObject, ReactNode } from "react";
import {
  AriaButtonProps,
  AriaDatePickerProps,
  AriaDialogProps,
} from "react-aria";
import { DatePickerState, DateRangePickerState } from "react-stately";
import { DateValue } from "@react-types/calendar";
import { FocusableElement, GroupDOMAttributes } from "@react-types/shared";
import { DatePicker } from "./DatePicker";
import { Text } from "../Text";
import { logWarningForMissingAriaLabel } from "../InputField/utilities";
import { classNames, variationName } from "../utilities/css";
import styles from "./DatePicker.module.scss";

type TriggerProps = {
  datePickerRef: MutableRefObject<null>;
  buttonProps: AriaButtonProps;
  groupProps: GroupDOMAttributes;
  startFieldProps?: AriaDatePickerProps<DateValue>;
  endFieldProps?: AriaDatePickerProps<DateValue>;
  fieldProps?: AriaDatePickerProps<DateValue>;
  isDisabled?: boolean;
  size?: "sm" | "md";
  isInvalid?: boolean;
  errorMessage?: ReactNode;
};

type OverlayProps = {
  dialogProps: AriaDialogProps;
};

export type DatePickerProps = {
  /**
   * Accessibility label for input field.
   */
  "aria-label"?: string;
  /**
   * The content to display as the label.
   */
  label?: string;
  triggerProps: TriggerProps;
  overlayProps: OverlayProps;
  labelProps: DOMAttributes<FocusableElement>;
  children: ReactNode;
  state: DatePickerState | DateRangePickerState;
};
export function DatePickerBase(props: DatePickerProps) {
  const {
    label,
    "aria-label": ariaLabel,
    triggerProps,
    overlayProps,
    labelProps,
    children,
    state,
  } = props;
  const { size } = triggerProps;
  const triggerRef = React.useRef(null);

  logWarningForMissingAriaLabel(label, ariaLabel);

  const className = classNames(
    styles.DatePicker,
    size && styles[variationName("datePicker", size)],
  );
  return (
    <div className={className}>
      {label && (
        <Text
          {...labelProps}
          variant={size === "sm" ? "body2" : "body1"}
          color="primary.800"
        >
          {label}
        </Text>
      )}
      <DatePicker.Trigger
        {...triggerProps}
        triggerRef={triggerRef}
        state={state}
      />
      <DatePicker.Overlay
        {...overlayProps}
        triggerRef={triggerRef}
        state={state}
      >
        {children}
      </DatePicker.Overlay>
    </div>
  );
}
