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

- Ensuring the component can be composed to the variety of use cases while maintaining a simple API

### Prior Art

- [Polaris `<AlphaCard />`](https://polaris.shopify.com/components/layout-and-structure/alpha-card)
- [Paste `<Card />`](https://paste.twilio.design/components/card)

---

## Design

A `Card` is semantically straightforward. Essentially serving as a container with preset styles. The complexity is surfacing a sufficiently advanced API that can accommodate the use cases without becoming overburdened.

Architecture proposed is to surface a basic `<Card />` component with `variety` and `background` props while exposing the deconstructed parts to allow for maximum composability for complex use cases. The underlying pieces will be the `<Card.Container />` which houses the `variant` prop for determining the overall style of the card, and then a `<Card.Area />` which contains the inner container properties such as padding and the `background`.

### API

```ts
type CardBackground = "primary" | "secondary";
type CardVariant = "solid" | "outlined" | "flagged";
type CardStatus = "danger" | "warning" | "success";
type CardPadding = ResponsiveProp<SpaceScale>;

type CardContainerProps = {
  /** Custom element for the card container. */
  as?: ElementType;

  /** Content of the card. */
  children: ReactNode;

  /** Render the card as disabled. Only relevant for outlined cards. */
  isDisabled?: boolean;

  /** Render the card as selected. Only relevant for outlined cards. */
  isSelected?: boolean;

  /**
   * Card status. Only relevant for flagged cards.
   */
  status?: CardStatus;

  /**
   * Card variant.
   * @default outlined
   */
  variant?: CardVariant;

  /**
   * Card shadow.
   */
  boxShadow?: ShadowLevel;

  /**
   * Card border radius.
   */
  borderRadius?: BorderRadius;
} & AllHTMLAttributes<ElementType>;

type CardAreaProps = {
  /** Background of the card area. By default, card backgrounds are transparent. */
  background?: CardBackground;

  /** Content of the card area. */
  children: ReactNode;

  /**
   * The spacing around the content area. Accepts a spacing token or an object of spacing tokens for different screen sizes.
   *
   * @example
   * padding='2'
   * padding={{ xs: '2', sm: '3', md: '4', lg: '5', xl: '6' }}
   */
  padding?: CardPadding;

  /**
   * The horizontal spacing around the content area. Accepts a spacing token or an object of spacing tokens for different screen sizes.
   *
   * @example
   * paddingX='2'
   * paddingX={{ xs: '2', sm: '3', md: '4', lg: '5', xl: '6' }}
   */
  paddingX?: CardPadding;

  /**
   * The vertical spacing around the content area. Accepts a spacing token or an object of spacing tokens for different screen sizes.
   *
   * @example
   * paddingY='2'
   * paddingY={{ xs: '2', sm: '3', md: '4', lg: '5', xl: '6' }}
   */
  paddingY?: CardPadding;
};

type CardProps = CardContainerProps & CardAreaProps;
```

### Example Usage

_Outlined:_

```tsx
import { Card } from "@easypost/easy-ui/Card";

function Component() {
  return <Card>Content</Card>;
}

// same as:
function Component() {
  return <Card variant="outlined">Content</Card>;
}
```

_Solid:_

```tsx
import { Card } from "@easypost/easy-ui/Card";

function Component() {
  return <Card variant="solid">Content</Card>;
}
```

_Flagged:_

```tsx
import { Card } from "@easypost/easy-ui/Card";

function Component() {
  return (
    <Card variant="flagged" status="danger">
      Content
    </Card>
  );
}
```

_Background:_

By default cards are transparent.

```tsx
import { Card } from "@easypost/easy-ui/Card";

function Component() {
  return <Card background="primary">Content</Card>;
}
```

_Complex Card:_

Card split into two columns using `HorizontalGrid` and deconstructed Card pieces:

```tsx
import { Card } from "@easypost/easy-ui/Card";

function Component() {
  return (
    <Card.Container variant="outlined">
      <HorizontalGrid columns={2}>
        <Card.Area background="primary">Content</Card.Area>
        <Card.Area background="secondary">Content</Card.Area>
      </HorizontalGrid>
    </Card.Container>
  );
}
```

_Checkbox Card:_

Example of piecing together card components for a checkbox variation.

```tsx
import { Card } from "@easypost/easy-ui/Card";

function CheckboxCard() {
  const [isSelected] = useState();
  const [isDisabled] = useState();
  return (
    <Card
      as="label"
      isSelected={isSelected}
      isDisabled={isDisabled}
      variant="outlined"
    >
      <VerticalStack gap="2">
        <HorizontalStack gap="1" blockAlign="center">
          <input
            type="checkbox"
            style={{ width: 24, height: 24 }}
            checked={isSelected}
            disabled={isDisabled}
          />
          <Text variant="subtitle1">Here is a checkbox description</Text>
        </HorizontalStack>
        <div>Content</div>
      </VerticalStack>
    </Card>
  );
}
```

### Anatomy

The high-level anatomy shows how the pieces are deconstructed.

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
