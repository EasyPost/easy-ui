import React, { ReactElement, cloneElement } from "react";
import KeyboardDoubleArrowRight from "@easypost/easy-ui-icons/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeft from "@easypost/easy-ui-icons/KeyboardDoubleArrowLeft";
import { HorizontalStack } from "../HorizontalStack";
import { PaginationButton } from "./PaginationButton";
import {
  PaginationDropdown,
  PaginationDropdownProps,
} from "./PaginationDropdown";
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
   * Callback when previous button is clicked.
   */
  onPrevious?: () => void;
  /**
   * Callback when next button is clicked.
   */
  onNext?: () => void;
  /**
   * Accessible label for Pagination, used as the
   * aria-label.
   */
  label: string;
  /**
   * Whether the Pagination component should be disabled.
   */
  isDisabled?: boolean;
  /**
   * The children of `<Pagination />` component only
   * accept `<Pagination.Dropdown />`.
   */
  children?: ReactElement<PaginationDropdownProps>;
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
 * _Disabled:_
 * ```tsx
 * <Pagination label="Example Disabled" isDisabled />
 * ```
 */
export function Pagination(props: PaginationProps) {
  const {
    hasPrevious = false,
    hasNext = false,
    onPrevious,
    onNext,
    label,
    isDisabled,
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
      <HorizontalStack>
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
