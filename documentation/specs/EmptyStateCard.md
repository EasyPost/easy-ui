# `EmptyStateCard` Component Specification

## Overview

An `EmptyStateCard` is a styled container designed to display relevant information when there is no nearby data to display.

### Use Cases

- Use to draw attention to encourage interaction when there is no nearby data to display

### Features

- Components are broken into composable pieces

## Design

An `EmptyStateCard` is a compound component consisting of `EmptyStateCard.MultiSection`, `EmptyStateCard.Section`, `EmptyStateCard.TextGroup`, `EmptyStateCard.HeaderText`, `EmptyStateCard.BodyText`, and `EmptyStateCard.ActionGroup`. The styled container will be handled by the `Card` component.

A `EmptyStateCard.Section` is a simple container that can render `EmptyStateCard.TextGroup`, `EmptyStateCard.HeaderText`, `EmptyStateCard.BodyText`, and `EmptyStateCard.ActionGroup`. It can also support custom markup. To handle multiple `EmptyStateCard.Section` components, consumers should use `EmptyStateCard.MultiSection`.

The `EmptyStateCard.HeaderText` and` EmptyStateCard.BodyText` components will be lightweight wrappers around the `Text` component.

No new external dependencies will be introduced.

### API

```ts
export type EmptyStateCardProps = {
  /**
   * The children of the <EmptyStateCard> element.
   */
  children: ReactNode;
};

export type EmptyStateCardSectionProps = VerticalStackProps & {
  /**
   * Renders a section with a decorative background.
   * @default false
   */
  hasDecorativeBackground?: boolean;
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
      <EmptyStateCard.Section>
        <EmptyStateCard.TextGroup>
          <EmptyStateCard.HeaderText>
            Shipment Insurance
          </EmptyStateCard.HeaderText>
          <EmptyStateCard.BodyText>
            Rest easy knowing if one of your customers orders is damaged, lost
            in transit or stolen you are covered! Automatically add insurance to
            all your shipments
          </EmptyStateCard.BodyText>
        </EmptyStateCard.TextGroup>
        <EmptyStateCard.ActionGroup>
          <Button>Manage Insurance Settings</Button>
        </EmptyStateCard.ActionGroup>
      </EmptyStateCard.Section>
    </EmptyStateCard>
  );
}
```

_Alignment:_

```tsx
import { EmptyStateCard } from "@easypost/easy-ui/EmptyStateCard";
import { Text } from "@easypost/easy-ui/Text";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  return (
    <EmptyStateCard>
      <EmptyStateCard.Section inlineAlign="center">
        <EmptyStateCard.TextGroup gap="2">
          <EmptyStateCard.HeaderText>
            Shipment Insurance
          </EmptyStateCard.HeaderText>
          <EmptyStateCard.BodyText>
            Rest easy knowing if one of your customers orders is damaged, lost
            in transit or stolen you are covered! Automatically add insurance to
            all your shipments
          </EmptyStateCard.BodyText>
        </EmptyStateCard.TextGroup>
        <EmptyStateCard.ActionGroup>
          <Button>Manage Insurance Settings</Button>
        </EmptyStateCard.ActionGroup>
      </EmptyStateCard.Section>
    </EmptyStateCard>
  );
}
```

### Anatomy

```tsx
import { Card } from "../Card";
import { Text, TextProps } from "../Text";
import { HorizontalStack, HorizontalStackProps } from "../HorizontalStack";
import { VerticalStack, VerticalStackProps } from "../VerticalStack";

export function EmptyStateCard(props: EmptyStateCardProps) {
  const { children } = props;

  return <Card>{children}</Card>;
}

function EmptyStateCardMultiSection(props: HorizontalStackProps) {
  const { children, ...restProps } = props;
  return <HorizontalStack {...restProps}>{children}</HorizontalStack>;
}

function EmptyStateCardSection(props: EmptyStateCardSectionProps) {
  const { hasDecorativeBackground = false, children, ...restProps } = props;

  return (
    <div>
      {!hasDecorativeBackground ? (
        <Card.Area>
          <VerticalStack {...restProps}>{children}</VerticalStack>
        </Card.Area>
      ) : (
        <Card.Area>
          <div>
            <div>
              <VerticalStack {...restProps}>{children}</VerticalStack>
            </div>
          </div>
        </Card.Area>
      )}
    </div>
  );
}

function EmptyStateCardTextGroup(props: VerticalStackProps) {
  const { children, ...restProps } = props;
  return <VerticalStack {...restProps}>{children}</VerticalStack>;
}

function EmptyStateCardActionGroup(props: HorizontalStackProps) {
  const { children, ...restProps } = props;
  return <HorizontalStack {...restProps}>{children}</HorizontalStack>;
}

function EmptyStateCardHeaderText(props: TextProps) {
  const { ...restTextProps } = props;

  return <Text {...restTextProps} />;
}

function EmptyStateCardBodyText(props: TextProps) {
  const { ...restTextProps } = props;

  return <Text {...restTextProps} />;
}

EmptyStateCard.MultiSection = EmptyStateCardMultiSection;

EmptyStateCard.Section = EmptyStateCardSection;

EmptyStateCard.TextGroup = EmptyStateCardTextGroup;

EmptyStateCard.HeaderText = EmptyStateCardHeaderText;

EmptyStateCard.BodyText = EmptyStateCardBodyText;

EmptyStateCard.ActionGroup = EmptyStateCardActionGroup;

---

## Behavior

### Accessibility

There are no major accessibility concerns to highlight for this component

### Dependencies

- `Card`
- `VerticalStack`
- `HorizontalStack`
- `Text`
```
