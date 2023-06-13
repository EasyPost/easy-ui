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
export function useScrollbar(scrollRef: MutableRefObject<HTMLElement | null>) {
  const [initialize] = useOverlayScrollbars({
    options: {
      scrollbars: {
        theme: "ezui-os-theme-code-block",
      },
    },
    defer: false,
  });
  useEffect(() => {
    if (scrollRef.current) {
      const $pre = scrollRef.current.querySelector("pre");
      if ($pre) {
        initialize({
          target: scrollRef.current,
          elements: {
            viewport: $pre,
          },
        });
      }
    }
  }, [initialize, scrollRef]);
}
