import React, { ReactNode, useState } from "react";
import { AriaTextFieldProps, useHover } from "react-aria";
import { ValidationState } from "@react-types/shared";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";
import { Label } from "./Label";
import { InputCaption } from "./InputCaption";
import { PasswordButton } from "./PasswordButton";
import { InputIcon } from "./InputIcon";
import { InputText } from "./inputText";
import { useInputField } from "./useInputField";
import styles from "./InputField.module.scss";
import {
  getElementType,
  logWarningForMissingAriaLabel,
  logWarningsForInvalidPropConfiguration,
} from "./utilities";

export type InputType =
  | "text"
  | "email"
  | "password"
  | "tel"
  | "search"
  | undefined;
export type InputSize = "sm" | "md" | "lg";

export type InputFieldProps = AriaTextFieldProps & {
  /**
   * Sets the underlying HTML input type. Setting type to password adds a clickable and
   * focusable right aligned visibility icon.
   * @default text
   */
  type?: InputType;
  /**
   * Accessibility label for input field.
   */
  "aria-label"?: string;
  /**
   * Whether the input is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether user input is required on the input before form submission.
   * @default false
   */
  isRequired?: boolean;
  /**
   * Whether the input should display its "valid" or "invalid" visual styling.
   * @default valid
   */
  validationState?: ValidationState;
  /**
   * Label text displays with emphasis.
   * @default false
   */
  isLabelEmphasized?: boolean;
  /**
   * Whether the element should receive focus on render.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * Size affects the overall size of the input, but it also influences the size of
   * iconAtStart and iconAtEnd.
   * @default md
   */
  size?: InputSize;
  /**
   * Sets underlying HTML element to textarea.
   * @default false
   */
  isMultiline?: boolean;
  /** The content to display as the label. */
  label?: ReactNode;
  /** Error text that appears below input. */
  errorText?: ReactNode;
  /** Helper text that appears below input. */
  helperText?: ReactNode;
  /** Temporary text that occupies the text input when it is empty. */
  placeholder?: string;
  /** The current value (controlled). */
  value?: string;
  /** The default value (uncontrolled). */
  defaultValue?: string;
  /** Specifies the visible height of a text area, in lines. */
  rows?: number;
  /** Left aligned icon on input. */
  iconAtStart?: IconSymbol;
  /** Right aligned icon on input. */
  iconAtEnd?: IconSymbol;
  /** Left aligned text on input */
  textAtStart?: string;
  /** Right aligned text on input */
  textAtEnd?: string;
};
/**
 * @privateRemarks
 * The InputField is an internal component that has been designed to support the TextField
 * and Textarea components. It handles the heavy lifting with regards to styling and form control logic,
 * and is using React Aria's `useTextField` hook to provide the behavior and accessibility implementation.
 */
