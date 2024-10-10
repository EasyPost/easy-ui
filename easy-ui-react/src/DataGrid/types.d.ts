import {
  AriaLabelingProps,
  Key,
  Selection,
  SelectionMode,
  SortDescriptor,
} from "@react-types/shared";
import { ReactNode } from "react";
import { IconSymbol } from "../types";

/** Denote that an object must contain a key. */
export type KeyedObject = {
  readonly key: Key;
};

export type Column = KeyedObject & {
  /** Arbitrary data is allowed. */
  [property: string]: unknown;
};

export type Row<C extends Column> = KeyedObject & {
  /** Must contain a property for each key in column. */
  [property in C["key"]]: unknown;
};

export type MenuRowAction = {
  type: "menu";

  /** Optional custom accessibility label describing the menu action. */
  accessibilityLabel?: string;

  /** Render the menu overlay. */
  renderMenuOverlay: () => ReactNode;
};

export type ActionRowAction = {
  type: "action";

  /** Accessibility label describing the custom action. */
  accessibilityLabel: string;

  /** Icon symbol for the action. */
  iconSymbol: IconSymbol;

  /** Action to trigger. */
  onAction: () => void;
};

export type RowAction = MenuRowAction | ActionRowAction;

export type DataGridProps<C extends Column = Column> = AriaLabelingProps & {
  /** Use columns and rows to specify data grid content. */
  children?: never;

  /** List of keys for columns to allow sort. */
  columnKeysAllowingSort?: Key[];

  /** Columns for the table. */
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
  onSelectionChange?: (keys: Selection) => void;

  /** Handler that is called when the sorted column or direction changes. */
  onSortChange?: (descriptor: SortDescriptor) => void;

  /** Renders the content of a column cell. */
  renderColumnCell: (cell: C) => ReactNode;

  /** Renders the contents of the expanded row. */
  renderExpandedRow?: (key: Key) => ReactNode;

  /** Renders the content of a row cell. */
  renderRowCell: (cell: unknown, columnKey: Key, row: R) => ReactNode;

  /** Actions for the row */
  rowActions?: (key: Key) => RowAction[];

  /** Rows for the table. */
  rows: Row<C>[];

  /** The currently selected keys in the collection (controlled). */
  selectedKeys?: "all" | Iterable<Key>;

  /** The type of selection that is allowed in the collection. */
  selectionMode?: SelectionMode;

  /**
   * Visual compactness of the DataGrid.
   * @default md
   */
  size?: "sm" | "md" | "lg";

  /** The current sorted column and direction. */
  sortDescriptor?: SortDescriptor;
};
