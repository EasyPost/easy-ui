# `EmptyStateCard` Component Specification

## Overview

An `EmptyStateCard` is a styled container with a header, body, and action sections, designed to display relevant information when there is no nearby data to display.

### Use Cases

- Use to draw attention to encourage interaction when there is no nearby data to display

### Features

- Header, body, and action components are broken into composable pieces

## Design

An `EmptyStateCard` is a very simple compound component consisting of`EmptyStateCard.Header`, `EmptyStateCard.HeaderText`, `EmptyStateCard.Body`, `EmptyStateCard.BodyText`, and `EmptyStateCard.Action`.

The `EmptyStateCard` will render `EmptyStateCard.Header`,` EmptyStateCard.Body`, and`EmptyStateCard.Action` via children, while delegating the styled container to the `Card` component.

`EmptyStateCard.Header` will render `EmptyStateCard.HeaderText` and `EmptyStateCard.Body` will render `EmptyStateCard.BodyText`; both text components will handle the styles to avoid the consumer having to pass them in explicitly.

The `EmptyStateCard.HeaderText`,` EmptyStateCard.BodyText`, and`EmptyStateCard.Action` components will be lightweight wrappers to handle the rendering for the content passed by consumers.

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
   * `<EmptyStateCard.Action>` at minimum.
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
     <EmptyStateCard.HeaderText>
       Shipment Insurance
     </EmptyStateCard.HeaderText>
   </EmptyStateCard.Header>
   <EmptyStateCard.Body>
     <EmptyStateCard.BodyText>
       Rest easy knowing if one of your customers orders is damaged, lost
       in transit or stolen you are covered! Automatically add insurance to
       all your shipments
     </EmptyStateCard.BodyText>
   </EmptyStateCard.Body>
   <EmptyStateCard.Action>
     <Button>Manage Insurance Settings</Button>
   </EmptyStateCard.Action>
  </EmptyStateCard>,
  );
}
```

_Center inline-align:_

```tsx
import { EmptyStateCard } from "@easypost/easy-ui/EmptyStateCard";
import { Text } from "@easypost/easy-ui/Text";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  return (
  <EmptyStateCard inlineAlign="center">
   <EmptyStateCard.Header>
    <EmptyStateCard.HeaderText>
       Shipment Insurance
     </EmptyStateCard.HeaderText>
   </EmptyStateCard.Header>
   <EmptyStateCard.Body>
     <EmptyStateCard.BodyText>
       Rest easy knowing if one of your customers orders is damaged, lost
       in transit or stolen you are covered! Automatically add insurance to
       all your shipments
     </EmptyStateCard.BodyText>
   </EmptyStateCard.Body>
   <EmptyStateCard.Action>
     <Button>Manage Insurance Settings</Button>
   </EmptyStateCard.Action>
  </EmptyStateCard>,
  );
}
```

### Anatomy

```tsx
import { Card } from "../Card";
import { Text, TextProps } from "../Text";
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

function EmptyStateCardHeaderText(props: TextProps) {
  const { ...textProps } = props;

  return <Text {...textProps} />;
}

function EmptyStateCardBody(props: EmptyStateCardBodyProps) {
  const { children } = props;

  return <div>{children}</div>;
}

function EmptyStateCardBodyText(props: TextProps) {
  const { ..textProps } = props;

  return <Text {...restTextProps} />;
}

function EmptyStateCardAction(props: EmptyStateCardActionProps) {
  const { children } = props;

  return <div>{children}</div>;
}

EmptyStateCard.Header = EmptyStateCardHeader;

EmptyStateCard.HeaderText = EmptyStateCardHeaderText;

EmptyStateCard.Body = EmptyStateCardBody;

EmptyStateCard.BodyText = EmptyStateCardBodyText;

EmptyStateCard.Action = EmptyStateCardAction;
```

---

## Behavior

### Accessibility

There are no major accessibility concerns to highlight for this component

### Dependencies

- `Card`
- `VerticalStack`
- `Text`
