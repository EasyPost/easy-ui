# `HorizontalStack` Component Specification

## Overview

A HorizontalStack displays children horizontally based on CSS Flexbox.

### Features

- Vertical alignment
- Horizontal alignment
- Wrapping
- Custom gap based on Easy UI scale

### Prior Art

- [Polaris `<HorizontalStack />`](https://polaris.shopify.com/components/layout-and-structure/horizontal-stack)

---

## Design

### API

```ts
type Align =
  | "start"
  | "center"
  | "end"
  | "space-around"
  | "space-between"
  | "space-evenly";
type BlockAlign = "start" | "center" | "end" | "baseline" | "stretch";

type HorizontalStackProps = {
  /**
   * HTML element type.
   * @default div
   */
  as?: ElementType;

  /** Horizontal alignment of children */
  align?: Align;

  /** Vertical alignment of children */
  blockAlign?: BlockAlign;

  /** Content of the horizontal stack. */
  children: ReactNode;

  /** Whether or not the horizontal stack uses inline-flex instead of flex. */
  inline?: boolean;

  /**
   * The spacing between elements. Accepts a spacing token or an object of spacing tokens for different screen sizes.
   * @example
   * gap='2'
   * gap={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
   */
  gap?: ResponsiveSpaceScale;

  /**
   * Wrap stack elements to additional rows as needed on small screens
   * @default true
   */
  wrap?: boolean;
};
```

### Example Usage

```tsx
import { HorizontalStack } from "@easypost/easy-ui/HorizontalStack";

function Component() {
  return (
    <HorizontalStack gap="2">
      <div />
      <div />
    </HorizontalStack>
  );
}
```

---

## Behavior

### Accessibility

- No accessibility concerns.

### Dependencies

- No external dependencies.
