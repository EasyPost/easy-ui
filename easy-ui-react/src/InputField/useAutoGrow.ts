import { useResizeObserver } from "@react-aria/utils";
import { RefObject, useCallback, useRef } from "react";
import { useIsomorphicLayoutEffect } from "../utilities/react";

type UseAutoGrowOptions = {
  /** Whether auto-grow is on. */
  isEnabled: boolean;
  /** Most lines to grow to before scrolling. */
  maxRows?: number;
  /** The controlled value, so the height follows programmatic changes. */
  value?: string;
};

/**
 * Sizes a textarea to fit its content, from its `rows` up to `maxRows` lines,
 * after which it holds its height and scrolls.
 *
 * Measures by collapsing the height to `auto` (so `rows` and `min-height` set
 * the floor) and reading `scrollHeight`. Runs on every input, on controlled
 * value changes, and when the textarea's width changes, since rewrapping
 * changes the line count.
 */
export function useAutoGrow(
  ref: RefObject<HTMLTextAreaElement | null>,
  { isEnabled, maxRows, value }: UseAutoGrowOptions,
) {
  const resize = useCallback(() => {
    const el = ref.current;
    if (!isEnabled || !el) {
      return;
    }
    const style = window.getComputedStyle(el);
    const paddingY = px(style.paddingTop) + px(style.paddingBottom);
    const borderY = px(style.borderTopWidth) + px(style.borderBottomWidth);
    const isBorderBox = style.boxSizing === "border-box";
    // scrollHeight includes padding but not border.
    const chrome = isBorderBox ? borderY : -paddingY;

    el.style.height = "auto";
    const contentHeight = el.scrollHeight + chrome;

    let maxHeight = Infinity;
    if (maxRows !== undefined) {
      const lineHeight =
        px(style.lineHeight) || px(style.fontSize) * NORMAL_LINE_HEIGHT;
      maxHeight = lineHeight * maxRows + (isBorderBox ? paddingY + borderY : 0);
    }

    const isOverflowing = contentHeight > maxHeight;
    el.style.height = `${Math.min(contentHeight, maxHeight)}px`;
    el.style.overflowY = isOverflowing ? "auto" : "hidden";
  }, [ref, isEnabled, maxRows]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!isEnabled || !el) {
      return;
    }
    resize();
    el.addEventListener("input", resize);
    return () => {
      el.removeEventListener("input", resize);
      el.style.height = "";
      el.style.overflowY = "";
    };
  }, [ref, isEnabled, resize, value]);

  // Only width changes rewrap text; reacting to height would re-trigger on the
  // height this hook just set.
  const widthRef = useRef<number | null>(null);
  useResizeObserver({
    ref,
    onResize: () => {
      const width = ref.current?.offsetWidth ?? null;
      if (width !== widthRef.current) {
        widthRef.current = width;
        resize();
      }
    },
  });
}

/** Browsers' `line-height: normal` is roughly this multiple of font size. */
const NORMAL_LINE_HEIGHT = 1.2;

function px(value: string) {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}
