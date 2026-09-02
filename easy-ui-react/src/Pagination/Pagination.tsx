import React, { ReactElement, cloneElement } from "react";
import KeyboardDoubleArrowRight from "@easypost/easy-ui-icons/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeft from "@easypost/easy-ui-icons/KeyboardDoubleArrowLeft";
import { HorizontalStack } from "../HorizontalStack";
import { PaginationButton } from "./PaginationButton";
import {
  PaginationDropdown,
  PaginationDropdownProps,
} from "./PaginationDropdown";
import {
  PaginationJumpButton,
  PaginationNavButton,
} from "./PaginationPagedButtons";
import { PaginationPages, PaginationPagesProps } from "./PaginationPages";
import { getDisplayNameFromReactNode } from "../utilities/react";
import { classNames } from "../utilities/css";
import styles from "./Pagination.module.scss";

export type PaginationProps = {
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
   * Whether there is a first page to jump to. Only relevant alongside
   * `onFirst`.
   * @default false
   */
  hasFirst?: boolean;
  /**
   * Whether there is a last page to jump to. Only relevant alongside `onLast`.
   * @default false
   */
  hasLast?: boolean;
  /**
   * Callback when previous button is clicked.
   */
  onPrevious?: () => void;
  /**
   * Callback when next button is clicked.
   */
  onNext?: () => void;
  /**
   * Callback when the first page button is clicked. Supplying this renders a
   * first page button; it's only available in the numbered scheme.
   */
  onFirst?: () => void;
  /**
   * Callback when the last page button is clicked. Supplying this renders a
   * last page button; it's only available in the numbered scheme.
   */
  onLast?: () => void;
  /**
   * Accessible label for Pagination, used for aria-label.
   */
  label: string;
  /**
   * Whether the Pagination component should be disabled.
   */
  isDisabled?: boolean;
  /**
   * The children of `<Pagination />` component only accept
   * `<Pagination.Dropdown />` or `<Pagination.Pages />`. Which one is supplied
   * determines the scheme the pagination renders in.
   */
  children?: ReactElement<PaginationDropdownProps | PaginationPagesProps>;
};

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
 * _With Pages:_
 * ```tsx
 * <Pagination
 *  label="Example with Pages"
 *  onFirst={handleFirst}
 *  onPrevious={handlePrevious}
 *  onNext={handleNext}
 *  onLast={handleLast}
 *  hasFirst
 *  hasPrevious
 *  hasNext
 *  hasLast
 * >
 *  <Pagination.Pages count={10} page={4} onSelect={handleSelect} />
 * </Pagination>
 * ```
 *
 * @example
 * _Disabled:_
 * ```tsx
 * <Pagination label="Example Disabled" isDisabled />
 * ```
 */
export function Pagination(props: PaginationProps) {
  const {
    hasPrevious = false,
    hasNext = false,
    hasFirst = false,
    hasLast = false,
    onPrevious,
    onNext,
    onFirst,
    onLast,
    label,
    isDisabled,
    children,
  } = props;

  const childDisplayName = children
    ? getDisplayNameFromReactNode(children)
    : null;

  if (
    children &&
    childDisplayName !== PaginationDropdown.displayName &&
    childDisplayName !== PaginationPages.displayName
  ) {
    throw new Error(
      `children must be ${PaginationDropdown.displayName} or ${PaginationPages.displayName}`,
    );
  }

  // The scheme is inferred from the child rather than configured, since the two
  // schemes differ only in how they let the user reach a page
  const isPaged = childDisplayName === PaginationPages.displayName;
  const className = classNames(
    styles.pagination,
    isPaged && styles.paged,
    isDisabled && styles.disabled,
  );

  if (isPaged) {
    return (
      <nav aria-label={label} className={className}>
        {onFirst && (
          <PaginationJumpButton
            onPress={onFirst}
            isDisabled={!hasFirst || isDisabled}
          >
            First
          </PaginationJumpButton>
        )}
        <PaginationNavButton
          direction="previous"
          aria-label="Previous"
          onPress={onPrevious}
          isDisabled={!hasPrevious || isDisabled}
        />
        {cloneElement(children as ReactElement<PaginationPagesProps>, {
          isDisabled,
        })}
        <PaginationNavButton
          direction="next"
          aria-label="Next"
          onPress={onNext}
          isDisabled={!hasNext || isDisabled}
        />
        {onLast && (
          <PaginationJumpButton
            onPress={onLast}
            isDisabled={!hasLast || isDisabled}
          >
            Last
          </PaginationJumpButton>
        )}
      </nav>
    );
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

Pagination.Dropdown = PaginationDropdown;
Pagination.Pages = PaginationPages;
