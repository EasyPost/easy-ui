# `Select` Component Specification

## Overview

The `Select` component allows users to select a value from a set of options. Though the associated dropdown is visually similar to Easy UI's `Menu`, it takes on the ARIA role of `listbox` and the associated options have a role of `option`.

### Use Cases

- Can be used as a traditional select on forms.

### Features

- Setting the `size` property also sets size for iconAtStart: The size values map to Easy UI's token sizes for icons.
- When `errorText` is supplied with `validationState="invalid"`, `helperText` is overriden.
- `isLabelVisuallyHidden` property can be used to visually hide the label.
- Supports disabled state.

### Risks and Challenges

- Ensuring dropdown doesn't inadvertently get cut off.
- Maintaining an approachable and familiar API; similar to existing Easy UI form related components.
- Ensuring the component remains accessible when label is visually hidden.

### Prior Art

- [Paste `<Select />`](https://paste.twilio.design/components/select)
- [Polaris `<Select />`](https://polaris.shopify.com/components/selection-and-input/select)
- [Spectrum `<Picker />`](https://react-spectrum.adobe.com/react-spectrum/Picker.html)

---

## Design

### API

```ts
import type { AriaSelectProps } from "react-aria";

export type SelectSize = "sm" | "md" | "lg";
export type ValidationState = "valid" | "invalid";

export type SelectProps<T> = AriaSelectProps<T> &
  SelectFieldProps & {
    /** Method that is called when the open state of the select field changes. */
    onOpenChange?: (isOpen: boolean) => void;
    /** Sets the open state of the select field. */
    isOpen?: boolean;
    /** The currently selected key in the collection (controlled). */
    selectedKey?: Key | null;
    /** The initial selected key in the collection (uncontrolled). */
    defaultSelectedKey?: Key;
    /** Handler that is called when the selection changes. */
    onSelectionChange?: (key: Key) => void;
    /** The contents of the collection. */
    children: CollectionChildren<T>;
    /** The item keys that are disabled. These items cannot be selected, focused, or otherwise interacted with. */
    disabledKeys?: Iterable<Key>;
  };

export type SelectFieldProps = {
  /**
   * Visually hides the label, but keeps it accessible.
   * @default false
   */
  isLabelVisuallyHidden?: boolean;
  /**
   * Whether the select field is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether user input is required on the select field before form submission.
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
   * Size affects the overall size of the select field, but it also influences
   * the size of iconAtStart.
   * @default md
   */
  size?: SelectFieldSize;
  /** The content to display as the label. */
  label: ReactNode;
  /** Error text that appears below select field. */
  errorText?: ReactNode;
  /** Helper text that appears below select field. */
  helperText?: ReactNode;
  /** Temporary text that occupies select field when it is empty. */
  placeholder?: string;
  /** Left aligned icon on input. */
  iconAtStart?: IconSymbol;
  /** Label props associated with field. */
  labelProps?: DOMAttributes<FocusableElement>;
  /** Helper text props associated with field. */
  helperTextProps?: DOMAttributes<FocusableElement>;
  /** Error text props associated with field. */
  errorTextProps?: DOMAttributes<FocusableElement>;
  /** Field value props. */
  valueProps?: DOMAttributes<FocusableElement>;
};
```

### Anatomy

The `Select` component's behavior and accessibility implementation will be handled by React Aria's `useSelect` hook. State managment will be handled by React Stately's `useSelectState` hook. To handle the associated listbox, `OverlayContainer`, `useListBox`, and `usePopover` will be used from React Aria. For the options, `useOption` will be used from React Aria. The `Select` component will also support sections and will use `useListBoxSection` and `useSeparator` from React Aria. The implementation for the listbox will take heavy inspiration from Easy UI's `MenuOverlay`.

### Example Usage

_Simple controlled selection:_

```tsx
import { Select } from "@easypost/easy-ui/Select";

export function Component() {
  const [selectedOption, setSelectedOption] = React.useState("Option 1");

  return (
    <Select
      label="Label"
      selectedKey={selectedOption}
      onSelectionChange={(selected) => setSelectedOption(selected)}
      helperText="Helper text"
    >
      <Select.Option key="Option 1">Option 1</Select.Option>
      <Select.Option key="Option 2">Option 2</Select.Option>
      <Select.Option key="Option 3">Option 3</Select.Option>
    </Select>
  );
}
```

_Simple controlled selection with separator:_

```tsx
import { Select } from "@easypost/easy-ui/Select";

export function Component() {
  const [selectedOption, setSelectedOption] = React.useState("Option 1");

  return (
    <Select
      label="Label"
      selectedKey={selectedOption}
      onSelectionChange={(selected) => setSelectedOption(selected)}
      helperText="Helper text"
    >
      <Select.Section aria-label="Primary options">
        <Select.Option key="Option 1">Option 1</Select.Option>
        <Select.Option key="Option 2">Option 2</Select.Option>
        <Select.Option key="Option 3">Option 3</Select.Option>
      </Select.Section>
      <Select.Section aria-label="Secondary options">
        <Select.Option key="Option 4">Option 4</Select.Option>
        <Select.Option key="Option 5">Option 5</Select.Option>
        <Select.Option key="Option 6">Option 6</Select.Option>
      </Select.Section>
    </Select>
  );
}
```

_Invalid state with error text:_

```tsx
import { Select } from "@easypost/easy-ui/Select";

export function Component() {
  return (
    <Select
      label="Label"
      validationState="invalid"
      errorText="Something went wrong"
    >
      <Select.Option key="Option 1">Option 1</Select.Option>
      <Select.Option key="Option 2">Option 2</Select.Option>
      <Select.Option key="Option 3">Option 3</Select.Option>
    </Select>
  );
}
```

_With left aligned icon:_

```tsx
import { Select } from "@easypost/easy-ui/Select";
import SomeIcon from "@easypost/easy-ui-icons/Some";

export function Component() {
  return (
    <Select label="Label" iconAtStart={SomeIcon}>
      <Select.Option key="Option 1">Option 1</Select.Option>
      <Select.Option key="Option 2">Option 2</Select.Option>
      <Select.Option key="Option 3">Option 3</Select.Option>
    </Select>
  );
}
```

---

## Behavior

### Accessibility

Accessibility

- Labels should be included on all select fields as they describe the purpose of any associated form control. In situations when you may want the label to be visually hidden, use the `isLabelVisuallyHidden` prop.
- The dropdown has an ARIA role of `listbox`.

## Dependencies

- `react-aria`— `useSelect` `usePopover` `OverlayContainer` `useListBox` `useOption` `useListBoxSection` `useSeparator`
- `react-stately` - `useSelectState` `Item` `Section`
