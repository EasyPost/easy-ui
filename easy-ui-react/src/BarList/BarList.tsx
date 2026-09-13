import React from "react";
import styles from "./BarList.module.scss";

/** One category in a compact comparison. */
export type BarListItem = {
  /** Stable application identifier used as the row key. */
  id: string;
  /** Visible category name. */
  label: string;
  /** Finite, non-negative magnitude. null means unavailable. */
  value: number | null;
};

/** Ordered categories compared on one zero-based scale. */
export type BarListProps = {
  /** Name of the comparison, including period and units where relevant. */
  label: string;
  /** Display order is preserved; applications own ranking and aggregation. */
  data: readonly BarListItem[];
  /** Formats valid magnitudes, including units; defaults to String. */
  formatValue?: (value: number) => string;
  /** Text for an empty list or invalid/unavailable value; defaults to "No data". */
  emptyLabel?: string;
};

/** A compact, zero-based comparison with exact values in a semantic list. */
export function BarList({
  label,
  data,
  formatValue = String,
  emptyLabel = "No data",
}: BarListProps) {
  let maximum = 0;
  for (const { value } of data) {
    if (isMagnitude(value)) maximum = Math.max(maximum, value);
  }
  return (
    <div className={styles.root}>
      {data.length ? (
        <ul role="list" className={styles.list} aria-label={label}>
          {data.map(({ id, label: itemLabel, value }) => (
            <li key={id} className={styles.item}>
              <div className={styles.labels}>
                <span>{itemLabel}</span>
                <span className={styles.value}>
                  {isMagnitude(value) ? formatValue(value) : emptyLabel}
                </span>
              </div>
              <div className={styles.track} aria-hidden="true">
                {isMagnitude(value) && (
                  <div
                    className={styles.bar}
                    style={{
                      width: `${maximum ? (value / maximum) * 100 : 0}%`,
                    }}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p aria-label={label}>{emptyLabel}</p>
      )}
    </div>
  );
}

function isMagnitude(value: number | null): value is number {
  return value !== null && Number.isFinite(value) && value >= 0;
}
