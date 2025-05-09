# `DataGrid` Component Specification

## Overview

A `DataGrid` is an interactive table used for working with a large collection of data in a scannable way.

---

## Design

`DataGrid` will use the `useTable` hooks from React Aria for managing display, selection, and sort. React Aria doesn't support expansion capabilities out of the box, so an additional layer on top of Aria's will need to be built to support expansion.

Data will be passed to the `DataGrid` component through the `columns` and `rows` prop. This allows us to support Aria's dynamic collections API through a single prop interface. Custom rendering within parts of the data grid will be supported through [render props](https://react.dev/reference/react/cloneElement#passing-data-with-a-render-prop).

`columns` and `rows` will be arrays of objects and must follow a certain signature. `columns` should define the column structure for the data grid and must contain a unique `key`. `rows` should contain the content of the data grid and must contain a unique `key` along with properties for each `key` defined in the `columns` definition. The remainder of the data structure can be arbitrary. Column and row keys will be passed to render prop functions to control their rendering.

_`columns` definition example_:

```tsx
const columns = [
  { key: "name", name: "Name" },
  { key: "type", name: "Type" },
  { key: "date", name: "Date Modified" },
] as const;
```

_`rows` definition example_:

```tsx
const rows = [
  { key: 1, name: "filename_1", type: "js", date: new Date(2023, 1, 1) },
  { key: 2, name: "filename_2", type: "js", date: new Date(2023, 1, 2) },
] as const;
```

### API

```ts
type DataGridProps<C extends Column> = AriaLabelingProps & {
  /** Use columns and rows to specify data grid content. */
  children?: never;

  /** List of keys for columns to allow sort. */
  columnKeysAllowingSort?: Key[];

  /** Columns for the data grid. */
  columns: C[];

  /** The initial expanded key in the collection (uncontrolled). */
  defaultExpandedKey?: Key;

  /** The initial selected keys in the collection (uncontrolled). */
  defaultSelectedKeys?: "all" | Iterable<Key>;

  /** A list of row keys to disable from selection. */
  disabledKeys?: Iterable<Key>;

  /** The currently expanded key in the collection (controlled). */
  expandedKey?: Key;

  /**
   * Variant of the data grid header to use.
   * @default primary
   */
  headerVariant?: "primary" | "secondary" | "emphasized";

  /** Constrains the height of the data grid to a set number of rows. */
  maxRows?: number;

  /** Handler that is called when a user performs an action on the cell. */
  onCellAction?: (key: Key) => void;

  /** Handler that is called when the expansion changes. */
  onExpandedChange?: (key: Key) => void;

  /** Handler that is called when a user performs an action on the row. */
  onRowAction?: (key: Key) => void;

  /** Handler that is called when the selection changes. */
  onSelectionChange?: (keys: Iterable<Key>) => void;

  /** Handler that is called when the sorted column or direction changes. */
  onSortChange?: (descriptor: SortDescriptor) => void;

  /** Renders the content of a header cell. Defaults to column text. */
  renderColumnCell?: (cell: C) => ReactNode;

  /** Renders the contents of the expanded row. */
  renderExpandedRow?: (key: Key) => ReactNode;

  /** Renders the content of a body cell. Defaults to row property text. */
  renderRowCell?: (cell: unknown, columnKey: Key, row: R) => ReactNode;

  /**
   * Renders the content of empty state.
   * @default "No Data"
   */
  renderEmptyState?: () => ReactNode;

  /** Action definitions for the row. */
  rowActions?: (key: Key) => RowAction[];

  /** Rows for the data grid. */
  rows: Row<C>[];

  /** The currently selected keys in the collection (controlled). */
  selectedKeys?: "all" | Iterable<Key>;

  /** The type of selection that is allowed in the collection. */
  selectionMode?: "none" | "single" | "multiple";

  /**
   * Visual compactness of the DataGrid.
   * @default md
   */
  size?: "sm" | "md" | "lg";

  /** The current sorted column and direction. */
  sortDescriptor?: SortDescriptor;

  /**
   * Whether the table is currently loading.
   * @default false
   */
  isLoading?: boolean;
};

type MenuRowAction = {
  type: "menu";

  /** Optional custom accessibility label describing the menu action. */
  accessibilityLabel?: string;

  /** Render the menu overlay. */
  renderMenuOverlay: () => ReactNode;
};

type ActionRowAction = {
  type: "action";

  /** Accessibility label describing the custom action. */
  accessibilityLabel: string;

  /** Icon symbol for the action. */
  iconSymbol: IconSymbol;

  /** Action to trigger. */
  onAction: () => void;
};

type RowAction = MenuRowAction | IconRowAction;

type SortDescriptor = {
  /** The key of the column to sort by. */
  column?: Key;

  /** The direction to sort by. */
  direction?: SortDirection;
};

type SortDirection = "ascending" | "descending";

type KeyedObject = {
  /** Must contain a key. */
  readonly key: Key;
};

type Column = KeyedObject & {
  /** Another arbitrary data is allowed. */
  [property: string]: unknown;
};

type Row<C extends Column> = KeyedObject & {
  /** Must contain a property for each key in column. */
  [property in C["key"]]: unknown;
};
```

