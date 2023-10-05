import { useOverlayScrollbars } from "overlayscrollbars-react";
import { MutableRefObject, useLayoutEffect } from "react";

export function useScrollbar({
  navRef,
  containerRef,
}: {
  navRef: MutableRefObject<HTMLElement | null>;
  containerRef: MutableRefObject<HTMLElement | null>;
}) {
  const [initialize] = useOverlayScrollbars({
    options: {
      scrollbars: {
        visibility: "hidden",
      },
    },
    defer: false,
  });
  useLayoutEffect(() => {
    if (navRef.current && containerRef.current) {
      initialize({
        target: containerRef.current,
        elements: { viewport: navRef.current },
      });
    }
  }, [initialize, navRef, containerRef]);
}
