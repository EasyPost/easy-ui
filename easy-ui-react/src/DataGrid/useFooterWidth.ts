import { useResizeObserver } from "@react-aria/utils";
import {
  CSSProperties,
  MutableRefObject,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { getComponentToken } from "../utilities/css";

/**
 * Measures the visible width of the data grid's scroll container so that the
 * footer can be pinned horizontally while the grid scrolls sideways.
 *
 * @remarks
 * The footer is a sticky child of the inner container, which is as wide as the
 * table itself. Sticking to the left edge of the scroll port therefore requires
 * knowing how wide that scroll port is, which CSS alone can't express from
 * inside the scrolled content.
 *
 * @param containerRef Scroll container element of the data grid
 * @param isEnabled Whether a footer is being rendered
 * @returns style holding the measured footer width
 */
export function useFooterWidth({
  containerRef,
  isEnabled,
}: {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  isEnabled: boolean;
}) {
  const [footerWidth, setFooterWidth] = useState<number | null>(null);

  const measure = useCallback(() => {
    const $container = containerRef.current;
    if (!isEnabled || !$container) {
      return;
    }
    // `clientWidth` excludes the vertical scrollbar, keeping the footer from
    // sitting underneath it
    const width = $container.clientWidth;
    setFooterWidth((prevWidth) => (prevWidth === width ? prevWidth : width));
  }, [containerRef, isEnabled]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useResizeObserver({ ref: containerRef, onResize: measure });

  const footerStyle = useMemo(() => {
    return {
      ...getComponentToken(
        "data-grid",
        "footer-width",
        footerWidth === null ? "100%" : `${footerWidth}px`,
      ),
    } as CSSProperties;
  }, [footerWidth]);

  return { footerStyle };
}
