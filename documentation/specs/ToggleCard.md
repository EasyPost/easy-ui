# `ToggleCard` Component Specification

## Overview

A `ToggleCard` is a styled container with an interactive header featuring a toggle control.

### Use Cases

- Use when displaying grouped and related content where an "on/off" or "yes/no" input is needed to signify activation.

### Features

- Header and body are broken into composable pieces

## Design

A `ToggleCard` is a simple compound component consisting of`ToggleCard.Header` and `ToggleCard.Body`. It is built on top of the existing `Toggle` and `Card` components.

The `ToggleCard.Header` will be responsible for rendering the `Toggle` as well as header content passed by the consumer. The `ToggleCard.Body` will be responsible for rendering the body content passed by the consumer.

No new external dependencies will be introduced.

### API

```ts
export type ToggleCardProps = {
  /**
   * The children of the <ToggleCard> element. Should render
   * `<ToggleCard.Header>` and `<ToggleCard.Body>`
   */
  children: ReactNode;
};

export type ToggleCardHeaderProps = {
  /**
   * Header content of card
   */
  children: ReactNode;
};

export type ToggleCardBodyProps = {
  /**
   * Body content of card
   */
  children: ReactNode;
};
```

### Example Usage

_Controlled:_

```tsx
import { ToggleCard } from "@easypost/easy-ui/ToggleCard";
import { Text } from "@easypost/easy-ui/Text";

function Component() {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <ToggleCard>
      <ToggleCard.Header>
        <Toggle
          aria-labelledby="some id"
          isSelected={isSelected}
          onChange={(isSelected) => setIsSelected(isSelected)}
        />
        <Text id="some id" variant="subtitle1" color="primary.900">
          header
        </Text>
      </ToggleCard.Header>
        <ToggleCard.Body>body</ToggleCard.Body>
    </ToggleCard>,
  );
}
```

_Disabled:_

```tsx
import { ToggleCard } from "@easypost/easy-ui/ToggleCard";
import { Text } from "@easypost/easy-ui/Text";

function Component() {
  return (
    <ToggleCard>
      <ToggleCard.Header>
        <Toggle aria-labelledby="some id" isDisabled />
        <Text id="some id" variant="subtitle1" color="primary.900">
          header
        </Text>
      </ToggleCard.Header>
      <ToggleCard.Body>body</ToggleCard.Body>
    </ToggleCard>
  );
}
```

_Read-only:_

```tsx
import { ToggleCard } from "@easypost/easy-ui/ToggleCard";
import { Text } from "@easypost/easy-ui/Text";

function Component() {
  return (
    <ToggleCard>
      <ToggleCard.Header>
        <Toggle aria-labelledby="some id" isReadOnly />
        <Text id="some id" variant="subtitle1" color="primary.900">
          header
        </Text>
      </ToggleCard.Header>
      <ToggleCard.Body>body</ToggleCard.Body>
    </ToggleCard>
  );
}
```

### Anatomy

```tsx
import { Toggle } from "../Toggle";
import { Card } from "../Card";
import { HorizontalStack } from "../HorizontalStack";

export function ToggleCard(props: ToggleCardProps) {
  const { children } = props;

  return <Card.Container>{children}</Card.Container>;
}

function ToggleCardHeader(props: ToggleCardHeaderProps) {
  const { children } = props;

  return (
    <Card.Area>
      <HorizontalStack>{children}</HorizontalStack>
    </Card.Area>
  );
}

function ToggleCardBody(props: ToggleCardBodyProps) {
  const { children } = props;

  return <Card.Area>{children}</Card.Area>;
}

ToggleCard.Header = ToggleCardHeader;

ToggleCard.Body = ToggleCardBody;
```

---

## Behavior

### Accessibility

- In general, a toggle should have a visual label that is close to the control. Since the element that renders next to the toggle control for this component may not be text, `aria-label` should be provided in those cases. For cases when text is provided, the text should have an `id`, and the value
  of that `id` should be provided to the `aria-labelledby` prop.

### Dependencies

- `Card`
- `Toggle`
