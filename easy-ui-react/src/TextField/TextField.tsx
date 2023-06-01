import React, { ReactNode, useState } from "react";
import { AriaTextFieldProps, useTextField } from "react-aria";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";
import { Label } from "./Label";
import { InputCaption } from "./InputCaption";
import { PasswordButton } from "./PasswordButton";
import { InputIcon } from "./InputIcon";
import styles from "./TextField.module.scss";

export type InputType = "text" | "email" | "password" | "tel" | "search";
export type InputSize = "sm" | "md" | "lg";
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
  size?: InputSize;
  /**
   * Visually hides the label, but keeps it accessible.
   * @default false
   */
  isLabelVisuallyHidden?: boolean;
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
  emphasizedLabel?: boolean;
  /**
   * Whether the element should receive focus on render.
   * @default false
   */
  autoFocus?: boolean;
  /** The content to display as the label. */
  label: ReactNode;
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
  /** Left aligned icon on input. */
  iconAtStart?: IconSymbol;
  /** Right aligned icon on input. */
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
  const isTypeAdjustedForPasswordVisibility = isPassword && isPasswordVisible;
  const captionProps = showHelperText ? helperTextProps : errorTextProps;
  const captionText = showHelperText ? helperText : errorText;

  return (
    <div className={classNames(styles.root)}>
      <div className={styles.inputLabelContainer}>
        <Label
          isLabelVisuallyHidden={isLabelVisuallyHidden}
          inputSize={size}
          hasError={hasError}
          emphasizedLabel={emphasizedLabel}
          {...labelProps}
        >
          {label}
        </Label>
        <div className={styles.inputIconContainer}>
          {hasStartIcon && (
            <InputIcon
              alignment="start"
              inputSize={size}
              isDisabled={isDisabled}
              icon={iconAtStart}
            />
          )}
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
            type={isTypeAdjustedForPasswordVisibility ? "text" : type}
            value={value}
            required={isRequired}
            disabled={isDisabled}
            placeholder={placeholder}
            autoFocus={autoFocus}
            defaultValue={defaultValue}
          />
          {isPassword ? (
            <PasswordButton
              hasError={hasError}
              inputSize={size}
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
                inputSize={size}
                isDisabled={isDisabled}
                icon={iconAtEnd}
              />
            )
          )}
        </div>
      </div>
      <InputCaption
        variant={showHelperText ? "helper" : "error"}
        {...captionProps}
      >
        {captionText}
      </InputCaption>
    </div>
  );
}
