# `TextArea` Component Specification

## Overview

The `TextArea` component allows users to input text on multiple lines.

### Use Cases

- Allows users to enter free-form multi-line plain text.

### Features

- Users can adjust height, but not width.
- When `errorText` is supplied with `validationState="invalid"`, `helperText` is overriden.
- `isLabelVisuallyHidden` property can be used to visually hide the label.

### Risks and Challenges

- Ensuring the component remains accessible when label is visually hidden.

### Prior Art

- [Paste `<TextArea />`](https://paste.twilio.design/components/textarea)
- [Atlassian `<TextArea />`](https://atlassian.design/components/textarea/examples)
- [Spectrum `<TextArea />`](https://react-spectrum.adobe.com/react-spectrum/TextArea.html)

---

## Design

### API

```ts
import type { AriaTextFieldProps } from "react-aria";

export type TextAreaSize = "md" | "lg";
export type ValidationState = "valid" | "invalid";

export type TextAreaProps = AriaTextFieldProps & {
  /**
   * The size of the TextArea.
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
};
```

### Anatomy

The bulk of the `TextArea` component behavior will be handled by React Aria's `useTextField` hook as it provides the behavior and accessibility implementation for a text area field. The `TextArea` component relies on the following Easy UI utility components: `Label` and `InputCaption`.

```tsx
export function TextArea(props: TextAreaProps) {
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
  } = props;

  const ref = React.useRef(null);

  const {
    labelProps,
    inputProps,
    descriptionProps: helperTextProps,
    errorMessageProps: errorTextProps,
  } = useTextField({ ...props, inputElementType: "textarea" }, ref);

  const hasError = validationState === "invalid";
  const showErrorText = hasError && errorText;
  const showHelperText = !showErrorText && helperText;
  const captionProps = showHelperText ? helperTextProps : errorTextProps;
  const captionText = showHelperText ? helperText : errorText;

  return (
    <div>
      <div>
        <Label
          isLabelVisuallyHidden={isLabelVisuallyHidden}
          inputSize={size}
          hasError={hasError}
          emphasizedLabel={emphasizedLabel}
          {...labelProps}
        >
          {label}
        </Label>
        <textarea
          {...inputProps}
          ref={ref}
          value={value}
          required={isRequired}
          disabled={isDisabled}
          placeholder={placeholder}
          autoFocus={autoFocus}
          defaultValue={defaultValue}
        />
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

_Description with helper text:_

```tsx
import { TextArea } from "@easypost/easy-ui/TextArea";

export function Component() {
  const [description, setDescription] = useState("");
  return (
    <>
      <TextArea
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
import { TextArea } from "@easypost/easy-ui/TextArea";

export function Component() {
  const [description, setDescription] = useState("");
  return (
    <>
      <TextArea
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
import { TextArea } from "@easypost/easy-ui/TextArea";

export function Component() {
  const [value, setValue] = useState("");
  return (
    <>
      <TextArea
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

- `react-aria`— `useTextArea`
