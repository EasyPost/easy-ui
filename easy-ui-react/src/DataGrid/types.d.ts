import {
  AriaLabelingProps,
  Selection,
  SelectionMode,
  SortDescriptor,
} from "@react-types/shared";
import { Key, ReactElement, ReactNode } from "react";
import { IconSymbol } from "../types";

export type Column = {
  key: Key;
} & object;

export type MenuRowAction = {
  type: "menu";
  renderMenuOverlay: () => ReactNode;
};

export type ActionRowAction = {
  type: "action";
  iconSymbol: IconSymbol;
  accessibilityLabel: string;
  onAction: () => void;
};

export type RowAction = MenuRowAction | ActionRowAction;

export type TableProps<C, R> = AriaLabelingProps & {
  /** The elements that make up the table. Includes the TableHeader, TableBody, Columns, and Rows. */
  children?: [ReactElement, ReactElement];

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
  selectionMode?: SelectionMode;

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

  /** Renders the content of a column cell. */
  renderColumnCell: (cell: C) => ReactNode;

  /**
   * Renders the contents of the expanded row.
   */
  renderExpandedRow?: (key: Key) => ReactNode;

  /** Renders the content of a row cell. */
  renderRowCell: (cell: unknown, row: R, columnKey: Key) => ReactNode;

  /** Actions for the row */
  rowActions?: RowAction[];

  /** Rows for the table. */
  rows: R[];

  /** The currently selected keys in the collection (controlled). */
  selectedKeys?: "all" | Iterable<Key>;
};
