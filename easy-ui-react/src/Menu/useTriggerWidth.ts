import { useResizeObserver } from "@react-aria/utils";
import { MutableRefObject, useState } from "react";

export function useTriggerWidth(
  triggerRef: MutableRefObject<HTMLElement | null>,
) {
  const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
  useResizeObserver({
    ref: triggerRef,
    onResize: () => {
      if (triggerRef.current) {
        const { width } = triggerRef.current.getBoundingClientRect();
        setTriggerWidth(width);
      }
    },
  });
  return triggerWidth;
}
