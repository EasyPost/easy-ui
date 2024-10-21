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
export type SplitToggleCardProps = {
  /**
   * The label for the toggle.
   */
  children: string;
  /**
   * The related content for the toggle.
   */
  description?: string;
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
   * Handler that is called when the toggle's selection state changes.
   */
  onChange?: (isSelected: boolean) => void;
};
```

### Example Usage

```tsx
import { SplitToggleCard } from "@easypost/easy-ui/SplitToggleCard";

function Component() {
  return <SplitToggleCard description="foobar">Toggle Label</SplitToggleCard>;
}
```

_Default value:_

```tsx
import { SplitToggleCard } from "@easypost/easy-ui/SplitToggleCard";

function Component() {
  return <SplitToggleCard defaultSelected={true}>Toggle Label</SplitToggleCard>;
}
```

_Controlled:_

```tsx
import { SplitToggleCard } from "@easypost/easy-ui/SplitToggleCard";

function Component() {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <SplitToggleCard
      isSelected={isSelected}
      onChange={(isSelected) => setIsSelected(isSelected)}
    >
      Toggle Label
    </SplitToggleCard>
  );
}
```

_Disabled:_

```tsx
import { SplitToggleCard } from "@easypost/easy-ui/SplitToggleCard";

function Component() {
  return <SplitToggleCard isDisabled={true}>Toggle Label</SplitToggleCard>;
}
```

_Read-only:_

```tsx
import { SplitToggleCard } from "@easypost/easy-ui/SplitToggleCard";

function Component() {
  return (
    <SplitToggleCard isSelected={true} isReadOnly={true}>
      Toggle Label
    </SplitToggleCard>
  );
}
```

### Anatomy

```tsx
import { Toggle } from "../Toggle";
import { Text } from "../Text";
import { Card } from "../Card";
import { VerticalStack } from "../VerticalStack";
import { HorizontalGrid } from "../HorizontalGrid";

export function SplitToggleCard(props: SplitToggleCardProps) {
  const {
    children,
    description,
    defaultSelected,
    isDisabled,
    isReadOnly,
    isSelected,
    onChange,
  } = props;

  const status = isSelected || defaultSelected ? "Enabled" : "Disabled";

  return (
    <Card.Container>
      <HorizontalGrid>
        <Card.Area>
          <Toggle
            name={children}
            defaultSelected={defaultSelected}
            isSelected={isSelected}
            isReadOnly={isReadOnly}
            isDisabled={isDisabled}
            onChange={onChange}
          />
        </Card.Area>
        <Card.Area>
          <VerticalStack>
            <Text>{children}</Text>
            <Text>
              {status}
              {description && `: ${description}`}
            </Text>
          </VerticalStack>
        </Card.Area>
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
