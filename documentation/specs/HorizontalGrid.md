# `HorizontalGrid` Component Specification

## Overview

A HorizontalGrid displays children on a horizontal grid based on CSS grid.

### Features

- Vertical alignment
- Sophisticated columns support
- Custom gap based on Easy UI scale

### Prior Art

- [Polaris `<HorizontalGrid />`](https://polaris.shopify.com/components/layout-and-structure/horizontal-grid)

---

## Design

### API

```ts
type ColumnsAlias =
  | "oneFourth"
  | "oneThird"
  | "oneHalf"
  | "twoThirds"
  | "threeFourths";
type ColumnsType = number | string | (string | ColumnsAlias)[];
type Columns = ResponsiveProp<ColumnsType>;
type HorizontalGridAlignItems = "start" | "end" | "center";

type HorizontalGridProps = {
  /**
   * Vertical alignment of children. If not set, inline elements will stretch to the height of the parent.
   */
  alignItems?: HorizontalGridAlignItems;

  /**
   * HTML element type.
   * @default div
   */
  as?: ElementType;

  /** Content of the horizontal grid. */
  children: ReactNode;

  /**
   * The number of columns to display. Accepts either a single value, an array of column values, or an object of values for different screen sizes.
   * @example
   * columns={6}
   * columns={{xs: 1, sm: 1, md: 3, lg: 6, xl: 6}}
   */
  columns: Columns;

  /**
   * The spacing between children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
   * @example
   * gap='2'
   * gap={{xs: '1', sm: '2', md: '3', lg: '4', xl: '5'}}
   */
  gap?: ResponsiveSpaceScale;

  /** Whether or not the horizontal grid uses inline-grid instead of grid. */
  inline?: boolean;
};
```

### Example Usage

```tsx
import { HorizontalGrid } from "@easypost/easy-ui/HorizontalGrid";

function Component() {
  return (
    <HorizontalGrid columns={2} gap="2">
      <div />
      <div />
    </HorizontalGrid>
  );
}
```

---

## Behavior

### Accessibility

- No accessibility concerns.

### Dependencies

- No external dependencies.
