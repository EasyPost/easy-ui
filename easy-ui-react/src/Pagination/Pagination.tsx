import React, { ReactElement, cloneElement } from "react";
import KeyboardDoubleArrowRight from "@easypost/easy-ui-icons/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeft from "@easypost/easy-ui-icons/KeyboardDoubleArrowLeft";
import { HorizontalGrid } from "../HorizontalGrid";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { PaginationButton } from "./PaginationButton";
import { PaginationItem } from "./PaginationItem";
import { PaginationRowsPerPage } from "./PaginationRowsPerPage";
import {
  PaginationDropdown,
  PaginationDropdownProps,
} from "./PaginationDropdown";
import { getDisplayNameFromReactNode } from "../utilities/react";
import { classNames } from "../utilities/css";
import styles from "./Pagination.module.scss";

const DEFAULT_VISIBLE_PAGE_COUNT = 5;
const DEFAULT_ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export type PaginationSize = "sm" | "md";

type PaginationCommonProps = {
  /**
   * Accessible label for Pagination, used for aria-label.
   */
  label: string;
  /**
   * Whether the Pagination component should be disabled.
   */
  isDisabled?: boolean;
};

/**
 * Basic (previous/next) pagination, optionally with a `<Pagination.Dropdown />`
 * page selector. The numbered-pagination props are disallowed in this variant.
 */
export type PaginationBasicProps = PaginationCommonProps & {
  /**
   * Whether there is a previous page to show.
   * @default false
   */
  hasPrevious?: boolean;
  /**
   * Whether there is a next page to show.
   * @default false
   */
  hasNext?: boolean;
  /**
   * Callback when previous button is clicked.
   */
  onPrevious?: () => void;
  /**
   * Callback when next button is clicked.
   */
  onNext?: () => void;
  /**
   * The children of `<Pagination />` component only
   * accept `<Pagination.Dropdown />`.
   */
  children?: ReactElement<PaginationDropdownProps>;
  page?: never;
  count?: never;
  onPageChange?: never;
  showFirstLast?: never;
  visiblePageCount?: never;
  rowsPerPage?: never;
  rowsPerPageOptions?: never;
  onRowsPerPageChange?: never;
  size?: never;
};

/**
 * Numbered pagination. Requires `page`, `count`, and `onPageChange`; the basic
 * previous/next props are disallowed in this variant.
 */
export type PaginationNumberedProps = PaginationCommonProps & {
  /**
   * The current page, 1-indexed. The consumer owns this value — pass a page
   * within `[1, count]`. Out-of-range values are clamped for display, not
   * corrected upstream.
   */
  page: number;
  /**
   * The total number of pages. A count below 1 renders nothing.
   */
  count: number;
  /**
   * Callback when a page is selected — fired by the page numbers,
   * previous/next, and First/Last controls.
   */
  onPageChange: (page: number) => void;
  /**
   * Whether to render First and Last jump buttons.
   * @default false
   */
  showFirstLast?: boolean;
  /**
   * How many page-number buttons the window shows. The window stays centered
   * on the active page (just left of center for even counts); hidden pages
   * collapse behind a static ellipsis.
   * @default 5
   */
  visiblePageCount?: number;
  /**
   * The current rows-per-page value. Provide with `onRowsPerPageChange` to
   * render the Rows Per Page control.
   */
  rowsPerPage?: number;
  /**
   * The selectable rows-per-page values.
   * @default [10, 25, 50, 100]
   */
  rowsPerPageOptions?: number[];
  /**
   * Callback when a rows-per-page value is selected.
   */
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  /**
   * Size of the pagination controls.
   * @default md
   */
  size?: PaginationSize;
  hasPrevious?: never;
  hasNext?: never;
  onPrevious?: never;
  onNext?: never;
  children?: never;
};

export type PaginationProps = PaginationBasicProps | PaginationNumberedProps;

function isNumberedPagination(
  props: PaginationProps,
): props is PaginationNumberedProps {
  return (
    props.page != null &&
    props.count != null &&
    typeof props.onPageChange === "function"
  );
}

