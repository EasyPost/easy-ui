import React from "react";
import {
  ColorSwatch as AriaColorSwatch,
  Button,
  ColorField,
  ColorFieldProps,
  Input,
} from "react-aria-components";
import { InputFieldProps, InputSize } from "../InputField";
import { InputCaption } from "../InputField/InputCaption";
import { Label } from "../InputField/Label";
import { classNames, variationName } from "../utilities/css";
import { ColorPicker, ColorPickerProps } from "./ColorPicker";

import styles from "./ColorPickerInputField.module.scss";

export type ColorPickerInputFieldProps = Omit<ColorPickerProps, "children"> & {
  /**
   * Size affects the overall size of the input, but it also influences the size of
   * iconAtStart and iconAtEnd.
   * @default md
   */
  size?: InputSize;
  /** The content to display as the label. */
  label?: InputFieldProps["label"];
  /**
   * Label text displays with emphasis.
   * @default false
   */
  isLabelEmphasized?: InputFieldProps["isLabelEmphasized"];
  /** Helper text that appears below input. */
  helperText?: InputFieldProps["helperText"];
  /** Error text that appears below input. */
  errorText?: InputFieldProps["errorText"];
  /**
   * Whether the input should display its "valid" or "invalid" visual styling.
   * @default valid
   */
  validationState?: InputFieldProps["validationState"];
  /**
   * Whether the input is disabled.
   * @default false
   */
  isDisabled?: InputFieldProps["isDisabled"];
  /**
   * Whether the input is readonly.
   * @default false
   */
  isReadOnly?: InputFieldProps["isReadOnly"];
  /**
   * Whether user input is required on the input before form submission.
   * @default false
   */
  isRequired?: InputFieldProps["isRequired"];
  /**
   * Whether the element should receive focus on render.
   * @default false
   */
  autoFocus?: boolean;
  /** Temporary text that occupies the text input when it is empty. */
  placeholder?: InputFieldProps["placeholder"];
  /**
   * Accessibility label for input field.
   */
  "aria-label"?: ColorFieldProps["aria-label"];
  /**
   * Accessibility label identifier for input field.
   */
  "aria-labelledby"?: ColorFieldProps["aria-labelledby"];
};

/**
 * A `<ColorPickerInputField />` allows users to select a color with a color
 * picker or text input.
 *
 * @example
 * <ColorPickerInputField
 *   defaultValue="#ff0000"
 *   helperText="Select a primary color"
 *   label={<>Primary color</>}
 *   onChange={() => {}}
 * />
 */
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
    isRequired,
    placeholder,
    autoFocus,
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
        isRequired={isRequired}
        isInvalid={validationState === "invalid"}
        autoFocus={autoFocus}
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
              <ColorPicker.Trigger>
                <Button className={styles.swatchButton}>
                  <InputColorSwatch />
                </Button>
              </ColorPicker.Trigger>
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

function InputColorSwatch() {
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
