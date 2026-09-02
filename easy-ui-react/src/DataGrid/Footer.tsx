import React, { ReactNode } from "react";
import { classNames } from "../utilities/css";
import { useDataGridTable } from "./context";

import styles from "./Footer.module.scss";

export type DataGridFooterProps = {
  /** Content rendered in the start region of the footer. */
  start?: ReactNode;

  /** Content rendered in the center region of the footer. */
  center?: ReactNode;

  /** Content rendered in the end region of the footer. */
  end?: ReactNode;
};

/**
 * Lays out the content of a `<DataGrid />` footer into start, center, and end
 * regions.
 *
 * @remarks
 * `<DataGrid.Footer />` is deliberately unaware of what it lays out, so the
 * data grid isn't tied to any one pagination scheme. Pass any content into its
 * regions; `<DataGrid.Pagination />` and `<DataGrid.RowsPerPage />` cover
 * the standard controls.
 *
 * The center region stays centered within the grid regardless of how wide the
 * start and end regions grow.
 *
 * @example
 * <DataGrid
 *   renderFooter={() => (
 *     <DataGrid.Footer
 *       center={<DataGrid.Pagination {...paginationProps} />}
 *       end={<DataGrid.RowsPerPage {...rowsPerPageProps} />}
 *     />
 *   )}
 * />
 */
export function DataGridFooter(props: DataGridFooterProps) {
  const { start, center, end } = props;
  return (
    <div className={styles.DataGridFooter}>
      <div className={classNames(styles.region, styles.start)}>{start}</div>
      <div className={classNames(styles.region, styles.center)}>{center}</div>
      <div className={classNames(styles.region, styles.end)}>{end}</div>
    </div>
  );
}

type FooterShellProps = {
  children: ReactNode;
};

/**
 * Sticky container that houses whatever a data grid's `renderFooter` returns.
 *
 * @remarks
 * Mirrors the column header's mechanics: it sticks to an edge of the scroll
 * port and casts a shadow over the content it covers while that content is
 * under scroll. Rendering it outside of the `<table />` keeps its interactive
 * content out of the grid's row and cell semantics.
 */
export function FooterShell({ children }: FooterShellProps) {
  const table = useDataGridTable();
  const className = classNames(
    styles.shell,
    table.isBottomEdgeUnderScroll && styles.shadowTop,
  );
  return (
    <div className={className} data-ezui-data-grid-footer="true">
      {children}
    </div>
  );
}