/**
 * A `<Pagination />` component enabled the user to
 * divide large amounts of content into multiple pages,
 * and navigate between pages.
 *
 * @example
 * _Basic:_
 * ```tsx
 * <Pagination
 *  label="Example Basic"
 *  onPrevious={handlePrevious}
 *  onNext={handleNext}
 *  hasPrevious
 *  hasNext
 * />
 * ```
 *
 * @example
 * _With Dropdown:_
 * ```tsx
 * <Pagination
 *  label="Example with Dripdown"
 *  onPrevious={handlePrevious}
 *  onNext={handleNext}
 *  hasPrevious
 *  hasNext
 * >
 *  <Pagination.Dropdown
 *    count={10}
 *    page={4}
 *    onSelect={handleSelect}
 *  />
 * </Pagination>
 * ```
 *
 * @example
 * _Numbered:_
 * ```tsx
 * <Pagination
 *  label="Example Numbered"
 *  page={page}
 *  count={20}
 *  onPageChange={setPage}
 *  showFirstLast
 * />
 * ```
 *
 * @example
 * _Disabled:_
 * ```tsx
 * <Pagination label="Example Disabled" isDisabled />
 * ```
 */
export function Pagination(props: PaginationProps) {
  const { label, isDisabled } = props;

  if (isNumberedPagination(props)) {
    return (
      <NumberedPagination
        label={label}
        isDisabled={isDisabled}
        page={props.page}
        count={props.count}
        onPageChange={props.onPageChange}
        showFirstLast={props.showFirstLast ?? false}
        visiblePageCount={props.visiblePageCount ?? DEFAULT_VISIBLE_PAGE_COUNT}
        size={props.size ?? "md"}
        rowsPerPage={props.rowsPerPage}
        rowsPerPageOptions={
          props.rowsPerPageOptions ?? DEFAULT_ROWS_PER_PAGE_OPTIONS
        }
        onRowsPerPageChange={props.onRowsPerPageChange}
      />
    );
  }

  const {
    hasPrevious = false,
    hasNext = false,
    onPrevious,
    onNext,
    children,
  } = props;

  const className = classNames(
    styles.pagination,
    isDisabled && styles.disabled,
  );

  if (
    children &&
    getDisplayNameFromReactNode(children) !== PaginationDropdown.displayName
  ) {
    throw new Error(`children must be ${PaginationDropdown.displayName}`);
  }

  return (
    <nav aria-label={label} className={className}>
      <HorizontalStack wrap={false}>
        <PaginationButton
          aria-label="Previous"
          onPress={onPrevious}
          isDisabled={!hasPrevious || isDisabled}
          symbol={KeyboardDoubleArrowLeft}
        />
        {children && cloneElement(children, { isDisabled })}
        <PaginationButton
          aria-label="Next"
          onPress={onNext}
          isDisabled={!hasNext || isDisabled}
          symbol={KeyboardDoubleArrowRight}
        />
      </HorizontalStack>
    </nav>
  );
}

type NumberedPaginationProps = {
  label: string;
  isDisabled?: boolean;
  page: number;
  count: number;
  onPageChange: (page: number) => void;
  showFirstLast: boolean;
  visiblePageCount: number;
  size: PaginationSize;
  rowsPerPage?: number;
  rowsPerPageOptions: number[];
  onRowsPerPageChange?: (rowsPerPage: number) => void;
};

