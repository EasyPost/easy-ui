import ChevronRight400 from "@easypost/easy-ui-icons/ChevronRight400";
import React from "react";
import { Icon } from "../Icon";
import { UnstyledButton, UnstyledButtonProps } from "../UnstyledButton";
import { classNames } from "../utilities/css";
import type { PaginationSize } from "./Pagination";

import styles from "./Pagination.module.scss";

type PaginationNavButtonProps = Omit<UnstyledButtonProps, "children"> & {
  direction: "previous" | "next";
  size?: PaginationSize;
};

/**
 * Single-chevron button for stepping one page at a time within the numbered
 * pagination scheme.
 */
export function PaginationNavButton(props: PaginationNavButtonProps) {
  const { direction, size = "md", ...buttonProps } = props;
  // The chevron is sized in React rather than CSS, so it has to branch on the
  // size the rest of the scheme reads from component tokens
  const iconSize = size === "sm" ? "xs" : "md";
  return (
    <UnstyledButton
      {...buttonProps}
      className={classNames(
        styles.pagedButton,
        styles.navButton,
        direction === "previous" && styles.navButtonPrevious,
      )}
    >
      <Icon symbol={ChevronRight400} size={iconSize} />
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
  // Takes the buttons' box and type so it lines up with them, but none of their
  // chrome or affordances, since there's nothing here to press
  return (
    <span aria-hidden="true" className={styles.pagedButton}>
      &hellip;
    </span>
  );
}
