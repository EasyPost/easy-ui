import React from "react";
import { Pagination } from "../Pagination";

export type DataGridRowsPerPageProps = {
  /** The number of rows currently shown per page. */
  rowsPerPage: number;

  /** The rows per page counts to choose from. */
  options: number[];

  /** Handler that is called when another count is selected. */
  onChange: (rowsPerPage: number) => void;

  /**
   * Label rendered alongside the menu trigger.
   * @default Rows Per Page:
   */
  label?: string;

  /** Whether the menu should be disabled. */
  isDisabled?: boolean;
};

/**
 * A fully controlled rows per page preset for use within a data grid footer.
 *
 * @remarks
 * All this pins is the size the footer bar is drawn to. Reach for
 * `<Pagination.RowsPerPage />` directly for anything this doesn't cover; the
 * data grid footer doesn't require this component.
 *
 * @example
 * ```tsx
 * <DataGrid.RowsPerPage
 *   rowsPerPage={rowsPerPage}
 *   options={[25, 50, 100]}
 *   onChange={setRowsPerPage}
 * />
 * ```
 */
export function DataGridRowsPerPage(props: DataGridRowsPerPageProps) {
  const { rowsPerPage, options, onChange, label, isDisabled } = props;
  return (
    <Pagination.RowsPerPage
      rowsPerPage={rowsPerPage}
      options={options}
      onChange={onChange}
      label={label}
      isDisabled={isDisabled}
      // The footer bar is a fixed height that the smaller controls are drawn to
      size="sm"
    />
  );
}

DataGridRowsPerPage.displayName = "DataGrid.RowsPerPage";
