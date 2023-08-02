import { useOverlayScrollbars } from "overlayscrollbars-react";
import { MutableRefObject, useEffect } from "react";

/**
 * Attaches custom scrollbars to an overflow element.
 *
 * @param scrollRef Ref of element to scroll
 * @param theme Name of theme to apply—see styles/_scrollbars.scss
 */
export function useScrollbar(
  scrollRef: MutableRefObject<HTMLElement | null>,
  theme: string,
) {
  const [initialize] = useOverlayScrollbars({
    options: { scrollbars: { theme } },
    defer: false,
  });
  useEffect(() => {
    if (scrollRef.current) {
      initialize({ target: scrollRef.current });
    }
  }, [initialize, scrollRef]);
}
