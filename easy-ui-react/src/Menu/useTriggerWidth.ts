import { useResizeObserver } from "@react-aria/utils";
import { MutableRefObject, useEffect, useRef, useState } from "react";

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

  // Ensure the trigger width sizing is run at least once regardless of whether
  // or not the resize event handlers fire
  const initialRef = useRef(false);
  useEffect(() => {
    if (triggerRef.current && !initialRef.current) {
      const { width } = triggerRef.current.getBoundingClientRect();
      setTriggerWidth(width);
      initialRef.current = true;
    }
  }, [triggerRef]);

  return triggerWidth;
}
