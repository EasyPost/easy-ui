import { RefObject, useEffect, useState } from "react";

/**
 * Detects when an element is intersecting with a scroll root.
 *
 * @param targetRef The target element to observe
 * @param scrollRef The scroll root to check against
 * @returns when element is intersecting
 */
export function useIntersectionDetection(
  targetRef: RefObject<HTMLDivElement>,
  scrollRef: RefObject<HTMLDivElement>,
) {
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (!targetRef.current || !scrollRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      { root: scrollRef.current },
    );

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [targetRef, scrollRef]);

  return isStuck;
}
