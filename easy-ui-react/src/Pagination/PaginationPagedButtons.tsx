import ChevronRight400 from "@easypost/easy-ui-icons/ChevronRight400";
import React from "react";
import { Icon } from "../Icon";
import { UnstyledButton, UnstyledButtonProps } from "../UnstyledButton";
import { classNames } from "../utilities/css";

import styles from "./Pagination.module.scss";

type PaginationNavButtonProps = Omit<UnstyledButtonProps, "children"> & {
  direction: "previous" | "next";
};

/**
 * Single-chevron button for stepping one page at a time within the numbered
 * pagination scheme.
 */
export function PaginationNavButton(props: PaginationNavButtonProps) {
  const { direction, ...buttonProps } = props;
  return (
    <UnstyledButton
      {...buttonProps}
      className={classNames(
        styles.pagedButton,
        styles.navButton,
        direction === "previous" && styles.navButtonPrevious,
      )}
    >
      <Icon symbol={ChevronRight400} size="xs" />
    </UnstyledButton>
  );
}

type PaginationJumpButtonProps = UnstyledButtonProps;

/**
 * Text button for jumping to the first or last page within the numbered
 * pagination scheme.
 */
export function PaginationJumpButton(props: PaginationJumpButtonProps) {
  const { children, ...buttonProps } = props;
  return (
    <UnstyledButton
      {...buttonProps}
      className={classNames(styles.pagedButton, styles.jumpButton)}
    >
      {children}
    </UnstyledButton>
  );
}

type PaginationPageButtonProps = Omit<UnstyledButtonProps, "children"> & {
  page: number;
  isCurrent: boolean;
};

/**
 * Button for a single page within the numbered pagination scheme.
 */
export function PaginationPageButton(props: PaginationPageButtonProps) {
  const { page, isCurrent, ...buttonProps } = props;
  return (
    <UnstyledButton
      {...buttonProps}
      aria-current={isCurrent ? "page" : undefined}
      className={classNames(
        styles.pagedButton,
        styles.pageButton,
        isCurrent && styles.pageButtonCurrent,
      )}
    >
      {page}
    </UnstyledButton>
  );
}

/**
 * Non-interactive marker standing in for a truncated run of pages.
 */
export function PaginationEllipsis() {
  return (
    <span
      aria-hidden="true"
      className={classNames(styles.pagedButton, styles.ellipsis)}
    >
      &hellip;
    </span>
  );
}
