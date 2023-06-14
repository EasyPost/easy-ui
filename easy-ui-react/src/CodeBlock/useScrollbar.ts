import { useOverlayScrollbars } from "overlayscrollbars-react";
import { MutableRefObject, useEffect } from "react";

/**
 * Attaches custom scrollbars to a code block element.
 *
 * @privateRemarks
 * TODO: Figure out how to make this more generic
 *       then consolidate with the menu scrollbar hook
 *
 * @param scrollRef Ref of element to scroll
 */
export function useScrollbar(
  codeBlockRef: MutableRefObject<HTMLDivElement | null>,
) {
  const [initialize] = useOverlayScrollbars({
    options: {
      scrollbars: {
        theme: "ezui-os-theme-code-block",
      },
    },
    defer: false,
  });
  useEffect(() => {
    if (codeBlockRef.current) {
      initialize({
        target: codeBlockRef.current,
        elements: {
          viewport: codeBlockRef.current.querySelector("pre"),
        },
      });
    }
  }, [initialize, codeBlockRef]);
}
