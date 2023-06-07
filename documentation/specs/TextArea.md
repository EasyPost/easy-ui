# `Textarea` Component Specification

## Overview

The `Textarea` component allows users to input text on multiple lines.

### Use Cases

- Allows users to enter free-form multi-line plain text.

### Features

- Users can adjust height, but not width.
- When `errorText` is supplied with `validationState="invalid"`, `helperText` is overriden.
- `isLabelVisuallyHidden` property can be used to visually hide the label.

### Risks and Challenges

- Ensuring the component remains accessible when label is visually hidden.

### Prior Art

- [Paste `<Textarea />`](https://paste.twilio.design/components/textarea)
- [Atlassian `<Textarea />`](https://atlassian.design/components/textarea/examples)
- [Spectrum `<Textarea />`](https://react-spectrum.adobe.com/react-spectrum/Textarea.html)

---

## Design

### API

```ts
import type { AriaTextFieldProps } from "react-aria";

export type TextareaSize = "md" | "lg";

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

export type TextareaProps = BaseInputProps & {
  /**
   * The size of the Textarea.
   * @default md
   */
  size?: TextareaSize;
};
```

### Anatomy

The `TextField` component was extended to accommodate the needs of the `Textarea` component. Behind the scenes, the bulk of the `TextField` component's behavior and accessibility is handled by React Aria's `useTextField` hook.

```tsx
export function Textarea(props: TextareaProps) {
  const {
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
    rows = 1,
  } = props;
  return (
    <TextField
      isMultiline
      size={size}
      isLabelVisuallyHidden={isLabelVisuallyHidden}
      isDisabled={isDisabled}
      isRequired={isRequired}
      validationState={validationState}
      emphasizedLabel={emphasizedLabel}
      autoFocus={autoFocus}
      label={label}
      errorText={errorText}
      helperText={helperText}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      rows={rows}
    />
  );
}
```

### Example Usage

_Description with helper text:_

```tsx
import { Textarea } from "@easypost/easy-ui/Textarea";

export function Component() {
  const [description, setDescription] = useState("");
  return (
    <>
      <Textarea
        label="Label"
        value={description}
        onChange={(inputValue) => setDescription(inputValue)} // value is returned automatically via react-aria
        helperText="Enter some text"
        isRequired
      />
      <span>description entered: {description}</span>
    </>
  );
}
```

_Visually hidden label with placeholder text:_

```tsx
import { Textarea } from "@easypost/easy-ui/Textarea";

export function Component() {
  const [description, setDescription] = useState("");
  return (
    <>
      <Textarea
        label="Label" // visually hidden but still accessible via isLabelVisuallyHidden prop
        isLabelVisuallyHidden
        value={description}
        onChange={(inputValue) => setDescription(inputValue)} // value is returned automatically via react-aria
        placeholder="Enter free-form text"
        isRequired
      />
    </>
  );
}
```

_Invalid state with error text:_

```tsx
import { Textarea } from "@easypost/easy-ui/Textarea";

export function Component() {
  const [value, setValue] = useState("");
  return (
    <>
      <Textarea
        label="Label"
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

- Labels should be included on all text area fields as they describe the purpose of any associated form control. In situations when you may want the label to be visually hidden, use the `isLabelVisuallyHidden` prop.
- Do not use `placeholder` text as a replacement for labels. It can be used to provide an example to users, but will disappear from the field when a user enters text. It's also not broadly supported by assistive technologies and won't display in older browsers.

## Dependencies

- `react-aria`— `useTextField`
