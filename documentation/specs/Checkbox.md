# `Checkbox` Component Specification

## Overview

A Checkbox is a form element that enables a binary choice.

### Use Cases

- Use a checkbox when users are required to make a binary choice.

### Features

- Supports labels
- Supports invalid state and custom error message in a tooltip
- Supports disabled state
- Supports indeterminate state
- Supports readonly state
- Can be controlled or uncontrolled

### Prior Art

- [Aria's `useCheckbox`](https://react-spectrum.adobe.com/react-aria/useCheckbox.html)
- [Paste `<Checkbox />`](https://paste.twilio.design/components/checkbox)

---

## Design

The design of the `Checkbox` component will rely heavily on React Aria's `useCheckbox` hook. As such, the properties that are exposed by the component are largely synonymous with the props required by `useCheckbox`.

### API

```ts
type CheckboxSize = "md" | "lg";
type CheckboxProps = {
  /**
   * The label for the checkbox.
   */
  children?: ReactNode;

  /**
   * Whether the element should be selected (uncontrolled).
   */
  defaultSelected?: boolean;

  /** Error text that appears in a tooltip. */
  errorText?: ReactNode;

  /**
   * Disables the checkbox.
   */
  isDisabled?: boolean;

  /**
   * Marks the checkbox as indeterminate.
   */
  isIndeterminate?: boolean;

  /**
   * Marks the checkbox as immutable.
   */
  isReadOnly?: boolean;

  /**
   * Whether the element should be selected (controlled).
   */
  isSelected?: boolean;

  /**
   * Level representation of the checkbox in a nested list of checkboxes.
   * @default 1
   */
  level?: "1" | "2";

  /**
   * The name of the checkbox, used when submitting an HTML form.
   */
  name?: string;

  /**
   * Handler that is called when the checkbox's selection state changes.
   */
  onChange?: (isSelected: boolean) => void;

  /**
   * Size of the checkbox.
   * @default md
   */
  size?: CheckboxSize;

  /**
   * Whether the input should display its "valid" or "invalid" visual styling
   * @default valid
   */
  validationState?: ValidationState;

  /**
   * The value of the checkbox, used when submitting an HTML form.
   */
  value?: string;
};
```

### Example Usage

```tsx
import { Checkbox } from "@easypost/easy-ui/Checkbox";

function Component() {
  return <Checkbox>Checkbox item</Checkbox>;
}
```

_Default value:_

```tsx
import { Checkbox } from "@easypost/easy-ui/Checkbox";

function Component() {
  return <Checkbox defaultSelected={true}>Checkbox item</Checkbox>;
}
```

_Controlled:_

```tsx
import { Checkbox } from "@easypost/easy-ui/Checkbox";

function Component() {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <Checkbox
      isSelected={isSelected}
      onChange={(isSelected) => setIsSelected(isSelected)}
    >
      Checkbox item
    </Checkbox>
  );
}
```

_Indeterminate:_

```tsx
import { Checkbox } from "@easypost/easy-ui/Checkbox";

function Component() {
  return <Checkbox isIndeterminate={true}>Checkbox item</Checkbox>;
}
```

_Disabled:_

```tsx
import { Checkbox } from "@easypost/easy-ui/Checkbox";

function Component() {
  return <Checkbox isDisabled={true}>Checkbox item</Checkbox>;
}
```

_Read-only:_

```tsx
import { Checkbox } from "@easypost/easy-ui/Checkbox";

function Component() {
  return (
    <Checkbox isSelected={true} isReadOnly={true}>
      Checkbox item
    </Checkbox>
  );
}
```

_Form submission data:_

```tsx
import { Checkbox } from "@easypost/easy-ui/Checkbox";

function Component() {
  return (
    <Checkbox name="checkbox-name" value="checkbox-value">
      Checkbox item
    </Checkbox>
  );
}
```

_Error:_

```tsx
import { Checkbox } from "@easypost/easy-ui/Checkbox";

function Component() {
  return (
    <Checkbox validationState="invalid" errorText="This is required to proceed">
      Checkbox item
    </Checkbox>
  );
}
```

_Nesting:_

Nested checkboxes have a different style.

```tsx
import { Checkbox } from "@easypost/easy-ui/Checkbox";

function Component() {
  return (
    <div>
      <Checkbox>Checkbox item</Checkbox>
      <Checkbox>Checkbox item</Checkbox>
      <div>
        <Checkbox isNested>Checkbox item</Checkbox>
        <Checkbox isNested>Checkbox item</Checkbox>
      </div>
    </div>
  );
}
```

### Anatomy

The `Checkbox` component will render a visually hidden `input` and defer styling to custom elements. The component will be wrapped in a `label`.

```tsx
function Checkbox() {
  return (
    <label>
      <VisuallyHidden>
        <input {...inputProps} />
      </VisuallyHidden>
      <span>
        <CheckboxIcon />
        <CheckboxLabel />
        {validationState === "invalid" && (
          <Tooltip content={errorText}>
            <ErrorIcon />
          </Tooltip>
        )}
      </span>
    </label>
  );
}
```

---

## Behavior

### Accessibility

- A checkbox should have a visible label that is in close proximity to the control.

- When displaying additional content based on checking a checkbox, new content should appear after the checkbox so that it is naturally discoverable by assistive technology users.

### Dependencies

- React Aria's `useCheckbox`, `useFocusRing`, `VisuallyHidden`, `useToggleState`, and `ValidationState`
