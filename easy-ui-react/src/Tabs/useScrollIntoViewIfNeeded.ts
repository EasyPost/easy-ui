import { useResizeObserver } from "@react-aria/utils";
import { MutableRefObject, useCallback, useEffect } from "react";
import { getSharedMeasurementsForTabNavItem } from "./util";

export const SCROLL_PADDING = 24;

/**
 * Manages scrolling the tab into view if it's scrolled out of the horizontal
 * line of sight.
 */
export function useScrollIntoViewIfNeeded({
  isSelected,
  itemRef,
}: {
  isSelected: boolean;
  itemRef: MutableRefObject<HTMLElement | null>;
}) {
  const handleScroll = useCallback(() => {
    if (isSelected && itemRef.current) {
      const $item = itemRef.current;
      const { $nav, navRect, itemPosition, itemWidth, navScrollLeft } =
        getSharedMeasurementsForTabNavItem($item);

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
  }, [isSelected, itemRef]);

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  useResizeObserver({
    ref: itemRef,
    onResize: handleScroll,
  });
}
