# `CheckableCard` Component Specification

## Overview

A `CheckableCard` is a styled container with a `Checkbox` form element.

### Use Cases

- Use a CheckableCard to display a checkbox for users inside a styled container

### Features

- Supports use of `Checkbox` form element within a `Card` container
- Supports existing features of `Card` component
- Supports existing features of `Checkbox` component

### Prior Art

### Design

Design of `CheckableCard` is comprised of the `Checkbox` component wrapped by the `Card` container component.

### API

```ts
export type CheckableCardProps = CheckboxProps & {
  /**
   * Card children
   */
  children: ReactNode;
};
```

### Example Usage

```tsx
import { CheckableCard } from "@easypost/easy-ui/CheckableCard";

function Component() {
  return <CheckableCard>Checkbox item</CheckableCard>;
}
```

_Default value:_

```tsx
import { CheckableCard } from "@easypost/easy-ui/CheckableCard";

function Component() {
  return <CheckableCard defaultSelected={true}>Checkbox item</CheckableCard>;
}
```

_Controlled:_

```tsx
import { CheckableCard } from "@easypost/easy-ui/CheckableCard";

function Component() {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <CheckableCard
      isSelected={isSelected}
      onChange={(isSelected) => setIsSelected(isSelected)}
    >
      Checkbox item
    </CheckableCard>
  );
}
```

_Disabled:_

```tsx
import { CheckableCard } from "@easypost/easy-ui/CheckableCard";

function Component() {
  return <CheckableCard isDisabled={true}>Checkbox item</CheckableCard>;
}
```

_Read-only:_

```tsx
import { CheckableCard } from "@easypost/easy-ui/CheckableCard";

function Component() {
  return (
    <CheckableCard isSelected={true} isReadOnly={true}>
      Checkbox item
    </CheckableCard>
  );
}
```

_Form submission data:_

```tsx
import { CheckableCard } from "@easypost/easy-ui/CheckableCard";

function Component() {
  return (
    <CheckableCard name="checkable-card-name" value="checkable-card-value">
      Checkbox item
    </CheckableCard>
  );
}
```

_Error:_

```tsx
import { CheckableCard } from "@easypost/easy-ui/CheckableCard";

function Component() {
  return (
    <CheckableCard
      validationState="invalid"
      errorText="This is required to proceed"
    >
      Checkbox item
    </CheckableCard>
  );
}
```

## Behavior

### Accessibility

### Dependencies

- React Aria's `useCheckbox`, `useFocusRing`, `VisuallyHidden`, `useToggleState`, and `ValidationState`
