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
    const $block = codeBlockRef.current;
    const $pre = $block?.querySelector("pre");
    if ($block && $pre) {
      initialize({ target: $block, elements: { viewport: $pre } });

      // Overlay Scrollbars assigns tabIndex to both the outer block and the
      // inner viewport which causes requiring double tabbing, which we don't
      // want. this removes it from the outer element making keyboard navigation
      // normal

      let innerTimeout: NodeJS.Timeout;
      const outerTimeout = setTimeout(() => {
        const ogTabIndex = $block.getAttribute("tabindex");
        if (ogTabIndex) {
          $block.removeAttribute("tabindex");
          innerTimeout = setTimeout(() => {
            $pre.setAttribute("tabindex", ogTabIndex);
          });
        }
      });

      return () => {
        if (outerTimeout) {
          clearTimeout(outerTimeout);
        }
        if (innerTimeout) {
          clearTimeout(innerTimeout);
        }
      };
    }
  }, [initialize, codeBlockRef]);
}
