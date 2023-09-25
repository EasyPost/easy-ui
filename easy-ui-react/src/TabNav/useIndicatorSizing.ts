import { useResizeObserver } from "@react-aria/utils";
import { MutableRefObject, useCallback, useEffect } from "react";
import { TabNavContextType } from "./context";
import { getSharedMeasurementsForTabNavItem } from "./util";

/**
 * Sets the width and position for the indicator (underline) based on the size
 * of the currently selected tab.
 */
export function useIndicatorSizing({
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
      const { itemWidth, itemPosition } =
        getSharedMeasurementsForTabNavItem($item);
      setIndicatorWidth(itemWidth);
      setIndicatorPosition(itemPosition);
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
