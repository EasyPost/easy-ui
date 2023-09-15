import React, { MutableRefObject, useCallback, useRef } from "react";
import { useIntersectionDetection } from "../Modal/useIntersectionDetection";
import { classNames } from "../utilities/css";

import styles from "./useEdgeInterceptors.module.scss";

/**
 * Provides elements to render for detecting when the edges within a container
 * are intersected (stuck), while also returning what edges are intersected.
 *
 * @param containerRef Container element of edges
 * @returns elements to render and what edges are intersected
 */
export function useEdgeInterceptors(
  containerRef: MutableRefObject<HTMLDivElement | null>,
) {
  const topInterceptorRef = useRef<HTMLDivElement | null>(null);
  const bottomInterceptorRef = useRef<HTMLDivElement | null>(null);
  const leftInterceptorRef = useRef<HTMLDivElement | null>(null);
  const rightInterceptorRef = useRef<HTMLDivElement | null>(null);
  const isTopEdgeUnderScroll = useIntersectionDetection(
    topInterceptorRef,
    containerRef,
  );
  const isBottomEdgeUnderScroll = useIntersectionDetection(
    bottomInterceptorRef,
    containerRef,
  );
  const isLeftEdgeUnderScroll = useIntersectionDetection(
    leftInterceptorRef,
    containerRef,
  );
  const isRightEdgeUnderScroll = useIntersectionDetection(
    rightInterceptorRef,
    containerRef,
  );
  const renderInterceptors = useCallback(() => {
    return (
      <>
        <div
          ref={topInterceptorRef}
          className={classNames(styles.interceptor, styles.top)}
        />
        <div
          ref={bottomInterceptorRef}
          className={classNames(styles.interceptor, styles.bottom)}
        />
        <div
          ref={leftInterceptorRef}
          className={classNames(styles.interceptor, styles.left)}
        />
        <div
          ref={rightInterceptorRef}
          className={classNames(styles.interceptor, styles.right)}
        />
      </>
    );
  }, []);
  return [
    renderInterceptors,
    {
      isTopEdgeUnderScroll,
      isBottomEdgeUnderScroll,
      isLeftEdgeUnderScroll,
      isRightEdgeUnderScroll,
    },
  ] as const;
}
