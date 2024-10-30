# `EmptyStateCard` Component Specification

## Overview

An `EmptyStateCard` is a styled container with a header, body, and action sections, designed to display relevant information when there is no nearby data to display.

### Use Cases

- Use to draw attention to encourage interaction when there is no nearby data to display

### Features

- Header, body, and action components are broken into composable pieces

## Design

An `EmptyStateCard` is a very simple compound component consisting of`EmptyStateCard.Header`, `EmptyStateCard.Body`, and `EmptyStateCard.Action`.

The `EmptyStateCard` will render `EmptyStateCard.Header`,` EmptyStateCard.Body`, and`EmptyStateCard.Action` via children, while delegating the styled container to the `Card` component.

The `EmptyStateCard.Header`,` EmptyStateCard.Body`, and`EmptyStateCard.Action` components will only be lightweight wrappers to handle the rendering for the content passed by consumers.

No new external dependencies will be introduced.

### API

```ts
export type EmptyStateCardProps = Omit<
  VerticalStackProps,
  "children" | "as" | "reverseOrder"
> & {
  /**
   * The children of the <EmptyStateCard> element. Should render
   * `<EmptyStateCard.Header>`, `<EmptyStateCard.Body>`, and
   * `<EmptyStateCard.Action>`
   */
  children: ReactNode;
};

export type EmptyStateCardHeaderProps = {
  /**
   * Header content of card
   */
  children: ReactNode;
};

export type EmptyStateCardBodyProps = {
  /**
   * Body content of card
   */
  children: ReactNode;
};

export type EmptyStateCardActionProps = {
  /**
   * Action content of card
   */
  children: ReactNode;
};
```

### Example Usage

_Basic:_

```tsx
import { EmptyStateCard } from "@easypost/easy-ui/EmptyStateCard";
import { Text } from "@easypost/easy-ui/Text";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  return (
    <EmptyStateCard>
      <EmptyStateCard.Header>
        <Text variant="heading5" color="neutral.000">
          Analytics
        </Text>
      </EmptyStateCard.Header>
      <EmptyStateCard.Body>
        <Text variant="subtitle1" color="neutral.000">
          Start shipping to get insights on your shipping costs and performance.
        </Text>
      </EmptyStateCard.Body>
      <EmptyStateCard.Action>
        <Button>Buy a label</Button>
      </EmptyStateCard.Action>
    </EmptyStateCard>,
  );
}
```

_Center aligned:_

```tsx
import { EmptyStateCard } from "@easypost/easy-ui/EmptyStateCard";
import { Text } from "@easypost/easy-ui/Text";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  return (
    <EmptyStateCard inlineAlign="center">
      <EmptyStateCard.Header>
        <Text variant="heading5" color="neutral.000">
          Analytics
        </Text>
      </EmptyStateCard.Header>
      <EmptyStateCard.Body>
        <Text variant="subtitle1" color="neutral.000">
          Start shipping to get insights on your shipping costs and performance.
        </Text>
      </EmptyStateCard.Body>
      <EmptyStateCard.Action>
        <Button>Buy a label</Button>
      </EmptyStateCard.Action>
    </EmptyStateCard>,
  );
}
```

### Anatomy

```tsx
import { Card } from "../Card";
import { VerticalStack } from "../VerticalStack";

export function EmptyStateCard(props: EmptyStateCardProps) {
  const { children, ...verticalStackProps } = props;

  return (
    <Card>
      <VerticalStack {...verticalStackProps}>{children}</VerticalStack>
    </Card>
  );
}

function EmptyStateCardHeader(props: EmptyStateCardHeaderProps) {
  const { children } = props;

  return <div>{children}</div>;
}

function EmptyStateCardBody(props: EmptyStateCardBodyProps) {
  const { children } = props;

  return <div>{children}</div>;
}

function EmptyStateCardAction(props: EmptyStateCardActionProps) {
  const { children } = props;

  return <div>{children}</div>;
}

EmptyStateCard.Header = EmptyStateCardHeader;

EmptyStateCard.Body = EmptyStateCardBody;

EmptyStateCard.Action = EmptyStateCardAction;
```

---

## Behavior

### Accessibility

There are no major accessibility concerns to highlight for this component

### Dependencies

- `Card`
- `VerticalStack`
