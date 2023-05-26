import React, { ReactNode, useState } from "react";
import { AriaTextFieldProps, useTextField } from "react-aria";
import VisibilityIcon from "@easypost/easy-ui-icons/Visibility";
import VisibilityOffIcon from "@easypost/easy-ui-icons/VisibilityOff";
import { UnstyledButton } from "../UnstyledButton";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";
import styles from "./TextField.module.scss";

export type InputType = "text" | "email" | "password" | "tel" | "search";
export type TextFieldSize = "sm" | "md" | "lg";
export type ValidationState = "valid" | "invalid";

export type TextFieldProps = AriaTextFieldProps & {
  /**
   * Sets the underlying HTML input type. Setting type to password adds a clickable and
   * focusable right aligned visibility icon.
   * @default 'text'
   */
  type?: InputType;
  /**
   * TextField size affects the overall size of the input, but it also influences the size of
   * iconAtStart and iconAtEnd. For instance, with `sm` size, the associated iconAtStart
   * or iconAtEnd size maps to the Easy UI icon size of 'sm'.
   * @default 'md'
   */
  size?: TextFieldSize;
  /**
   * Visually hides the label, but keeps it accessible.
   * @default false
   */
  isLabelVisuallyHidden?: boolean;
  /** Error text that appears below input */
  errorText?: ReactNode;
  /** Helper text that appears below input */
  helperText?: ReactNode;
  /** Whether the input is disabled */
  isDisabled?: boolean;
  /** Whether user input is required on the input before form submission */
  isRequired?: boolean;
  /** Whether the input should display its "valid" or "invalid" visual styling */
  validationState?: ValidationState;
  /** Whether the element should receive focus on render */
  autoFocus?: boolean;
  /** Temporary text that occupies the text input when it is empty */
  placeholder?: string;
  /** The current value (controlled) */
  value?: string;
  /** The default value (uncontrolled) */
  defaultValue?: string;
  /** The content to display as the label */
  label: ReactNode;
  /** Label text displays with emphasis */
  emphasizedLabel?: boolean;
  /** Left aligned icon */
  iconAtStart?: IconSymbol;
  /** Right aligned icon */
  iconAtEnd?: IconSymbol;
};

export function TextField(props: TextFieldProps) {
  const {
    type = "text",
    size = "md",
    isLabelVisuallyHidden = false,
    isDisabled = false,
    isRequired = false,
    validationState = "valid",
    emphasizedLabel = false,
    iconAtStart,
    iconAtEnd,
    label,
    errorText,
    helperText,
    placeholder = "",
    value,
  } = props;
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

  const {
    labelProps,
    inputProps,
    descriptionProps: helperTextProps,
    errorMessageProps: errorTextProps,
  } = useTextField(props, ref);

  const bothIconPropsDefined = iconAtEnd && iconAtStart;
  if (bothIconPropsDefined) {
    // eslint-disable-next-line no-console
    console.warn("Cannot simultaneously define `iconAtEnd` and `iconAtStart`");
  }

  const isPassword = type === "password";
  const hasError = validationState === "invalid";
  const showErrorText = hasError && errorText;
  const showHelperText = !hasError && helperText;
  const hasStartIcon = !bothIconPropsDefined && !isPassword && iconAtStart;
  const hasEndIcon = !bothIconPropsDefined && !isPassword && iconAtEnd;
  const typeAdjustedForPasswordVisibility = isPassword && isVisible;
  const iconSize = mapIconSize(size);

  return (
    <div className={classNames(styles.root)}>
      <div className={styles.inputLabelContainer}>
        <div className={styles.inputIconContainer}>
          {hasStartIcon && getIcon(iconAtStart, true, size)}
          <input
            {...inputProps}
            className={classNames(
              styles.input,
              isPassword && styles.passwordInput,
              hasError && styles.errorInput,
              hasStartIcon && styles.iconStartInput,
              hasEndIcon && styles.iconEndInput,
              styles[variationName("inputSize", size)],
            )}
            ref={ref}
            type={typeAdjustedForPasswordVisibility ? "text" : type}
            value={value}
            required={isRequired}
            disabled={isDisabled}
            placeholder={placeholder}
          />
          {isPassword ? (
            <UnstyledButton
              className={classNames(
                styles.passwordBtn,
                hasError && styles.passwordBtnError,
                styles[variationName("btnSize", size)],
              )}
              onPress={() => setIsVisible((prevVisibility) => !prevVisibility)}
            >
              <Text visuallyHidden>password visibility</Text>
              <Icon
                symbol={isVisible ? VisibilityIcon : VisibilityOffIcon}
                size={iconSize}
              />
            </UnstyledButton>
          ) : (
            hasEndIcon && getIcon(iconAtEnd, false, size)
          )}
        </div>
        <label
          {...labelProps}
          className={classNames(
            styles.label,
            isLabelVisuallyHidden && styles.labelHidden,
            hasError && styles.labelError,
          )}
        >
          <Text
            variant={
              emphasizedLabel && size === "md"
                ? "subtitle1"
                : size === "sm"
                ? "body2"
                : "body1"
            }
            as={emphasizedLabel && size === "md" ? "strong" : "span"}
            visuallyHidden={isLabelVisuallyHidden}
          >
            {label}
          </Text>
        </label>
      </div>
      {showHelperText && (
        <div {...helperTextProps} className={styles.caption}>
          <Text variant="caption" color="gray.resting">
            {helperText}
          </Text>
        </div>
      )}
      {showErrorText && (
        <div {...errorTextProps} className={styles.caption}>
          <Text variant="caption" color="danger">
            {errorText}
          </Text>
        </div>
      )}
    </div>
  );
}

function mapIconSize(size: TextFieldSize) {
  return size === "sm" ? "xs" : size;
}

function getIcon(
  symbol: IconSymbol,
  isStartIcon: boolean,
  size: TextFieldSize,
) {
  return (
    <div
      className={classNames(
        styles.icon,
        isStartIcon ? styles.iconStart : styles.iconEnd,
        styles[variationName("iconSize", size)],
      )}
    >
      <Icon symbol={symbol} size={mapIconSize(size)} />
    </div>
  );
}
