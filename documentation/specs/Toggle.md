# `Toggle` Component Specification

## Overview

A Toggle is an interactive binary control.

### Use Cases

- Use a Toggle when an "on/off" or "yes/no" input is needed.
- "Users expect the same immediate results from a digital toggle as they do from their real-world counterparts (e.g., light switches). Immediate results are a facet of toggle switches that grants users the freedom and control to update their preferences as needed." -Nielsen Normann Group

### Features

- Supports labels
- Supports disabled state
- Supports readonly state
- Can be controlled or uncontrolled

### Prior Art

- [Aria's `useSwitch`](https://react-spectrum.adobe.com/react-aria/useSwitch.html)
- [Paste's `<Switch />`](https://paste.twilio.design/components/switch)

---

## Design

The design of the `Toggle` component will rely heavily on React Aria's `useSwitch` hook. As such, the properties that are exposed by the component are largely synonymous with the props required by `useSwitch`.

### API

```ts
type ToggleProps = {
  /**
   * The label for the toggle.
   */
  children?: ReactNode;

  /**
   * Whether the toggle should be selected (uncontrolled).
   */
  defaultSelected?: boolean;

  /**
   * Disables the toggle.
   */
  isDisabled?: boolean;

  /**
   * Marks the toggle as immutable.
   */
  isReadOnly?: boolean;

  /**
   * Whether the toggle should be selected (controlled).
   */
  isSelected?: boolean;

  /**
   * The name of the toggle, used when submitting an HTML form.
   */
  name?: string;

  /**
   * Handler that is called when the toggle's selection state changes.
   */
  onChange?: (isSelected: boolean) => void;

  /**
   * The value of the toggle, used when submitting an HTML form.
   */
  value?: string;
};
```

### Example Usage

```tsx
import { Toggle } from "@easypost/easy-ui/Toggle";

function Component() {
  return <Toggle>Toggle item</Toggle>;
}
```

_Default value:_

```tsx
import { Toggle } from "@easypost/easy-ui/Toggle";

function Component() {
  return <Toggle defaultSelected={true}>Toggle item</Toggle>;
}
```

_Controlled:_

```tsx
import { Toggle } from "@easypost/easy-ui/Toggle";

function Component() {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <Toggle
      isSelected={isSelected}
      onChange={(isSelected) => setIsSelected(isSelected)}
    >
      Toggle item
    </Toggle>
  );
}
```

_Disabled:_

```tsx
import { Toggle } from "@easypost/easy-ui/Toggle";

function Component() {
  return <Toggle isDisabled={true}>Toggle item</Toggle>;
}
```

_Read-only:_

```tsx
import { Toggle } from "@easypost/easy-ui/Toggle";

function Component() {
  return (
    <Toggle isSelected={true} isReadOnly={true}>
      Toggle item
    </Toggle>
  );
}
```

_Form submission data:_

```tsx
import { Toggle } from "@easypost/easy-ui/Toggle";

function Component() {
  return (
    <Toggle name="toggle-name" value="toggle-value">
      Toggle item
    </Toggle>
  );
}
```

### Anatomy

The `Toggle` component will render a visually hidden `input` and defer styling to custom elements. The component will be wrapped in a `label`.

```tsx
function Toggle() {
  return (
    <label>
      <VisuallyHidden>
        <input {...inputProps} />
      </VisuallyHidden>
      <span>
        <Switch />
        <Label />
      </span>
    </label>
  );
}
```

---

## Behavior

### Accessibility

- Toggle always has the `role="switch"` attribute.

- Toggle must have a visible label that is in close proximity to the control. The `Toggle` component doesn't enforce this for the consumer in case use cases require more complex labeling structure, but discretion should be used in such scenarios.

### Dependencies

- React Aria's `useSwitch`, `useFocusRing`, `VisuallyHidden`, and `useToggleState`
