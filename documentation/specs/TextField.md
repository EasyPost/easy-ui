# `TextField` Component Specification

## Overview

The `TextField` component allows users to input text on a single line and provides the essentials to be used as a form control element.

### Use Cases

- Use this component when building forms that require `text`, `email`, `password`, and `tel` inputs.
- Can be used as the basis for a `search` input.

### Features

- Setting `type` to `password` adds a clickable and focusable right aligned visibility icon as well.
- Setting the `size` property also sets size for iconAtStart and iconAtEnd: The size values map to Easy UI's token sizes for icons.
- When `errorText` is supplied with `validationState="invalid"`, `helperText` is overriden.
- Underlying input type can be set to `text`, `email`, `password`, `tel`, or `search`.
- `isLabelVisuallyHidden` property can be used to visually hide the label.

### Risks and Challenges

- Accomodating various input types and variations while keeping a relatively simple and approachable API.
- Ensuring the component remains accessible when label is visually hidden.

### Prior Art

- [Paste `<Input />`](https://paste.twilio.design/components/input)
- [Polaris `<TextField />`](https://polaris.shopify.com/components/selection-and-input/text-field)
- [Spectrum `<TextField />`](https://react-spectrum.adobe.com/react-spectrum/TextField.html)

---

## Design

### API

```ts
import type { AriaTextFieldProps } from "react-aria";

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
```

### Anatomy

The bulk of the `TextField` component behavior will be handled by React Aria's `useTextField` hook as it provides the behavior and accessibility implementation for a text field.

```tsx
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
```

### Example Usage

_Email with autoFocus:_

```tsx
import { TextField } from "@easypost/easy-ui/TextField";

export function Component() {
  const [email, setEmail] = useState("");
  return (
    <>
      <TextField
        type="email"
        label="Email address"
        autoFocus
        value={email}
        onChange={(inputValue) => setEmail(inputValue)} // value is returned automatically via react-aria
        isRequired
      />
      <span>email entered: {email}</span>
    </>
  );
}
```

_Password variation with helper text:_

```tsx
import { TextField } from "@easypost/easy-ui/TextField";

export function Component() {
  const [password, setPassword] = useState("");
  return (
    <>
      <TextField
        type="password"
        label="Password"
        helperText={<a href={RESET_URL}>Forgot password? </a>}
        value={password}
        onChange={(inputValue) => setPassword(inputValue)} // value is returned automatically via react-aria
        isRequired
      />
    </>
  );
}
```

_Visually hidden label with left aligned icon and placeholder text:_

```tsx
import { TextField } from "@easypost/easy-ui/TextField";
import SearchIcon from "@easypost/easy-ui-icons/Search";

export function Component() {
  const [searchedValue, setSearchedValue] = useState("");
  return (
    <>
      <TextField
        type="search"
        label="Search for carriers" // visually hidden but still accessible via isLabelVisuallyHidden prop
        isLabelVisuallyHidden
        iconAtStart={AnIcon}
        value={searchedValue}
        onChange={(inputValue) => setSearchedValue(inputValue)} // value is returned automatically via react-aria
        placeholder="FedEx, UPS, USPS"
        isRequired
      />
    </>
  );
}
```

_Disabled TextField:_

```tsx
import { TextField } from "@easypost/easy-ui/TextField";

export function Component() {
  const [value, setValue] = useState("");
  return (
    <>
      <TextField
        label="Disabled"
        value={value}
        onChange={(inputValue) => setValue(inputValue)} // value is returned automatically via react-aria
        isDisabled
      />
    </>
  );
}
```

_Invalid state with error text:_

```tsx
import { TextField } from "@easypost/easy-ui/TextField";

export function Component() {
  const [value, setValue] = useState("");
  return (
    <>
      <TextField
        label="Error"
        validationState="invalid"
        helperText="Some text" // will be overriden in the presence of an invalid state with error text
        errorText="Some error text"
        value={value}
        onChange={(inputValue) => setValue(inputValue)} // value is returned automatically via react-aria
        isRequired
      />
    </>
  );
}
```

---

## Behavior

### Accessibility

Accessibility

- Labels should be included on all text fields as they describe the purpose of the form control. In situations when you may want the label to be visually hidden, use the `isLabelVisuallyHidden` prop.
- Do not use `placeholder` text as a replacement for labels. It can be used to provide an example to users, but will disappear from the field when a user enters text. It's also not broadly supported by assistive technologies and won't display in older browsers.

## Dependencies

- `react-aria`— `useTextField`
