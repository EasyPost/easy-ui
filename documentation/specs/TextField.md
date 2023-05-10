# `TextField` Component Specification

## Overview

The `TextField` component allows users to input text on a single line and provides the essentials to be used as a form control element. An Easy UI password input variation can be had by setting `variant="protected"`.

### Use Cases

- Use this component when building forms that require `text`, `email`, `password`, and `tel` inputs.
- Can be used as the basis for a `search` input.

### Features

- The net effect of setting `variant` to `protected` is to get a PasswordInput component with an appropriate visibility icon.
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

/**
 * Note that this does not represent an exhaustive list of the props
 * provided by AriaTextFieldProps, but they are notable properties that
 * consumers may use on the TextField component
 */
export type ValidationState = "valid" | "invalid";

type AriaTextFieldProps = {
  /** Whether the input is disabled. */
  isDisabled?: boolean;
  /** Whether user input is required on the input before form submission. */
  isRequired?: boolean;
  /** Whether the input should display its "valid" or "invalid" visual styling. */
  validationState?: ValidationState;
  /** Whether the element should receive focus on render. */
  autoFocus?: boolean;
  /** Temporary text that occupies the text input when it is empty. */
  placeholder?: string;
  /** The current value (controlled). */
  value?: string;
  /** The default value (uncontrolled). */
  defaultValue?: string;
  /** The content to display as the label. */
  label: ReactNode;
  /** Handler that is called when the value changes. */
  onChange?: (value: C) => void;
};

export type InputType = "text" | "email" | "password" | "tel" | "search";
export type TextFieldVariant = "protected" | "standard";
export type TextFieldSize = "sm" | "md" | "lg";

export type TextFieldProps = AriaTextFieldProps & {
  /**
   * Underlying HTML input type
   * @default 'text'
   */
  type?: InputType;
  /**
   * When set to `protected`, the underlying input is set to `password` and a right aligned
   * clickable and focusable visibility icon is added. The net effect is to give a PasswordInput.
   * @default 'standard'
   */
  variant?: TextFieldVariant;
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
  let {
    type = "text",
    variant = "standard",
    size = "md",
    isLabelVisuallyHidden = false,
    isDisabled = false,
    isRequired = false,
    validationState = "invalid",
    iconAtStart,
    iconAtEnd,
    label,
    errorText,
    helperText,
    placeholder,
    value,
  } = props;
  let ref = React.useRef(null);
  let {
    labelProps,
    inputProps,
    descriptionProps: helperTextProps,
    errorMessageProps: errorTextProps,
  } = useTextField(props, ref);

  const showHelperText =
    helperText && !errorText && validationState === "valid";
  const showErrorText =
    !showHelperText && errorText && validationState === "invalid";

  const isPasswordInput = variant === "protected";

  return (
    <div>
      <div>
        <div>
          {iconAtStart && <Icon symbol={iconAtStart} size={size} />}
          <input
            {...inputProps}
            ref={ref}
            type={type}
            value={value}
            required={isRequired}
            disabled={isDisabled}
            placeholder={placeholder}
          />
          {iconAtEnd && <Icon symbol={iconAtEnd} size={size} />}
        </div>
        <label {...labelProps}>
          <Text>{label}</Text>
        </label>
      </div>
      {showHelperText && (
        <div {...helperTextProps}>
          <Text>{helperText}</Text>
        </div>
      )}
      {showErrorText && (
        <div {...errorTextProps}>
          <Text>{errorText}</Text>
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

_Protected variation with helper text:_

```tsx
import { TextField } from "@easypost/easy-ui/TextField";

export function Component() {
  const [password, setPassword] = useState("");
  return (
    <>
      <TextField
        variant="protected"
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
import AnIcon from "@easypost/easy-ui-icons/AnIcon";

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
