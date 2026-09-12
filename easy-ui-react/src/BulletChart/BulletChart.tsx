import React from "react";
import styles from "./BulletChart.module.scss";

export type BulletChartProps = {
  label: string;
  /** Finite, non-negative measure within the displayed scale; null is unavailable. */
  value: number | null;
  /** Target marker within the displayed scale. */
  target: number;
  /** Explicit upper bound. All measures share a zero baseline. */
  max: number;
  formatValue?: (value: number) => string;
  targetLabel?: string;
  emptyLabel?: string;
};

/** A compact measure and target on an explicit, zero-based scale. */
export function BulletChart({
  label,
  value,
  target,
  max,
  formatValue = String,
  targetLabel = "Target",
  emptyLabel = "No data",
}: BulletChartProps) {
  const validScale = Number.isFinite(max) && max > 0;
  const validTarget =
    validScale && Number.isFinite(target) && target >= 0 && target <= max;
  const validValue =
    validScale &&
    value !== null &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= max;
  const hasData = validTarget && validValue;
  return (
    <div className={styles.root}>
      <div className={styles.labels}>
        <span>{label}</span>
        <strong className={styles.value}>
          {validValue ? formatValue(value) : emptyLabel}
        </strong>
      </div>
      {hasData ? (
        <>
          <div
            className={styles.track}
            role="img"
            aria-label={`${label}: ${formatValue(value)}. ${targetLabel}: ${formatValue(target)}. ${formatValue(0)}–${formatValue(max)}.`}
          >
            <div
              className={styles.bar}
              style={{ width: `${(value / max) * 100}%` }}
            />
            <div
              className={styles.target}
              style={{ left: `${(target / max) * 100}%` }}
            />
          </div>
          <div className={styles.scale} aria-hidden="true">
            <span>{formatValue(0)}</span>
            <span>{formatValue(max)}</span>
          </div>
        </>
      ) : null}
      <div className={styles.caption}>
        {targetLabel}: {validTarget ? formatValue(target) : emptyLabel}
      </div>
    </div>
  );
}