function NumberedPagination(props: NumberedPaginationProps) {
  const {
    label,
    isDisabled,
    page,
    count,
    onPageChange,
    showFirstLast,
    visiblePageCount,
    size,
    rowsPerPage,
    rowsPerPageOptions,
    onRowsPerPageChange,
  } = props;

  // No pages, nothing to paginate.
  if (count < 1) {
    return null;
  }

  // The window is centered on the active page, so the active page is always
  // visible. The ellipses are static indicators of hidden pages — not
  // controls — and First/Last/Previous/Next handle jumping.
  const {
    currentPage,
    total,
    windowPages,
    showLeftEllipsis,
    showRightEllipsis,
  } = getPaginationView({ page, count, visiblePageCount });

  const isAtStart = isDisabled || currentPage <= 1;
  const isAtEnd = isDisabled || currentPage >= total;

  const ellipsis = (
    <span className={styles.ellipsis} aria-hidden="true">
      <Text variant={size === "sm" ? "body2" : "body1"} color="neutral.400">
        …
      </Text>
    </span>
  );

  const renderPage = (pageNumber: number) => (
    <PaginationItem
      key={pageNumber}
      size={size}
      isSelected={pageNumber === currentPage}
      aria-label={`Page ${pageNumber}`}
      isDisabled={isDisabled}
      onPress={() => onPageChange(pageNumber)}
    >
      {pageNumber}
    </PaginationItem>
  );

  const nav = (
    <nav
      aria-label={label}
      className={classNames(
        styles.pagination,
        styles.numbered,
        isDisabled && styles.disabled,
      )}
    >
      <HorizontalStack blockAlign="center" gap="0.5" wrap={false}>
        {showFirstLast && (
          <PaginationItem
            aria-label="First"
            size={size}
            isDisabled={isAtStart}
            onPress={() => onPageChange(1)}
          >
            First
          </PaginationItem>
        )}
        <PaginationItem
          aria-label="Previous"
          size={size}
          symbol={KeyboardDoubleArrowLeft}
          isDisabled={isAtStart}
          onPress={() => onPageChange(currentPage - 1)}
        />
        {showLeftEllipsis && ellipsis}
        {windowPages.map(renderPage)}
        {showRightEllipsis && ellipsis}
        <PaginationItem
          aria-label="Next"
          size={size}
          symbol={KeyboardDoubleArrowRight}
          isDisabled={isAtEnd}
          onPress={() => onPageChange(currentPage + 1)}
        />
        {showFirstLast && (
          <PaginationItem
            aria-label="Last"
            size={size}
            isDisabled={isAtEnd}
            onPress={() => onPageChange(total)}
          >
            Last
          </PaginationItem>
        )}
      </HorizontalStack>
    </nav>
  );

  // Center the nav in the footer with a `1fr auto 1fr` grid; the Rows Per Page
  // control (when present) sits in the right track, pinned to the far edge
  // (`.rowsPerPage { justify-self: end }`). The leading spacer keeps the nav in
  // the centered middle track whether or not Rows Per Page renders.
  return (
    <HorizontalGrid columns={["1fr", "auto", "1fr"]} alignItems="center">
      <div />
      {nav}
      {rowsPerPage != null && onRowsPerPageChange != null && (
        <PaginationRowsPerPage
          rowsPerPage={rowsPerPage}
          options={rowsPerPageOptions}
          onChange={onRowsPerPageChange}
          isDisabled={isDisabled}
          size={size}
        />
      )}
    </HorizontalGrid>
  );
}

Pagination.Dropdown = PaginationDropdown;

/** The inclusive integer range `[start, end]` (empty when `end < start`). */
function range(start: number, end: number): number[] {
  const length = end - start + 1;
  return length > 0 ? Array.from({ length }, (_, i) => start + i) : [];
}

type PaginationView = {
  /** The active page, clamped into `[1, total]`. */
  currentPage: number;
  /** The total number of pages (floored at 1). */
  total: number;
  /** The consecutive page numbers shown in the window. */
  windowPages: number[];
  /** Whether pages are hidden before the window (render a static ellipsis). */
  showLeftEllipsis: boolean;
  /** Whether pages are hidden after the window (render a static ellipsis). */
  showRightEllipsis: boolean;
};

/**
 * Computes what the numbered pagination renders: the active page and total
 * (both clamped) plus a window of consecutive page numbers centered on the
 * active page, with a static ellipsis on either side when pages are hidden.
 *
 * The window follows the active page, so it is always visible; the ellipses
 * are non-interactive indicators, and First/Last/Previous/Next handle jumping.
 * For an even `visiblePageCount` the active page sits just left of center
 * (e.g. size 4, page 10 → 8–11).
 */
function getPaginationView({
  page,
  count,
  visiblePageCount,
}: {
  page: number;
  count: number;
  visiblePageCount: number;
}): PaginationView {
  const total = Math.max(count, 1);
  const size = Math.min(Math.max(visiblePageCount, 1), total);
  const currentPage = Math.min(Math.max(page, 1), total);

  const maxStart = total - size + 1;
  const windowStart = Math.min(
    Math.max(currentPage - Math.floor(size / 2), 1),
    maxStart,
  );
  const windowEnd = windowStart + size - 1;

  return {
    currentPage,
    total,
    windowPages: range(windowStart, windowEnd),
    showLeftEllipsis: windowStart > 1,
    showRightEllipsis: windowEnd < total,
  };
}
