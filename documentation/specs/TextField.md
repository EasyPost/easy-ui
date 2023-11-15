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
  /** Left aligned icon on input. */
  iconAtStart?: IconSymbol;
  /** Right aligned icon on input. */
  iconAtEnd?: IconSymbol;
};

export type TextFieldProps = Omit<InputFieldProps, "isMultiline" | "rows">;
```

### Anatomy

The bulk of the `TextFild` component behavior will be handled by an internal `InputField` component, which will do the heavy lifting with regards to styling and form control logic. The `InputField` component is using React Aria's `useTextField` hook as it provides the behavior and accessibility implementation for a text field.

```tsx
export function TextField(props: TextFieldProps) {
  const {
    type = "text",
    size = "md",
    isDisabled = false,
    isRequired = false,
    validationState = "valid",
    isLabelEmphasized = false,
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

  return (
    <InputField
      type={type}
      size={size}
      isDisabled={isDisabled}
      isRequired={isRequired}
      validationState={validationState}
      isLabelEmphasized={isLabelEmphasized}
      autoFocus={autoFocus}
      label={label}
      errorText={errorText}
      helperText={helperText}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      iconAtStart={iconAtStart}
      iconAtEnd={iconAtEnd}
    />
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
        aria-label="Search for carriers"
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

- Labels should be included on all text fields as they describe the purpose of the form control. In situations when you may want the label to be visually hidden, provide a label via the `aria-label` prop.
- Do not use `placeholder` text as a replacement for labels. It can be used to provide an example to users, but will disappear from the field when a user enters text. It's also not broadly supported by assistive technologies and won't display in older browsers.

## Dependencies

- `react-aria`— `useTextField`
