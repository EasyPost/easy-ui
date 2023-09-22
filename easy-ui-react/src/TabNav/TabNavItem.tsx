import { useResizeObserver } from "@react-aria/utils";
import React, {
  ComponentProps,
  ElementType,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useHover } from "react-aria";
import { classNames } from "../utilities/css";
import { TabNavContextType, useTabNav } from "./context";

import styles from "./TabNavItem.module.scss";

export const SCROLL_PADDING = 32;

type TabNavItemProps<T extends ElementType = "a"> = ComponentProps<T> & {
  /** Override the default element with a custom one to provide unique behavior. Useful for client-side navigation link components in app frameworks. */
  as?: T;

  /** The children of the <TabNav.Item> element. */
  children: ReactNode;

  /** Sets the <TavNav.Item> as the current page and adds `aria-current="page"`. */
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

/**
 * Sets the width and position for the indicator (underline) based on the size
 * of the currently selected tab.
 */
function useIndicatorSizing({
  isCurrentPage,
  itemRef,
  setIndicatorPosition,
  setIndicatorWidth,
}: TabNavContextType & {
  isCurrentPage: boolean;
  itemRef: MutableRefObject<HTMLElement | null>;
}) {
  const handleSizing = useCallback(() => {
    if (isCurrentPage && itemRef.current) {
      const $item = itemRef.current;
      const measurements = getSharedMeasurements($item);
      setIndicatorWidth(measurements.itemWidth);
      setIndicatorPosition(measurements.itemPosition);
    }
  }, [isCurrentPage, itemRef, setIndicatorPosition, setIndicatorWidth]);

  useEffect(() => {
    handleSizing();
  }, [handleSizing]);

  useResizeObserver({
    ref: itemRef,
    onResize: handleSizing,
  });
}

/**
 * Manages scrolling the tab into view if it's scrolled out of the horizontal
 * line of sight.
 */
function useScrollIntoViewIfNeeded({
  isCurrentPage,
  itemRef,
}: {
  isCurrentPage: boolean;
  itemRef: MutableRefObject<HTMLElement | null>;
}) {
  const handleScroll = useCallback(() => {
    if (isCurrentPage && itemRef.current) {
      const $item = itemRef.current;
      const { $nav, navRect, itemPosition, itemWidth, navScrollLeft } =
        getSharedMeasurements($item);

      const navWidth = navRect.width;

      const itemEndEdge = itemPosition + itemWidth + SCROLL_PADDING;
      const navEndEdge = navScrollLeft + navWidth;

      const itemStartEdge = itemPosition - SCROLL_PADDING;
      const navStartEdge = navScrollLeft;

      if (itemEndEdge > navEndEdge) {
        $nav.scrollTo({
          left: itemPosition - (navWidth - itemWidth) + SCROLL_PADDING,
        });
      }

      if (itemStartEdge < navStartEdge) {
        $nav.scrollTo({ left: itemPosition - SCROLL_PADDING });
      }
    }
  }, [isCurrentPage, itemRef]);

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  useResizeObserver({
    ref: itemRef,
    onResize: handleScroll,
  });
}

function getSharedMeasurements($item: HTMLElement) {
  const $nav = $item.closest("nav");
  if (!$nav) {
    throw new Error("Unable to find parent nav element from tab item");
  }

  const itemRect = $item.getBoundingClientRect();
  const navRect = $nav.getBoundingClientRect();
  const navScrollLeft = $nav.scrollLeft;

  const itemWidth = itemRect.width;
  const itemPosition = navScrollLeft + (itemRect.x - navRect.x);

  return {
    $nav,
    itemRect,
    navRect,
    navScrollLeft,
    itemWidth,
    itemPosition,
  };
}
