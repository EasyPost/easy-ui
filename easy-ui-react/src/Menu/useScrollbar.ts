import { useOverlayScrollbars } from "overlayscrollbars-react";
import { MutableRefObject, useEffect } from "react";

/**
 * Attaches custom scrollbars to an overflow element.
 *
 * @privateRemarks
 * TODO: Figure out how to make this more generic
 *
 * @param scrollRef Ref of element to scroll
 */
export function useScrollbar(scrollRef: MutableRefObject<HTMLElement | null>) {
  const [initialize] = useOverlayScrollbars({
    options: {
      scrollbars: {
        theme: "ezui-os-theme-overlay",
      },
    },
    defer: false,
  });
  useEffect(() => {
    if (scrollRef.current) {
      initialize({ target: scrollRef.current });
    }
  }, [initialize, scrollRef]);
}
