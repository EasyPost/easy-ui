import React from "react";
import { markerPoints, MarkerMode } from "../visualization/geometry";
import styles from "./Sparkline.module.scss";

/** Equally spaced observations and the accessible description of their trend. */
export type SparklineProps = {
  /** Equally spaced observations. Use null for a missing bucket, never zero. */
  values: readonly (number | null)[];
  /** Describe the metric, period, trend, and any missing observations. */
  accessibilityLabel: string;
  /** Optional observation markers; existing unmarked lines remain the default. */
  markers?: MarkerMode;
};

const WIDTH = 160;
const HEIGHT = 40;
const PADDING = 4;

/**
 * A compact trend for equally spaced observations. Each sparkline scales to
 * its own extent; use a chart with labelled axes to compare magnitudes.
 */
export function Sparkline({
  values,
  accessibilityLabel,
  markers = "none",
}: SparklineProps) {
  const segments = getSegments(values);

  return (
    <svg
      className={styles.root}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={
        segments.length ? accessibilityLabel : `${accessibilityLabel}. No data.`
      }
      focusable="false"
    >
      {segments.map((points, index) =>
        points.length === 1 ? (
          <circle
            key={index}
            cx={points[0][0]}
            cy={points[0][1]}
            r={2}
            fill="currentColor"
          />
        ) : (
          <polyline
            key={index}
            points={points.map((point) => point.join(",")).join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ),
      )}
      {markerPoints(segments, markers).map(([x, y], index) => (
        <circle
          key={`marker-${index}`}
          cx={x}
          cy={y}
          r={2}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

function isObservation(value: number | null): value is number {
  return value !== null && Number.isFinite(value);
}

function getSegments(values: SparklineProps["values"]) {
  let min = Infinity;
  let max = -Infinity;
  for (const value of values) {
    if (isObservation(value)) {
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  }
  if (min === Infinity) return [];

  // Normalize first to avoid overflowing the extent for large finite values.
  const scale = Math.max(Math.abs(min), Math.abs(max)) || 1;
  const lower = min / scale;
  const range = max / scale - lower;
  const segments: [number, number][][] = [];
  let segment: [number, number][] = [];

  values.forEach((value, index) => {
    if (!isObservation(value)) {
      segment = [];
      return;
    }
    if (!segment.length) segments.push(segment);
    const x =
      values.length === 1
        ? WIDTH / 2
        : PADDING + (index / (values.length - 1)) * (WIDTH - PADDING * 2);
    const y =
      range === 0
        ? HEIGHT / 2
        : HEIGHT -
          PADDING -
          ((value / scale - lower) / range) * (HEIGHT - PADDING * 2);
    segment.push([x, y]);
  });
  return segments;
}
