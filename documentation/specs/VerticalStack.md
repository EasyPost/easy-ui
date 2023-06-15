# `VerticalStack` Component Specification

## Overview

A VerticalStack displays children vertically based on CSS flexbox.

### Features

- Vertical alignment
- Horizontal alignment
- Reverse element order
- Custom gap based on Easy UI scale

### Prior Art

- [Polaris `<VerticalStack />`](https://polaris.shopify.com/components/layout-and-structure/vertical-stack)

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
type InlineAlign = "start" | "center" | "end" | "baseline" | "stretch";
type Element = "div" | "ul" | "ol" | "fieldset";

type VerticalStackProps = {
  /**
   * HTML Element type
   * @default 'div'
   */
  as?: Element;

  /** Vertical alignment of children */
  align?: Align;

  /** Contents of the vertical stack. */
  children: ReactNode;

  /** The spacing between children */
  gap?: ResponsiveSpaceScale;

  /** Whether or not the vertical stack uses inline-flex instead of flex. */
  inline?: boolean;

  /** Horizontal alignment of children */
  inlineAlign?: InlineAlign;

  /**
   * Reverse the render order of child items
   * @default false
   */
  reverseOrder?: boolean;
};
```

### Example Usage

```tsx
import { VerticalStack } from "@easypost/easy-ui/VerticalStack";

function Component() {
  return (
    <VerticalStack gap="2">
      <div />
      <div />
    </VerticalStack>
  );
}
```

---

## Behavior

### Accessibility

- No accessibility concerns.

### Dependencies

- No external dependencies.
