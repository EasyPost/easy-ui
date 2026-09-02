import React from "react";
import { Pagination } from "../Pagination";

export type DataGridPaginationProps = {
  /** The current page. */
  page: number;

  /** The total number of pages. */
  count: number;

  /** Handler that is called when the user moves to another page. */
  onChange: (page: number) => void;

  /**
   * Accessible label for the pagination.
   * @default Pagination
   */
  label?: string;

  /** Whether the pagination should be disabled. */
  isDisabled?: boolean;

  /**
   * How many pages to show on either side of the current page.
   * @default 2
   */
  siblingCount?: number;
};

/**
 * A fully controlled pagination preset for use within a data grid footer.
 *
 * @remarks
 * This derives the first, previous, next, and last button states from `page`
 * and `count` so consumers only supply where they are and how to get
 * elsewhere. Reach for `<Pagination />` directly for anything this doesn't
 * cover; the data grid footer doesn't require this component.
 *
 * @example
 * ```tsx
 * <DataGrid.Pagination page={page} count={10} onChange={setPage} />
 * ```
 */
export function DataGridPagination(props: DataGridPaginationProps) {
  const {
    page,
    count,
    onChange,
    label = "Pagination",
    isDisabled,
    siblingCount,
  } = props;

  const hasPrevious = page > 1;
  const hasNext = page < count;

  return (
    <Pagination
      label={label}
      // The footer bar is a fixed height that the smaller controls are drawn to
      size="sm"
      isDisabled={isDisabled}
      hasFirst={hasPrevious}
      hasPrevious={hasPrevious}
      hasNext={hasNext}
      hasLast={hasNext}
      onFirst={() => onChange(1)}
      onPrevious={() => onChange(page - 1)}
      onNext={() => onChange(page + 1)}
      onLast={() => onChange(count)}
    >
      <Pagination.Pages
        page={page}
        count={count}
        siblingCount={siblingCount}
        onSelect={onChange}
      />
    </Pagination>
  );
}

DataGridPagination.displayName = "DataGrid.Pagination";
