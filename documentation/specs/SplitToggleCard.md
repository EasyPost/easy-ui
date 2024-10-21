# `SplitToggleCard` Component Specification

## Overview

A `SplitToggleCard` component is an interactive binary control with status and related content.

### Use Cases

- Use a `SplitToggleCard` when an "on/off" or "yes/no" input is needed with related content.

### Features

- Can be controlled or uncontrolled
- Supports disabled state
- Supports readonly state
- Supports default selected

## Design

A `SplitToggleCard` is a component built on top of the `Toggle` component with additional related content of the input. It does not require the use of any React Aria primitives.

### API

```ts
export type SplitToggleCardProps = ToggleProps & {
  /**
   * Card children
   */
  children: ReactNode;
};
```

### Example Usage

```tsx
import { SplitToggleCard } from "@easypost/easy-ui/SplitToggleCard";
import { Text } from "@easypost/easy-ui/Text";

function Component() {
  const id = useId();
  return (
    <SplitToggleCard aria-labelledby={id}>
      <Text id={id}>Toggle Label</Text>
    </SplitToggleCard>
  );
}
```

_Default value:_

```tsx
import { SplitToggleCard } from "@easypost/easy-ui/SplitToggleCard";
import { Text } from "@easypost/easy-ui/Text";

function Component() {
  return (
    <SplitToggleCard defaultSelected={true}>
      <Text>Toggle Label</Text>
    </SplitToggleCard>
  );
}
```

_Controlled:_

```tsx
import { SplitToggleCard } from "@easypost/easy-ui/SplitToggleCard";
import { Text } from "@easypost/easy-ui/Text";

function Component() {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <SplitToggleCard
      isSelected={isSelected}
      onChange={(isSelected) => setIsSelected(isSelected)}
    >
      <Text>Toggle Label</Text>
    </SplitToggleCard>
  );
}
```

_Disabled:_

```tsx
import { SplitToggleCard } from "@easypost/easy-ui/SplitToggleCard";
import { Text } from "@easypost/easy-ui/Text";

function Component() {
  return (
    <SplitToggleCard isDisabled={true}>
      <Text>Toggle Label</Text>
    </SplitToggleCard>
  );
}
```

_Read-only:_

```tsx
import { SplitToggleCard } from "@easypost/easy-ui/SplitToggleCard";
import { Text } from "@easypost/easy-ui/Text";

function Component() {
  return (
    <SplitToggleCard isSelected={true} isReadOnly={true}>
      <Text>Toggle Label</Text>
    </SplitToggleCard>
  );
}
```

### Anatomy

```tsx
import { Toggle } from "../Toggle";
import { Card } from "../Card";
import { HorizontalGrid } from "../HorizontalGrid";

export function SplitToggleCard(props: SplitToggleCardProps) {
  const { children, ...toggleProps } = props;

  return (
    <Card.Container>
      <HorizontalGrid>
        <Card.Area>
          <Toggle {...toggleProps} />
        </Card.Area>
        <Card.Area>{children}</Card.Area>
      </HorizontalGrid>
    </Card.Container>
  );
}
```

---

## Behavior

### Accessibility

There are no major accessibility concerns to highlight for this component

### Dependencies

There are no major dependencies to highlight for this component