export function InputField(props: InputFieldProps) {
  const {
    isMultiline = false,
    type = "text",
    size = "md",
    isDisabled = false,
    isRequired = false,
    validationState = "valid",
    isLabelEmphasized = false,
    autoFocus = false,
    "aria-label": ariaLabel,
    label,
    errorText,
    helperText,
    placeholder,
    value,
    defaultValue,
    iconAtStart,
    iconAtEnd,
    textAtStart,
    textAtEnd,
    rows,
  } = props;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const ref = React.useRef(null);
  const { labelProps, elementProps, helperTextProps, errorTextProps } =
    useInputField(props, ref);
  const { isHovered: isInputHovered, hoverProps } = useHover(props);

  const Component = getElementType(isMultiline);

  const bothIconPropsDefined = !!iconAtEnd && !!iconAtStart;
  const iconAndTextPropsDefined =
    (!!iconAtEnd || !!iconAtStart) && (!!textAtStart || !!textAtEnd);
  const smallSizeTextarea = size === "sm" && Component === "textarea";
  const definedIconsWithTextarea =
    (!!iconAtEnd || !!iconAtStart) && Component === "textarea";
  const definedprefixsuffixWithTextarea =
    (!!textAtStart || !!textAtEnd) && Component === "textarea";

  logWarningsForInvalidPropConfiguration(
    bothIconPropsDefined,
    smallSizeTextarea,
    definedIconsWithTextarea,
    iconAndTextPropsDefined,
  );

  logWarningForMissingAriaLabel(label, ariaLabel);

  const isPassword = type === "password";
  const hasError = validationState === "invalid";
  const showErrorText = hasError && errorText;
  const showHelperText = !showErrorText && helperText;
  const canUseIcon =
    !bothIconPropsDefined && !isPassword && !definedIconsWithTextarea;
  const canUsetextAtStartAndAtEnd = !definedprefixsuffixWithTextarea;
  const hasStartIcon = canUseIcon && iconAtStart;
  const hasEndIcon = canUseIcon && iconAtEnd;
  const hasTextAtStart = canUsetextAtStartAndAtEnd && textAtStart;
  const hastextAtEnd = canUsetextAtStartAndAtEnd && textAtEnd;
  const isTypeAdjustedForPasswordVisibility = isPassword && isPasswordVisible;
  const captionProps = showHelperText ? helperTextProps : errorTextProps;
  const captionText = showHelperText ? helperText : errorText;
  const adjustedSize = smallSizeTextarea ? "md" : size;

  const className = classNames(
    styles.input,
    isInputHovered && styles.hovered,
    Component === "textarea" && styles.textArea,
    isPassword && styles.passwordInput,
    hasError && styles.errorInput,
    hasStartIcon && styles.iconStartInput,
    hasEndIcon && styles.iconEndInput,
    hasTextAtStart && styles.textStartInput,
    hastextAtEnd && styles.textEndInput,
    styles[variationName("inputSize", adjustedSize)],
  );

  const inputType =
    Component === "textarea"
      ? undefined
      : isTypeAdjustedForPasswordVisibility
        ? "text"
        : type;

  return (
    <div className={classNames(styles.root)}>
      {label && (
        <Label
          fieldSize={adjustedSize}
          hasError={hasError}
          isLabelEmphasized={isLabelEmphasized}
          {...labelProps}
        >
          {label}
        </Label>
      )}
      <div className={styles.inputIconContainer}>
        {hasStartIcon && (
          <InputIcon
            alignment="start"
            size={adjustedSize}
            isDisabled={isDisabled}
            icon={iconAtStart}
          />
        )}
        {hasTextAtStart && (
          <InputText alignment="start" size={adjustedSize} text={textAtStart} />
        )}
        <Component
          {...elementProps}
          {...hoverProps}
          className={className}
          ref={ref}
          type={inputType}
          value={value}
          required={isRequired}
          disabled={isDisabled}
          placeholder={placeholder}
          autoFocus={autoFocus}
          defaultValue={defaultValue}
          rows={Component === "textarea" ? rows : undefined}
        />
        {hastextAtEnd && (
          <InputText alignment="end" size={adjustedSize} text={textAtEnd} />
        )}
        {isPassword ? (
          <PasswordButton
            isInputHovered={isInputHovered}
            hasError={hasError}
            inputSize={adjustedSize}
            isDisabled={isDisabled}
            isPasswordVisible={isPasswordVisible}
            toggleVisibility={() =>
              setIsPasswordVisible((prevVisibility) => !prevVisibility)
            }
          />
        ) : (
          hasEndIcon && (
            <InputIcon
              alignment="end"
              size={adjustedSize}
              isDisabled={isDisabled}
              icon={iconAtEnd}
            />
          )
        )}
      </div>
      {(showErrorText || showHelperText) && (
        <InputCaption
          variant={showHelperText ? "helper" : "error"}
          {...captionProps}
        >
          {captionText}
        </InputCaption>
      )}
    </div>
  );
}
