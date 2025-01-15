import { useResizeObserver } from "@react-aria/utils";
import { RefObject, useState } from "react";

export function useElementWidth(elementRef: RefObject<HTMLDivElement>) {
  const [width, setWidth] = useState(0);

  useResizeObserver({
    ref: elementRef,
    onResize() {
      if (elementRef.current) {
        const { width } = elementRef.current.getBoundingClientRect();
        setWidth(width);
      }
    },
  });

  return width;
}