### Example Usage

_Basic static usage:_

```tsx
import { DataGrid } from "@easypost/easy-ui/DataGrid";

const columns = [
  { key: "name", name: "Name" },
  { key: "type", name: "Type" },
  { key: "date", name: "Date Modified" },
] as const;

const rows = [
  { key: 1, name: "Games", date: "6/7/2020", type: "File folder" },
  {
    key: 2,
    name: "Program Files",
    date: "4/7/2021",
    type: "File folder",
  },
  { key: 3, name: "bootmgr", date: "11/20/2010", type: "System file" },
  { key: 4, name: "log.txt", date: "1/18/2016", type: "Text Document" },
] as const;

function CustomDataGrid() {
  return (
    <DataGrid
      aria-label="Example basic static data grid"
      columns={columns}
      rows={rows}
    />
  );
}
```

_DataGrid with row actions:_

```tsx
import { DataGrid } from "@easypost/easy-ui/DataGrid";

const columns = []; /*...*/
const rows = []; /*...*/

function CustomDataGrid() {
  return (
    <DataGrid
      aria-label="Example data grid with row actions"
      columns={columns}
      rows={rows}
      rowActions={(rowKey) => [
        {
          type: "menu",
          accessibilityLabel: "View row actions",
          renderMenuOverlay: () => (
            <Menu.Overlay
              onAction={() => {
                console.log("menu");
              }}
            >
              <Menu.Item>Test 1</Menu.Item>
              <Menu.Item>Test 2</Menu.Item>
            </Menu.Overlay>
          ),
        },
        {
          type: "icon",
          iconSymbol: TrashCanIcon,
          accessibilityLabel: "Delete record",
          onAction: () => {
            // delete record
          },
        },
      ]}
    />
  );
}
```

_DataGrid with selection:_

```tsx
import { DataGrid } from "@easypost/easy-ui/DataGrid";

const columns = []; /*...*/
const rows = [{ key: 1, key: 2, key: 3 }]; /*...*/

function CustomDataGrid() {
  return (
    <DataGrid
      aria-label="Example data grid with selection"
      columns={columns}
      rows={rows}
      // supports "single" or "multiple"
      selectionMode="single"
      // uncontrolled
      defaultSelectedKeys={[2]}
      // controlled
      selectedKeys={[2]}
      onSelectionChange={(keys) => {
        // do something
      }}
    />
  );
}
```

_DataGrid with row expansion:_

```tsx
import { DataGrid } from "@easypost/easy-ui/DataGrid";

const columns = []; /*...*/
const rows = [{ key: 1, key: 2, key: 3 }]; /*...*/

function CustomDataGrid() {
  return (
    <DataGrid
      aria-label="Example data grid with row expansion"
      columns={columns}
      rows={rows}
      renderExpandedRow={(key) => {
        return <>Content for expanded row</>;
      }}
      // uncontrolled
      defaultExpandedKey={2}
      // controlled
      expandedKey={2}
      onExpandedChange={(keys) => {
        // do something
      }}
    />
  );
}
```

_DataGrid with sorting:_

```tsx
import { DataGrid } from "@easypost/easy-ui/DataGrid";

const columns = []; /*...*/

function CustomDataGrid() {
  // useAsyncList is a helper from React Aria that handles async loading
  // and async sorting. it also supports sync loading and sync sorting
  const list = useAsyncList({
    async load() {
      return {
        items: [
          {
            key: 1,
            name: "Luke Skywalker",
            height: "172",
            mass: "77",
            birth_year: "19BBY",
          },
          /* ... */
        ],
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          /* perform sort logic */
        }),
      };
    },
  });
  return (
    <DataGrid
      aria-label="Example data grid with sorting"
      columns={columns}
      rows={list.items}
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
    />
  );
}
```

_DataGrid with custom cell rendering:_

```tsx
import { DataGrid } from "@easypost/easy-ui/DataGrid";

const columns = []; /*...*/
const rows = []; /*...*/

function CustomDataGrid() {
  return (
    <DataGrid
      aria-label="Example data grid with custom cell rendering"
      columns={columns}
      rows={list.items}
      renderHeaderCell={(column) => {
        return <>Custom header cell for {column}</>;
      }}
      renderBodyCell={(cell) => {
        return <>Custom body cell for {cell}</>;
      }}
    />
  );
}
```

_Header variant:_

```tsx
import { DataGrid } from "@easypost/easy-ui/DataGrid";

const columns = []; /*...*/
const rows = []; /*...*/

function CustomDataGrid() {
  return (
    <DataGrid
      aria-label="Example basic static data grid"
      columns={columns}
      rows={rows}
      headerVariant="secondary"
    />
  );
}
```
