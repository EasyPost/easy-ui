# `Select` Component Specification

## Overview

The `Select` component allows users to select a value from a set of options.

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

export type SelectProps = AriaSelectProps & {
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
   * Whether the select field should display its "valid" or "invalid" visual styling.
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
   * Size affects the overall size of the select field, but it also influences
   * the size of iconAtStart.
   * @default md
   */
  size?: SelectSize;
  /** The content to display as the label. */
  label: ReactNode;
  /** Error text that appears below select field. */
  errorText?: ReactNode;
  /** Helper text that appears below select field. */
  helperText?: ReactNode;
  /** Left aligned icon on select field. */
  iconAtStart?: IconSymbol;
  /** Method that is called when the open state of the select field changes. */
  onOpenChange?: (isOpen: boolean) => void;
  /** Sets the open state of the select field. */
  isOpen?: boolean;
  /** The currently selected key in the collection (controlled). */
  selectedKey?: Key | null;
  /** The initial selected key in the collection (uncontrolled). */
  defaultSelectedKey?: Key;
  /** Handler that is called when the selection changes. */
  onSelectionChange?: (key: Key) => any;
  /** The contents of the collection. */
  children: CollectionChildren<T>;
  /** Item objects in the collection. */
  items?: Iterable<T>;
  /** The item keys that are disabled. These items cannot be selected, focused, or otherwise interacted with. */
  disabledKeys?: Iterable<Key>;
};
```

### Anatomy

The `Select` component's behavior and accessibility implementation will be handled by React Aria's `useSelect` hook. State managment will be handled by React Stately's `useSelectState` hook. To handle the associated dropdown menu, `OverlayContainer` and `usePopover` will be used from React Aria. The implementation for the menu will take heavy inspiration from Easy UI's `MenuOverlay`.

### Example Usage

_Simple controlled selection:_

```tsx
import { Select } from "@easypost/easy-ui/Select";

export function Component() {
  const [shippingVolume, setShippingVolume] = React.useState("# of packages");

  return (
    <Select
      label="Monthly shipping volume"
      selectedKey={shippingVolume}
      onSelectionChange={(selected) => setShippingVolume(selected)}
    >
      <Select.Item key="# of packages"># of packages</Select.Item>
      <Select.Item key="1000">1000</Select.Item>
      <Select.Item key="50000">50000</Select.Item>
      <Select.Item key="1M+">1M+</Select.Item>
    </Select>
  );
}
```

_With helper text and passing data from external source:_

```tsx
import { Select } from "@easypost/easy-ui/Select";

const options = [
  { volume: "# of packages" },
  { volume: "1000" },
  { volume: "50000" },
  { volume: "1M+" },
];

export function Component() {
  const [shippingVolume, setShippingVolume] = React.useState("# of packages");

  return (
    <Select
      label="Monthly shipping volume"
      selectedKey={shippingVolume}
      onSelectionChange={(selected) => setShippingVolume(selected)}
      items={options}
      helperText="Helper text"
    >
      {(item) => <Select.Item>{item.volume}</Select.Item>}
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
      label="Monthly shipping volume"
      validationState="invalid"
      errorText="Something went wrong"
    >
      <Select.Item key="# of packages"># of packages</Select.Item>
      <Select.Item key="1000">1000</Select.Item>
      <Select.Item key="50000">50000</Select.Item>
      <Select.Item key="1M+">1M+</Select.Item>
    </Select>
  );
}
```

---

## Behavior

### Accessibility

Accessibility

- Labels should be included on all select fields as they describe the purpose of any associated form control. In situations when you may want the label to be visually hidden, use the `isLabelVisuallyHidden` prop.
- Do not use `placeholder` text as a replacement for labels. It can be used to provide an example to users, but will disappear from the field when a user enters text. It's also not broadly supported by assistive technologies and won't display in older browsers.

## Dependencies

- `react-aria`— `useSelect` `usePopover` `OverlayContainer`
- `react-stately` - `useSelectState` `Item`
