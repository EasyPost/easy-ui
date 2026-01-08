import React from "react";
import {
  ColorSwatch as AriaColorSwatch,
  Button,
  ColorField,
  ColorFieldProps,
  ColorPicker,
  Input,
} from "react-aria-components";
import { InputFieldProps, InputSize } from "../InputField";
import { InputCaption } from "../InputField/InputCaption";
import { classNames, variationName } from "../utilities/css";
import { ColorPickerProps, ColorPickerTrigger } from "./ColorPicker";

import styles from "./ColorPickerInputField.module.scss";
import { Label } from "../InputField/Label";

export type ColorPickerInputFieldProps = ColorPickerProps & {
  size?: InputSize;
  label?: InputFieldProps["label"];
  isLabelEmphasized?: InputFieldProps["isLabelEmphasized"];
  helperText?: InputFieldProps["helperText"];
  errorText?: InputFieldProps["errorText"];
  validationState?: InputFieldProps["validationState"];
  isDisabled?: InputFieldProps["isDisabled"];
  isReadOnly?: InputFieldProps["isReadOnly"];
  placeholder?: InputFieldProps["placeholder"];
  "aria-label"?: ColorFieldProps["aria-label"];
  "aria-labelledby"?: ColorFieldProps["aria-labelledby"];
};

export function ColorPickerInputField(props: ColorPickerInputFieldProps) {
  const {
    size = "md",
    validationState,
    errorText,
    helperText,
    label,
    isLabelEmphasized,
    isDisabled,
    isReadOnly,
    placeholder,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    ...colorPickerProps
  } = props;
  const className = classNames(
    styles.ColorPickerInput,
    validationState === "invalid" && styles.error,
    styles[variationName("size", size)],
  );
  return (
    <ColorPicker {...colorPickerProps}>
      <ColorField
        className={className}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
      >
        {label && (
          <Label
            isLabelEmphasized={isLabelEmphasized}
            fieldSize={size}
            hasError={validationState === "invalid"}
          >
            {label}
          </Label>
        )}
        <div className={styles.inputContainer}>
          <div className={styles.swatchContainer}>
            {isDisabled || isReadOnly ? (
              <InputColorSwatch />
            ) : (
              <ColorPickerTrigger>
                <Button className={styles.swatchButton}>
                  <InputColorSwatch />
                </Button>
              </ColorPickerTrigger>
            )}
          </div>
          <Input className={styles.input} placeholder={placeholder} />
        </div>
        {(helperText || errorText) && (
          <InputCaption
            variant={
              errorText && validationState === "invalid" ? "error" : "helper"
            }
          >
            {errorText || helperText}
          </InputCaption>
        )}
      </ColorField>
    </ColorPicker>
  );
}

export function InputColorSwatch() {
  return (
    <AriaColorSwatch
      className={styles.swatch}
      style={({ color }) => ({
        background: `
          linear-gradient(${color}, ${color}),
          repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 50% / 16px 16px
        `,
      })}
    />
  );
}
