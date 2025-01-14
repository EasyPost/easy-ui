import { RefObject, useEffect, useState } from "react";

export function useElementWidth(elementRef: RefObject<HTMLDivElement>) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const trigger = elementRef.current;
    if (!trigger) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.target.clientWidth);
      }
    });

    observer.observe(trigger);
    return () => {
      observer.unobserve(trigger);
    };
  }, [elementRef]);

  return width;
}
