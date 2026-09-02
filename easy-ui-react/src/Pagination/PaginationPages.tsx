import React from "react";
import {
  PaginationEllipsis,
  PaginationPageButton,
} from "./PaginationPagedButtons";

import styles from "./Pagination.module.scss";

export type PaginationPagesProps = {
  /**
   * The current page.
   */
  page: number;
  /**
   * The total number of pages.
   */
  count: number;
  /**
   * Callback when a page is selected.
   */
  onSelect: (page: number) => void;
  /**
   * How many pages to show on either side of the current page.
   *
   * @default 2
   */
  siblingCount?: number;
  /**
   * How many pages to pin at the start and end of the range. Defaults to none,
   * since `<Pagination />`'s first and last buttons cover the boundaries.
   *
   * @default 0
   */
  boundaryCount?: number;
  /**
   * Whether the pages should be disabled.
   */
  isDisabled?: boolean;
};

const ELLIPSIS = "ellipsis" as const;

/**
 * Renders a range of individually selectable page numbers, truncating runs of
 * pages that fall outside of the range with an ellipsis.
 *
 * @remarks
 * Use as a child of `<Pagination />` in place of `<Pagination.Dropdown />`.
 * Supplying it switches `<Pagination />` to its numbered scheme.
 */
export function PaginationPages(props: PaginationPagesProps) {
  const {
    page,
    count,
    onSelect,
    siblingCount = 2,
    boundaryCount = 0,
    isDisabled,
  } = props;

  const items = getPaginationRange({
    page,
    count,
    siblingCount,
    boundaryCount,
  });

  return (
    <div className={styles.pageRow}>
      {items.map((item, i) =>
        item === ELLIPSIS ? (
          // Ellipses are interchangeable, so their index is a stable enough key
          <PaginationEllipsis key={`${ELLIPSIS}-${i}`} />
        ) : (
          <PaginationPageButton
            key={item}
            page={item}
            isCurrent={item === page}
            isDisabled={isDisabled}
            aria-label={`Page ${item} of ${count}`}
            onPress={() => onSelect(item)}
          />
        ),
      )}
    </div>
  );
}

/**
 * Builds the list of pages to render, inserting ellipses where pages are
 * truncated.
 *
 * @returns page numbers interleaved with ellipsis markers
 */
export function getPaginationRange({
  page,
  count,
  siblingCount,
  boundaryCount,
}: {
  page: number;
  count: number;
  siblingCount: number;
  boundaryCount: number;
}) {
  if (count <= 0) {
    return [];
  }

  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count,
  );

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  );

  return [
    ...startPages,
    ...getStartTruncation({ siblingsStart, boundaryCount, count }),
    ...range(siblingsStart, siblingsEnd),
    ...getEndTruncation({ siblingsEnd, boundaryCount, count }),
    ...endPages,
  ];
}

function getStartTruncation({
  siblingsStart,
  boundaryCount,
  count,
}: {
  siblingsStart: number;
  boundaryCount: number;
  count: number;
}) {
  if (siblingsStart > boundaryCount + 2) {
    return [ELLIPSIS];
  }
  // Only one page is being hidden, so show it rather than truncate it
  if (boundaryCount + 1 < count - boundaryCount) {
    return [boundaryCount + 1];
  }
  return [];
}

function getEndTruncation({
  siblingsEnd,
  boundaryCount,
  count,
}: {
  siblingsEnd: number;
  boundaryCount: number;
  count: number;
}) {
  if (siblingsEnd < count - boundaryCount - 1) {
    return [ELLIPSIS];
  }
  if (count - boundaryCount > boundaryCount) {
    return [count - boundaryCount];
  }
  return [];
}

function range(start: number, end: number) {
  const length = end - start + 1;
  return length > 0 ? Array.from({ length }, (_, i) => start + i) : [];
}

PaginationPages.displayName = "Pagination.Pages";
