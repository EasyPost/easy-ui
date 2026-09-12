import React from "react";
import { isDomain, position } from "../visualization/geometry";
import styles from "./RangePlot.module.scss";

export type RangePlotProps = {
  label: string;
  description: string;
  /** Explicit scale; may include negative values. */
  domain: readonly [number, number];
  /** Named benchmarks or observations; null is unavailable. */
  points: readonly { id: string; label: string; value: number | null }[];
  /** Bounds are supplied by the application, not calculated or inferred. */
  interval?: { from: number; to: number; label: string };
  formatValue?: (value: number) => string;
  emptyLabel?: string;
  scaleLabel?: string;
};

/** Named points and an optional interval, aligned to the same native CSS scale. */
export function RangePlot({
  label,
  description,
  domain,
  points,
  interval,
  formatValue = String,
  emptyLabel = "No data",
  scaleLabel = "Scale",
}: RangePlotProps) {
  const valid = isDomain(domain);
  const inDomain = (value: number | null): value is number =>
    valid &&
    value !== null &&
    Number.isFinite(value) &&
    value >= domain[0] &&
    value <= domain[1];
  const validInterval =
    interval &&
    inDomain(interval.from) &&
    inDomain(interval.to) &&
    interval.to >= interval.from;
  const offset = (value: number) => `${position(value, domain) * 100}%`;
  return (
    <figure className={styles.root} aria-label={label}>
      <figcaption>
        <strong>{label}</strong>
        <p className={styles.description}>{description}</p>
      </figcaption>
      {!valid || (!points.length && !interval) ? (
        <p>{emptyLabel}</p>
      ) : (
        <>
          <ul className={styles.rows} role="list" aria-label={label}>
            {interval && (
              <li className={styles.row}>
                <span>{interval.label}</span>
                <span className={styles.track} aria-hidden="true">
                  {validInterval &&
                    (interval.from === interval.to ? (
                      <span
                        className={styles.bound}
                        style={{ left: offset(interval.from) }}
                      />
                    ) : (
                      <span
                        className={styles.interval}
                        style={{
                          left: offset(interval.from),
                          width: `${(position(interval.to, domain) - position(interval.from, domain)) * 100}%`,
                        }}
                      />
                    ))}
                </span>
                <span className={styles.value}>
                  {validInterval
                    ? interval.from === interval.to
                      ? formatValue(interval.from)
                      : `${formatValue(interval.from)}–${formatValue(interval.to)}`
                    : emptyLabel}
                </span>
              </li>
            )}
            {points.map((point) => (
              <li key={point.id} className={styles.row}>
                <span>{point.label}</span>
                <span className={styles.track} aria-hidden="true">
                  {inDomain(point.value) && (
                    <span
                      className={styles.point}
                      style={{ left: offset(point.value) }}
                    />
                  )}
                </span>
                <span className={styles.value}>
                  {inDomain(point.value)
                    ? formatValue(point.value)
                    : emptyLabel}
                </span>
              </li>
            ))}
          </ul>
          <div className={styles.row}>
            <span className={styles.description}>{scaleLabel}</span>
            <span className={styles.axis}>
              <span>{formatValue(domain[0])}</span>
              <span>{formatValue(domain[1])}</span>
            </span>
            <span />
          </div>
        </>
      )}
    </figure>
  );
}
