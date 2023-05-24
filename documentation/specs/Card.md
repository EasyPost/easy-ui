# `Card` Component Specification

## Overview

A Card is a styled container that groups related content.

### Use Cases

- Relating a concise amount of information together
- Ultimately very flexibile for a variety of use cases

### Features

- Multiple border style variants
- Background options
- Deconstructed parts for composable complex cards

### Risks and Challenges

- Simple API with a variety of use cases
- Ensuring the component can be composed to the variety of use cases

### Prior Art

- [Polaris `<AlphaCard />`](https://polaris.shopify.com/components/layout-and-structure/alpha-card)
- [Paste `<Card />`](https://paste.twilio.design/components/card)

---

## Design

A `Card` is semantically straightforward. Essentially serving as a container with preset styles. The complexity is surfacing a sufficiently advanced API that can accommodate the use cases without becoming overburdened.

Architecture proposed is to surface a basic `<Card />` component with `variety` and `background` props while exposing the deconstructed parts to allow for maximum composability for complex use cases. The underlying pieces will be the `<Card.Container />` which houses the `variant` prop for determining the overall style of the card, and then a `<Card.Area />` which contains the inner container properties such as padding and the `background`.

### API

```ts
type CardBackground = "primary" | "subdued";
type CardVariant = "solid" | "outlined" | "danger" | "warning" | "success";

type CardContainerProps = {
  /**
   * Card variant.
   * @default solid
   */
  variant?: CardVariant;

  /** Content of the card container. */
  children: ReactNode;
};

type CardAreaProps = {
  /** Background of the card area. By default, card backgrounds are transparent. */
  background?: CardBackground;

  /** Content of the card area. */
  children: ReactNode;
};

type CardProps = CardContainerProps & CardAreaProps;
```

### Example Usage

_Solid:_

```tsx
import { Card } from "@easypost/easy-ui/Card";

function Component() {
  return <Card>Content</Card>;
}

// same as:
function Component() {
  return <Card variant="solid">Content</Card>;
}
```

_Outlined:_

```tsx
import { Card } from "@easypost/easy-ui/Card";

function Component() {
  return <Card variant="outlined">Content</Card>;
}
```

_Flagged:_

```tsx
import { Card } from "@easypost/easy-ui/Card";

function Component() {
  // can be either "danger", "warning", "success"
  return <Card variant="danger">Content</Card>;
}
```

_Primary background:_

```tsx
import { Card } from "@easypost/easy-ui/Card";

function Component() {
  return <Card background="primary">Content</Card>;
}
```

_Subdued background:_

```tsx
import { Card } from "@easypost/easy-ui/Card";

function Component() {
  return <Card background="subdued">Content</Card>;
}
```

_Complex Card:_

Card split into two columns using `HorizontalGrid` and deconstructed Card pieces:

```tsx
import { Card } from "@easypost/easy-ui/Card";

function Component() {
  return (
    <Card.Container {...args}>
      <HorizontalGrid columns={2}>
        <Card.Area background="primary">Content</Card.Area>
        <Card.Area background="subdued">Content</Card.Area>
      </HorizontalGrid>
    </Card.Container>
  );
}
```

### Anatomy

The anatomy shows how the pieces can be constructed and deconstructed for complex use cases.

```ts
function CardContainer({ variant = "solid", children }: CardContainerProps) {
  const className = classNames(
    styles.container,
    styles[variationName("variant", variant)],
  );
  return <div className={className}>{children}</div>;
}

function CardArea({ background, children }: CardAreaProps) {
  const style = {
    ...getComponentThemeToken(
      "card-area",
      "background",
      "color.surface.card",
      background,
    ),
  } as React.CSSProperties;
  return (
    <div className={styles.area} style={style}>
      {children}
    </div>
  );
}

export function Card(props: CardProps) {
  const { background, children, variant } = props;
  return (
    <CardContainer variant={variant}>
      <CardArea background={background}>{children}</CardArea>
    </CardContainer>
  );
}

Card.Container = CardContainer;
Card.Area = CardArea;
```

---

## Behavior

### Accessibility

Cards have no special accessibility concerns.

### Dependencies

- Will likely need to extend our theme tokens with the variants proposed.
- Will require two layout primitives (`HorizontalGrid` and `VerticalStack`) to be built to support complex use cases. These can essentially be ported over from Shopify's Polaris system, which seem to be designed well.
