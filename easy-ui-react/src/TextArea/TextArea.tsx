import React from "react";
import { BaseInputProps } from "../TextField";
import { TextField } from "../TextField";

export type TextAreaSize = "md" | "lg";

export type TextAreaProps = BaseInputProps & {
  /**
   * The size of the TextArea.
   * @default md
   */
  size?: TextAreaSize;
};

export function TextArea(props: TextAreaProps) {
  const {
    size = "md",
    isLabelVisuallyHidden = false,
    isDisabled = false,
    isRequired = false,
    validationState = "valid",
    emphasizedLabel = false,
    autoFocus = false,
    label,
    errorText,
    helperText,
    placeholder,
    value,
    defaultValue,
    rows = 1,
  } = props;
  return (
    <TextField
      as="textarea"
      size={size}
      isLabelVisuallyHidden={isLabelVisuallyHidden}
      isDisabled={isDisabled}
      isRequired={isRequired}
      validationState={validationState}
      emphasizedLabel={emphasizedLabel}
      autoFocus={autoFocus}
      label={label}
      errorText={errorText}
      helperText={helperText}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      rows={rows}
    />
  );
}
