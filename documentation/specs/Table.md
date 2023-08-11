# `Table` Component Specification

## Overview

A `Table` is a collection of information displayed across columns and rows.

---

## Design

Tables are complicated, particularly when selection, sorting, and expansion are customization options. Fortunately React Aria has a set of hooks for dealing with a lot of the complexity.

`Table` will use the `useTable` hooks from React Aria for managing display, selection, and sort. React Aria doesn't support expansion capabilities out of the box, so a lightweight layer on top will need to be built to support expansion.

While React Aria allows for specifying JSX children to the `Table`, we will control the API for the `Table` component to only allow data to be passed through a `columns` and `rows` prop. While this is a departure from other components we have that support compound composability—i.e. `Menu`, `CodeBlock`, `Card`—this allows us to support Aria's dynamic collections API out-of-the-box while also removing API surface area for our consumers.

`columns` and `rows` will be arrays of objects. They must have a `key` property that will be passed to supporting rendering functions. `rows` must contain objects with a property for each `key` in `columns`.

### API

```ts
type TableProps<C, R> = AriaLabelingProps & {
  /** Use columns and rows to specify Table content. */
  children?: never;

  /** Columns for the table. */
  columns: C[];

  /** The initial expanded key in the collection (uncontrolled). */
  defaultExpandedKey?: Key;

  /** The initial selected keys in the collection (uncontrolled). */
  defaultSelectedKeys?: "all" | Iterable<Key>;

  /** A list of row keys to disable. */
  disabledKeys?: Iterable<Key>;

  /** The currently expanded key in the collection (controlled). */
  expandedKey?: Key;

  /**
   * Whether or not row expansion is enabled.
   */
  hasExpandableRows?: boolean;

  /** The type of selection that is allowed in the collection. */
  selectionMode?: "none" | "single" | "multiple";

  /** The current sorted column and direction. */
  sortDescriptor?: SortDescriptor;

  /** Handler that is called when a user performs an action on the cell. */
  onCellAction?: (key: Key) => void;

  /** Handler that is called when a user performs an action on the row. */
  onRowAction?: (key: Key) => void;

  /** Handler that is called when the expansion changes. */
  onExpandedChange?: (key: Key) => void;

  /** Handler that is called when the selection changes. */
  onSelectionChange?: (keys: Selection) => void;

  /** Handler that is called when the sorted column or direction changes. */
  onSortChange?: (descriptor: SortDescriptor) => void;

  /**
   * Renders the content of a row cell. Defaults to the text value of the row property if available.
   */
  renderCell?: (cell: unknown, row: R, columnKey: Key) => ReactNode;

  /**
   * Renders the content of a column cell. Defaults to the text value of the column property if available.
   */
  renderColumn?: (cell: C) => ReactNode;

  /**
   * Renders the contents of the expanded row.
   */
  renderExpandedRow?: (key: Key) => ReactNode;

  /** Actions for the row. */
  rowActions?: RowAction[];

  /** Rows for the table. */
  rows: R[];

  /** The currently selected keys in the collection (controlled). */
  selectedKeys?: "all" | Iterable<Key>;
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

  /** Accessibility label describing the menu action. */
  accessibilityLabel: string;

  /** Icon symbol for the action. */
  iconSymbol: IconSymbol;

  /** Action to trigger. */
  onAction: () => void;
};

type RowAction = MenuRowAction | ActionRowAction;
```

### Example Usage

_Basic usage:_

```tsx
import { Table } from "@easypost/easy-ui/Table";

function CustomTable() {
  const columns = useMemo(
    () => [
      { key: "name", name: "Name" },
      { key: "type", name: "Type" },
      { key: "date", name: "Date Modified" },
    ],
    [],
  );
  const rows = useMemo(
    () => [
      { key: 1, name: "Games", date: "6/7/2020", type: "File folder" },
      {
        key: 2,
        name: "Program Files",
        date: "4/7/2021",
        type: "File folder",
      },
      { key: 3, name: "bootmgr", date: "11/20/2010", type: "System file" },
      { key: 4, name: "log.txt", date: "1/18/2016", type: "Text Document" },
    ],
    [],
  );
  return (
    <Table aria-label="Example custom table" columns={columns} rows={rows} />
  );
}
```

_Row actions:_

```tsx
import { Table } from "@easypost/easy-ui/Table";

function CustomTable() {
  const columns = useMemo(
    () => [
      /*...*/
    ],
    [],
  );
  const rows = useMemo(
    () => [
      /*...*/
    ],
    [],
  );
  return (
    <Table
      aria-label="Example custom table"
      columns={columns}
      rows={rows}
      rowActions={[
        {
          type: "menu",
          accessibilityLabel: "Delete record",
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
          type: "action",
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

_Disabling rows:_

```tsx
import { Table } from "@easypost/easy-ui/Table";

function CustomTable() {
  const columns = useMemo(
    () => [
      /*...*/
    ],
    [],
  );
  const rows = useMemo(
    () => [
      /*...*/
    ],
    [],
  );
  return (
    <Table
      aria-label="Example custom table"
      columns={columns}
      rows={rows}
      disabledKeys={[2]}
    />
  );
}
```

_Selection:_

```tsx
import { Table } from "@easypost/easy-ui/Table";

function CustomTable() {
  const columns = useMemo(
    () => [
      /*...*/
    ],
    [],
  );
  const rows = useMemo(
    () => [
      /*...*/
    ],
    [],
  );
  return (
    <Table
      aria-label="Example custom table"
      columns={columns}
      rows={rows}
      // can be "single" or "multiple"
      selectionMode="single"
      // can be controlled or uncontrolle
      defaultSelectedKeys={[2]}
      selectedKeys={[2]}
      onSelectionChange={(keys) => {
        // do something
      }}
    />
  );
}
```

_Row expansion:_

```tsx
import { Table } from "@easypost/easy-ui/Table";

function CustomTable() {
  const columns = useMemo(
    () => [
      /*...*/
    ],
    [],
  );
  const rows = useMemo(
    () => [
      /*...*/
    ],
    [],
  );
  return (
    <Table
      aria-label="Example custom table"
      columns={columns}
      rows={rows}
      hasExpandedRows
      renderExpandedRow={(rowKey) => {
        return <>Content for expanded row</>;
      }}
      // can be controlled or uncontrolle
      defaultExpandedKey={2}
      expandedKey={2}
      onExpandedChange={(keys) => {
        // do something
      }}
    />
  );
}
```

_Sorting:_

```tsx
import { Table } from "@easypost/easy-ui/Table";

function CustomTable() {
  const columns = useMemo(
    () => [
      /*...*/
    ],
    [],
  );
  // list helper from react-aria that can handle async fetching and sorting
  const list = useAsyncList<{
    name: string;
    height: string;
    mass: string;
    birth_year: string;
  }>({
    async load() {
      return {
        items: [
          {
            name: "Luke Skywalker",
            height: "172",
            mass: "77",
            birth_year: "19BBY",
          },
          {
            name: "C-3PO",
            height: "167",
            mass: "75",
            birth_year: "112BBY",
          },
          {
            name: "R2-D2",
            height: "96",
            mass: "32",
            birth_year: "33BBY",
          },
        ],
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          const first = a[sortDescriptor.column as keyof typeof a];
          const second = b[sortDescriptor.column as keyof typeof b];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;
          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });
  return (
    <Table
      aria-label="Example custom table"
      columns={columns}
      rows={list.items}
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
    />
  );
}
```
