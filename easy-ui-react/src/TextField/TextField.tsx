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
   * iconAtStart and iconAtEnd.
   * @default md
   */
  size?: TextFieldSize;
  /**
   * Visually hides the label, but keeps it accessible.
   * @default false
   */
  isLabelVisuallyHidden?: boolean;
  /**
   * Whether the input is disabled
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether user input is required on the input before form submission
   * @default false
   */
  isRequired?: boolean;
  /**
   * Whether the input should display its "valid" or "invalid" visual styling
   * @default valid
   */
  validationState?: ValidationState;
  /**
   * Label text displays with emphasis
   * @default false
   */
  emphasizedLabel?: boolean;
  /**
   * Whether the element should receive focus on render
   * @default false
   */
  autoFocus?: boolean;
  /** The content to display as the label */
  label: ReactNode;
  /** Error text that appears below input */
  errorText?: ReactNode;
  /** Helper text that appears below input */
  helperText?: ReactNode;
  /** Temporary text that occupies the text input when it is empty */
  placeholder?: string;
  /** The current value (controlled) */
  value?: string;
  /** The default value (uncontrolled) */
  defaultValue?: string;
  /** Left aligned icon */
  iconAtStart?: IconSymbol;
  /** Right aligned icon */
  iconAtEnd?: IconSymbol;
};

/**
 * Allows users to input text on a single line and provides the essentials
 * to be used as a form control element.
 *
 * @remarks
 * Use this component when building forms that require `text`, `email`, `password`,
 * and `tel` inputs. Can also be used as the basis for a `search` input.
 *
 * Setting `type` to `password` adds a clickable and focusable right aligned
 * visibility icon.
 *
 * When `errorText` is supplied with `validationState="invalid"`, `helperText` is overriden.
 *
 * Labels should be included on all text fields as they describe the purpose of the form control.
 * In situations when you may want the label to be visually hidden, use the `isLabelVisuallyHidden` prop.
 *
 * @example
 * _Email with autoFocus:_
 * ```tsx
 * import { TextField } from "@easypost/easy-ui/TextField";
 *
 * export function Component() {
 *  const [email, setEmail] = useState("");
 *  return (
 *    <>
 *      <TextField
 *        type="email"
 *        label="Email address"
 *        autoFocus
 *        value={email}
 *        onChange={(inputValue) => setEmail(inputValue)} // value is returned automatically via react-aria
 *        isRequired
 *      />
 *      <span>email entered: {email}</span>
 *    </>
 *  );
 * }
 * ```
 * @example
 * _Password variation with helper text:_
 * ```tsx
 * import { TextField } from "@easypost/easy-ui/TextField";
 *
 * export function Component() {
 *  const [password, setPassword] = useState("");
 *  return (
 *    <>
 *      <TextField
 *        type="password"
 *        label="Password"
 *        helperText={<a href={RESET_URL}>Forgot password? </a>}
 *        value={password}
 *        onChange={(inputValue) => setPassword(inputValue)} // value is returned automatically via react-aria
 *        isRequired
 *      />
 *    </>
 *  );
 * }
 * ```
 * @example
 * _Visually hidden label with left aligned icon and placeholder text:_
 * ```tsx
 * import { TextField } from "@easypost/easy-ui/TextField";
 *
 * export function Component() {
 *  const [searchedValue, setSearchedValue] = useState("");
 *  return (
 *    <>
 *      <TextField
 *        type="search"
 *        label="Search for carriers" // visually hidden but still accessible via isLabelVisuallyHidden prop
 *        isLabelVisuallyHidden
 *        iconAtStart={SearchIcon}
 *        value={searchedValue}
 *        onChange={(inputValue) => setSearchedValue(inputValue)} // value is returned automatically via react-aria
 *        placeholder="FedEx, UPS, USPS"
 *        isRequired
 *      />
 *    </>
 *  );
 * }
 * ```
 * @example
 * _Invalid state with error text:_
 * ```tsx
 * import { TextField } from "@easypost/easy-ui/TextField";
 *
 * export function Component() {
 *  const [value, setValue] = useState("");
 *  return (
 *    <>
 *      <TextField
 *        label="Error"
 *        validationState="invalid"
 *        helperText="Some text" // will be overriden in the presence of an invalid state with error text
 *        errorText="Some error text"
 *        value={value}
 *        onChange={(inputValue) => setValue(inputValue)} // value is returned automatically via react-aria
 *        isRequired
 *      />
 *    </>
 *  );
 * }
 * ```
 */
export function TextField(props: TextFieldProps) {
  const {
    type = "text",
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
    iconAtStart,
    iconAtEnd,
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
  const showHelperText = !showErrorText && helperText;
  const canUseIcon = !bothIconPropsDefined && !isPassword;
  const hasStartIcon = canUseIcon && iconAtStart;
  const hasEndIcon = canUseIcon && iconAtEnd;
  const typeAdjustedForPasswordVisibility = isPassword && isVisible;

  return (
    <div className={classNames(styles.root)}>
      <div className={styles.inputLabelContainer}>
        <label
          {...labelProps}
          className={classNames(
            styles.label,
            isLabelVisuallyHidden && styles.labelHidden,
          )}
        >
          {getLabelText(
            emphasizedLabel,
            hasError,
            isLabelVisuallyHidden,
            label,
            size,
          )}
        </label>
        <div className={styles.inputIconContainer}>
          {hasStartIcon && getIcon(iconAtStart, true, size, isDisabled)}
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
            autoFocus={autoFocus}
            defaultValue={defaultValue}
          />
          {isPassword ? (
            <UnstyledButton
              className={classNames(
                styles.passwordBtn,
                hasError && styles.passwordBtnError,
                styles[variationName("btnSize", size)],
              )}
              onPress={() => setIsVisible((prevVisibility) => !prevVisibility)}
              isDisabled={isDisabled}
            >
              <Text visuallyHidden>password visibility</Text>
              <Icon
                symbol={isVisible ? VisibilityIcon : VisibilityOffIcon}
                size={mapIconSize(size)}
              />
            </UnstyledButton>
          ) : (
            hasEndIcon && getIcon(iconAtEnd, false, size, isDisabled)
          )}
        </div>
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

/** Small textfield needs xs icon */
function mapIconSize(size: TextFieldSize) {
  if (size === "sm") {
    return "xs";
  } else if (size === "lg") {
    return "md";
  }
  return size;
}

function getIcon(
  symbol: IconSymbol,
  isStartIcon: boolean,
  size: TextFieldSize,
  isDisabled: boolean,
) {
  return (
    <div
      className={classNames(
        styles.icon,
        isStartIcon ? styles.iconStart : styles.iconEnd,
        isDisabled && styles.iconDisabled,
        styles[variationName("iconSize", size)],
      )}
    >
      <Icon symbol={symbol} size={mapIconSize(size)} />
    </div>
  );
}

function getLabelText(
  emphasizedLabel: boolean,
  hasError: boolean,
  visuallyHidden: boolean,
  label: ReactNode,
  size: TextFieldSize,
) {
  const hasEmphasis = emphasizedLabel && size !== "sm";
  const textVariant = hasEmphasis
    ? "subtitle1"
    : size === "sm"
    ? "body2"
    : "body1";
  const as = hasEmphasis ? "strong" : "span";
  const color = hasError ? "danger" : undefined;
  return (
    <Text
      variant={textVariant}
      as={as}
      color={color}
      visuallyHidden={visuallyHidden}
    >
      {label}
    </Text>
  );
}
