import React, { ComponentProps, ElementType, ReactNode, useRef } from "react";
import { useHover } from "react-aria";
import { classNames } from "../utilities/css";
import { useTabNav } from "./context";
import { useIndicatorSizing } from "./useIndicatorSizing";
import { useScrollIntoViewIfNeeded } from "./useScrollIntoViewIfNeeded";

import styles from "./TabNavItem.module.scss";

export const SCROLL_PADDING = 32;

type TabNavItemProps<T extends ElementType = "a"> = ComponentProps<T> & {
  /** Override the default element with a custom one to provide unique behavior. Useful for client-side navigation link components in app frameworks. */
  as?: T;

  /** The children of the `<TabNav.Item>` element. */
  children: ReactNode;

  /** Sets the `<TavNav.Item>` as the current page and adds `aria-current="page"`. */
  isCurrentPage?: boolean;
};

export function TabNavItem<T extends ElementType = "a">(
  props: TabNavItemProps<T>,
) {
  const { as: As = "a", children, isCurrentPage, ...linkProps } = props;
  const { setIndicatorWidth, setIndicatorPosition } = useTabNav();

  const ref = useRef<HTMLElement | null>(null);
  const { isHovered, hoverProps } = useHover({});

  useIndicatorSizing({
    itemRef: ref,
    isCurrentPage,
    setIndicatorPosition,
    setIndicatorWidth,
  });

  useScrollIntoViewIfNeeded({ itemRef: ref, isCurrentPage });

  const className = classNames(
    styles.TabNavItem,
    isCurrentPage && styles.currentPage,
    isHovered && styles.hovered,
  );

  return (
    <li className={className}>
      <As
        {...hoverProps}
        {...linkProps}
        aria-current={isCurrentPage ? "page" : undefined}
        className={styles.link}
      >
        <span ref={ref} className={styles.text}>
          {children}
        </span>
      </As>
    </li>
  );
}
