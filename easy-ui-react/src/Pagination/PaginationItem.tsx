import React, { ReactNode } from "react";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { UnstyledButton } from "../UnstyledButton";
import { IconSymbol } from "../types";
import { classNames } from "../utilities/css";
import type { PaginationSize } from "./Pagination";
import styles from "./Pagination.module.scss";

export type PaginationItemProps = {
  /** Accessible label for the item. */
  "aria-label"?: string;
  /** Icon to render instead of text content (used by the nav buttons). */
  symbol?: IconSymbol;
  /** Text content to render (used by page numbers and First/Last). */
  children?: ReactNode;
  /**
   * Whether the item represents the current page. Also sets
   * `aria-current="page"`.
   */
  isSelected?: boolean;
  /** Whether the item is disabled. */
  isDisabled?: boolean;
  /** Callback when the item is pressed. */
  onPress?: () => void;
  /** Size of the item, matching the parent `Pagination` size. */
  size?: PaginationSize;
};

/**
 * A single interactive item within a numbered `<Pagination />` — a page
 * number, a First/Last jump, or a previous/next arrow. Internal to
 * `Pagination`; not exported from the package.
 */
export function PaginationItem(props: PaginationItemProps) {
  const {
    symbol,
    children,
    isSelected = false,
    isDisabled = false,
    onPress,
    size = "md",
    ...restProps
  } = props;

  const className = classNames(
    styles.item,
    isSelected && styles.selected,
    size === "sm" && styles.itemSm,
  );

  // Icons inherit the button's `currentColor` (set in CSS per state); text needs
  // an explicit color token so the current page reads white on its filled fill.
  const textColor = isDisabled
    ? "neutral.400"
    : isSelected
      ? "neutral.000"
      : "primary.700";

  return (
    <UnstyledButton
      {...restProps}
      aria-current={isSelected ? "page" : undefined}
      className={className}
      isDisabled={isDisabled}
      onPress={onPress}
    >
      {symbol ? (
        <Icon symbol={symbol} size={size} />
      ) : (
        <Text variant={size === "sm" ? "body2" : "body1"} color={textColor}>
          {children}
        </Text>
      )}
    </UnstyledButton>
  );
}
