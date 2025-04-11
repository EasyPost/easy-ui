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
export type KeyedObject<K extends Key = Key> = {
  readonly key: K;
};

export type Column = KeyedObject & {
  /** Arbitrary data is allowed. */
  [property: string]: unknown;
};

export type Row<D extends Record<string, unknown> = Record<string, unknown>> =
  KeyedObject & D;

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

export type ColumnKey<C extends Column = Column> = C["key"];
export type RowKey<R extends Row = Row> = R["key"];

export type KeyedSortDescriptor<K extends Key = Key> = Omit<
  SortDescriptor,
  "column"
> & {
  column: K;
};

export type RowAction = MenuRowAction | ActionRowAction;

export type DataGridProps<
  C extends Column = Column,
  R extends Row = Row,
> = AriaLabelingProps & {
  /** Use columns and rows to specify data grid content. */
  children?: never;

  /** List of keys for columns to allow sort. */
  columnKeysAllowingSort?: ColumnKey<C>[];

  /** Columns for the table. */
  columns: C[];

  /** The initial expanded key in the collection (uncontrolled). */
  defaultExpandedKey?: RowKey<R>;

  /** The initial selected keys in the collection (uncontrolled). */
  defaultSelectedKeys?: "all" | Iterable<RowKey<R>>;

  /** A list of row keys to disable from selection. */
  disabledKeys?: Iterable<RowKey<R>>;

  /** The currently expanded key in the collection (controlled). */
  expandedKey?: RowKey<R>;

  /**
   * Variant of the data grid header to use.
   * @default primary
   */
  headerVariant?: "primary" | "secondary" | "emphasized";

  /** Constrains the height of the data grid to a set number of rows. */
  maxRows?: number;

  /** Handler that is called when a user performs an action on the cell. */
  onCellAction?: (key: RowKey<R>) => void;

  /** Handler that is called when the expansion changes. */
  onExpandedChange?: (key: RowKey<R>) => void;

  /** Handler that is called when a user performs an action on the row. */
  onRowAction?: (key: RowKey<R>) => void;

  /** Handler that is called when the selection changes. */
  onSelectionChange?: (keys: Selection) => void;

  /** Handler that is called when the sorted column or direction changes. */
  onSortChange?: (descriptor: KeyedSortDescriptor<ColumnKey<C>>) => void;

  /** Renders the content of a column cell. */
  renderColumnCell: (cell: C) => ReactNode;

  /** Renders the contents of the expanded row. */
  renderExpandedRow?: (key: RowKey<R>) => ReactNode;

  /** Renders the content of a row cell. */
  renderRowCell: (cell: unknown, columnKey: ColumnKey<C>, row: R) => ReactNode;

  /** Actions for the row */
  rowActions?: (key: RowKey<R>) => RowAction[];

  /** Rows for the table. */
  rows: R[];

  /** The currently selected keys in the collection (controlled). */
  selectedKeys?: "all" | Iterable<RowKey<R>>;

  /** The type of selection that is allowed in the collection. */
  selectionMode?: SelectionMode;

  /**
   * Visual compactness of the DataGrid.
   * @default md
   */
  size?: "sm" | "md" | "lg";

  /** The current sorted column and direction. */
  sortDescriptor?: KeyedSortDescriptor<ColumnKey<C>>;

  /**
   * Renders the content of empty state.
   * @default "No Data"
   */
  renderEmptyState?: () => ReactNode;

  /**
   * Whether the table is currently loading.
   * @default false
   */
  isLoading?: boolean;
};
