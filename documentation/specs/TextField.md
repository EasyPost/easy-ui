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

export type TextFieldType =
  | "text"
  | "email"
  | "password"
  | "tel"
  | "search"
  | undefined;
export type TextFieldSize = "sm" | "md" | "lg";
export type ValidationState = "valid" | "invalid";

export type BaseInputProps = AriaTextFieldProps & {
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
  /** Specifies the visible height of a text area, in lines. */
  rows?: number;
};

export type TextFieldProps = BaseInputProps & {
  /**
   * Sets the underlying HTML input type. Setting type to password adds a clickable and
   * focusable right aligned visibility icon.
   * @default text
   */
  type?: TextFieldType;
  /**
   * TextField size affects the overall size of the input, but it also influences the size of
   * iconAtStart and iconAtEnd.
   * @default md
   */
  size?: TextFieldSize;
  /**
   * Sets underlying HTML element to textarea.
   * @default false
   */
  isMultiline?: boolean;
  /** Left aligned icon on input. */
  iconAtStart?: IconSymbol;
  /** Right aligned icon on input. */
  iconAtEnd?: IconSymbol;
};
```

### Anatomy

The bulk of the `TextField` component behavior will be handled by React Aria's `useTextField` hook as it provides the behavior and accessibility implementation for a text field. The `TextField` component relies on the following Easy UI utility components: `Label`, `TextFieldIcon`, `PasswordButton`, and `InputCaption`.

```tsx
export function TextField(props: TextFieldProps) {
  const {
    isMultiline = false,
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
    rows,
  } = props;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const ref = React.useRef(null);
  const { labelProps, elementProps, helperTextProps, errorTextProps } =
    useTextFieldElement(props, ref);

  const Elem = isMultiline ? "textarea" : "input";

  const bothIconPropsDefined = !!iconAtEnd && !!iconAtStart;
  const smallSizeTextarea = size === "sm" && Elem === "textarea";
  const definedIconsWithTextarea =
    (!!iconAtEnd || !!iconAtStart) && Elem === "textarea";

  logWarningsForInvalidPropConfiguration(
    bothIconPropsDefined,
    smallSizeTextarea,
    definedIconsWithTextarea,
  );

  const isPassword = type === "password";
  const hasError = validationState === "invalid";
  const showErrorText = hasError && errorText;
  const showHelperText = !showErrorText && helperText;
  const canUseIcon =
    !bothIconPropsDefined && !isPassword && !definedIconsWithTextarea;
  const hasStartIcon = canUseIcon && iconAtStart;
  const hasEndIcon = canUseIcon && iconAtEnd;
  const isTypeAdjustedForPasswordVisibility = isPassword && isPasswordVisible;
  const captionProps = showHelperText ? helperTextProps : errorTextProps;
  const captionText = showHelperText ? helperText : errorText;

  const className = classNames(
    styles.input,
    Elem === "textarea" && styles.textArea,
    isPassword && styles.passwordInput,
    hasError && styles.errorInput,
    hasStartIcon && styles.iconStartInput,
    hasEndIcon && styles.iconEndInput,
    styles[variationName("inputSize", size)],
  );

  const inputType =
    Elem === "textarea"
      ? undefined
      : isTypeAdjustedForPasswordVisibility
      ? "text"
      : type;

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
            <TextFieldIcon
              alignment="start"
              size={size}
              isDisabled={isDisabled}
              icon={iconAtStart}
            />
          )}
          <Elem
            {...elementProps}
            className={className}
            ref={ref}
            type={inputType}
            value={value}
            required={isRequired}
            disabled={isDisabled}
            placeholder={placeholder}
            autoFocus={autoFocus}
            defaultValue={defaultValue}
            rows={Elem === "textarea" ? rows : undefined}
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
              <TextFieldIcon
                alignment="end"
                size={size}
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
