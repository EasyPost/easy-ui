# `DisplayTable` Component Specification

## Overview

A `DisplayTable` is used for presenting information displayed across columns and rows.

---

## Design

`DisplayTable` is for presentational concerns only. It doesn't support interaction such as selection, sorting, and row expansion. For an interactive table accommodating advanced use cases, see `Table`.

Without interaction, complexities are shifted to surfacing a simple component API, structuring the table for style requirements, and ensuring appropriate application of accessibility markup.

`DisplayTable` will use React Aria's `useTable` under the hood to reliably generate accessibility markup for the table.

### API

```ts
type DisplayTableProps = AriaLabelingProps & {
  /** Columns for the table. */
  columns: Column[];

  /**
   * Horizontal alignment of data within their cells.
   * @default start
   */
  dataAlignment?: "start" | "center" | "end";

  /** Renders the first row cell as a row header. */
  hasRowHeaders?: boolean;

  /** Rows for the table. */
  rows: Row[];
};

type Row = Cell[];

type Cell =
  | ReactNode
  | {
      /** Cell text. */
      text?: ReactNode;

      /** Cell icon. */
      symbol?: IconSymbol;

      /** Mark cell as highlighted. */
      isHighlighted?: boolean;
    };

type Column =
  | ReactNode
  | {
      /** Column heading. */
      heading?: ReactNode;

      /** Column subheading. */
      subheading?: ReactNode;

      /** Column heading icon or image. */
      media?: ImgMedia | IconMedia;
    };

type IconMedia = {
  symbol: IconSymbol;
};

type ImgMedia = {
  src: string;
  alt: string;
};
```

### Example Usage

_Basic usage_:

```tsx
import { DisplayTable } from "@easypost/easy-ui/DisplayTable";

function CustomDisplayTable() {
  return (
    <DisplayTable
      aria-label="Example basic display table"
      columns={[
        "Weight",
        "Priority",
        "ParcelSelect",
        "First",
        "Express",
        "LibraryMail",
        "MediaMail",
      ]}
      rows={[
        ["1 oz.", "$7.64", "$6.99", "$3.59", "$24.90", "$3.47", "$3.65"],
        ["2 oz.", "$7.64", "$6.99", "$3.59", "$24.90", "$3.47", "$3.65"],
        ["3 oz.", "$7.64", "$6.99", "$3.59", "$24.90", "$3.47", "$3.65"],
        ["4 oz.", "$7.64", "$6.99", "$3.99", "$24.90", "$3.47", "$3.65"],
        ["5 oz.", "$7.64", "$6.99", "$3.99", "$24.90", "$3.47", "$3.65"],
      ]}
    />
  );
}
```

_Advanced usage_:

```tsx
import { DisplayTable } from "@easypost/easy-ui/DisplayTable";

function CustomDisplayTable() {
  return (
    <DisplayTable
      aria-label="Example advanced display table"
      hasRowHeaders
      columns={[
        null,
        {
          heading: "Uptime",
          subheading: "(Peak 2020)",
          media: { symbol: IconSymbol },
        },
        {
          heading: "Outage events",
          subheading: "(Peak 2020)",
          media: { symbol: IconSymbol },
        },
        {
          heading: "Uptime",
          subheading: "(2021)",
          media: { symbol: IconSymbol },
        },
        {
          heading: "Outage events",
          subheading: "(2021)",
          media: { symbol: IconSymbol },
        },
        {
          heading: "Uptime",
          subheading: "(Q2 2021)",
          media: { symbol: IconSymbol },
        },
        {
          heading: "Outage events ",
          subheading: "(Q2 2021)",
          media: { symbol: IconSymbol },
        },
      ]}
      rows={[
        [
          "Website",
          { symbol: CheckIconSymbol },
          "",
          { symbol: CheckIconSymbol },
          "",
          { symbol: CheckIconSymbol },
          "",
        ],
        [
          "Shipping API",
          {
            text: "*US Exports Only",
            symbol: CheckIconSymbol,
            isHighlighted: true,
          },
          { symbol: CheckIconSymbol },
          "",
          { symbol: CheckIconSymbol },
          "",
          "",
        ],
        [
          "Tracking API",
          { symbol: CheckIconSymbol },
          "",
          { text: "*US Exports Only", symbol: CheckIconSymbol },
          "",
          "",
          { symbol: CheckIconSymbol },
        ],
        [
          "Address Verification API",
          { symbol: CheckIconSymbol, isHighlighted: true },
          { symbol: CheckIconSymbol },
          "",
          "",
          "",
          { symbol: CheckIconSymbol },
        ],
        [
          "Events Webhooks",
          { symbol: CheckIconSymbol },
          "",
          { symbol: CheckIconSymbol },
          { symbol: CheckIconSymbol },
          {
            text: "*US Exports Only",
            symbol: CheckIconSymbol,
            isHighlighted: true,
          },
          { symbol: CheckIconSymbol },
        ],
      ]}
    />
  );
}
```

---

## Behavior

### Accessibility

Tables are used to organize data with a logical relationship in grids. Accessible tables need HTML markup that indicates header cells and data cells and defines their relationship. Assistive technologies use this information to provide context to users.

- Tables must have a thead, containing a th for each column.
- Tables must have a tbody wrapping the table body of rows.
- Tables should include row headers as the first cell in a row.
- `DisplayTable` should contain static textual and numeric data rather than actionable components. For more advanced cases, see `Table`.

Most accessibility concerns will be handled through React Aria.

## Dependencies

- `react-aria`—`useTable`
- `@easypost/easy-ui`—`useIntersectionDetection` for the stuck styles
