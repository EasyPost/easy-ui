# `SectionCard` Component Specification

## Overview

A SectionCard is a styled container for grouping section content on a page.

### Use Cases

- Relating section information together

### Features

- Provides affordance for heading and content
- Optionally supports tabs
- Deconstructed parts for composable complex cards

### Risks and Challenges

- Balancing constraint and portability

### Prior Art

Not directly but indirectly:

- [Polaris `<Card />`](https://polaris.shopify.com/components/layout-and-structure/card)
- [Paste `<Card />`](https://paste.twilio.design/components/card)

---

## Design

A `SectionCard` provides a lightweight extension to our `Card` component for building sections on a page.

Like Easy UI's standard `Card`, `SectionCard` is designed for composability. It can be deconstructed and reassembled as needed.

### API

```ts
// Extends Card component
export type SectionCardProps = CardProps;

// Extends Card.Container component
export type SectionCardContainerProps = CardContainerProps;

// Extends Card.Area component
export type SectionCardAreaProps = CardAreaProps;

export type SectionCardHeaderProps = {
  /** SectionCard header children. */
  children: ReactNode;
};

// Extends Text component
export type SectionCardTitleProps = TextProps;

export type SectionCardActionsProps = {
  /** SectionCard actions children. */
  children: ReactNode;
};

export type SectionCardControlsProps = {
  /** SectionCard controls children. */
  children: ReactNode;
};

export type SectionCardTabsProps = {
  /** SectionCard tabs children. */
  children: ReactNode;
};
```

### Example Usage

_Basic:_

```tsx
import { SectionCard } from "@easypost/easy-ui/SectionCard";

function Page() {
  return (
    <SectionCard>
      <SectionCard.Header>
        <SectionCard.Title>SectionTitle</SectionCard.Title>
      </SectionCard.Header>
      <div>Arbitray Content</div>
    </SectionCard>
  );
}
```

Renders (roughly) the following HTML with stack contraints backed in:

```html
<section>
  <h2>Section Title</h2>
  <div>Arbitray Content</div>
</section>
```

_Advanced/Tabs:_

```tsx
import { SectionCard } from "@easypost/easy-ui/SectionCard";

function Page() {
  return (
    <SectionCard.Container>
      <SectionCard.Tabs>
        <TabNav aria-label="Tabs">
          <TabNav.Item href="/tab1">Tab 1</TabNav.Item>
          <TabNav.Item href="/tab2">Tab 2</TabNav.Item>
        </TabNav>
      </SectionCard.Tabs>
      <SectionCard.Area>
        <SectionCard.Header>
          <SectionCard.Title>SectionTitle</SectionCard.Title>
          <SectionCard.Controls>
            <TextField size="sm" placeholder="Search" />
          </SectionCard.Controls>
          <SectionCard.Actions>
            <Button size="sm">Action</Button>
          </SectionCard.Actions>
        </SectionCard.Header>
        <div>Content</div>
      </SectionCard.Area>
    </SectionCard.Container>
  );
}
```

### Anatomy

The high-level anatomy shows how the pieces are deconstructed.

```tsx
// Basic SectionCard
function SectionCard(props: SectionCardProps) {
  const { background, children, padding, ...containerProps } = props;
  return (
    <SectionCardContainer {...containerProps}>
      <SectionCardArea background={background} padding={padding}>
        {children}
      </SectionCardArea>
    </SectionCardContainer>
  );
}

// Deconstructed custom SectionCard
function SectionCardContainer(props: SectionCardContainerProps) {
  const { children, ...cardContainerProps } = props;
  return (
    <Card.Container as="section" variant="shadow" {...cardContainerProps}>
      <VerticalStack>{children}</VerticalStack>
    </Card.Container>
  );
}

function SectionCardHeader(props: SectionCardHeaderProps) {
  return (
    <HorizontalStack blockAlign="center" align="space-between" gap="2">
      {props.children}
    </HorizontalStack>
  );
}

function SectionCardTitle(props: TextProps) {
  return <Text variant="heading5" as="h2" {...props} />;
}

function SectionCardArea(props: SectionCardAreaProps) {
  const { children, ...cardAreaProps } = props;
  return (
    <Card.Area {...cardAreaProps}>
      <VerticalStack gap="2">{children}</VerticalStack>
    </Card.Area>
  );
}

SectionCard.Container = SectionCardContainer;
SectionCard.Area = SectionCardArea;
SectionCard.Header = SectionCardHeader;
SectionCard.Title = SectionCardTitle;
SectionCard.Tabs = SectionCardTabs;
```

---

## Behavior

### Accessibility

- `SectionCard` will render as a `<section />` HTML element
- `SectionCard.Title` will be rendered as `h2` by default but can be overriden with the `as=""` prop

### Dependencies

- `Card`
