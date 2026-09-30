import { EventListeners } from "overlayscrollbars";
import { useOverlayScrollbars } from "overlayscrollbars-react";
import { MutableRefObject, useEffect, useMemo } from "react";

/**
 * Attaches custom scrollbars to an overflow element.
 *
 * @param scrollRef Ref of element to scroll
 * @param theme Name of theme to apply—see styles/_scrollbars.scss
 * @param events OverlayScrollbars event listeners
 */
export function useScrollbar(
  scrollRef: MutableRefObject<HTMLElement | null>,
  theme: string,
  events?: EventListeners,
) {
  // Stable across renders, so OverlayScrollbars doesn't re-apply it each time.
  const options = useMemo(() => ({ scrollbars: { theme } }), [theme]);
  const [initialize] = useOverlayScrollbars({
    options,
    events,
    defer: false,
  });
  useEffect(() => {
    const el = scrollRef.current;
    // React Aria builds collections by rendering children into a detached
    // fragment owned by an inert document. Elements there have no
    // `defaultView`, which OverlayScrollbars dereferences, so skip those
    // passes and wait for the render into the live document.
    if (el && el.ownerDocument.defaultView) {
      initialize({ target: el });
    }
  }, [initialize, scrollRef]);
}
