import React from "react";
import {
  isDomain,
  markerPoints,
  MarkerMode,
  PlotPoint,
  position,
} from "../visualization/geometry";
import { usePlotWidth } from "../visualization/usePlotWidth";
import styles from "./CompactTimeSeries.module.scss";

export type CompactTimeSeriesSeries = {
  id: string;
  label: string;
  /** Strictly increasing timestamps in milliseconds; null preserves a missing bucket. */
  points: readonly { time: number; value: number | null }[];
};
export type CompactTimeSeriesProps = {
  label: string;
  /** Period, units, coverage and interpretation of the observations. */
  description: string;
  /** One to three series. Applications own aggregation and ordering. */
  series: readonly CompactTimeSeriesSeries[];
  /** Explicit vertical scale. Use identical domains for comparable panels. */
  domain: readonly [number, number];
  /** Optional shared time domain; otherwise uses the supplied timestamps. */
  timeDomain?: readonly [number, number];
  /** Include an explicit timezone in the formatter used by the application. */
  formatTime: (timestamp: number) => string;
  formatValue?: (value: number) => string;
  reference?: { value: number; label: string };
  markers?: MarkerMode;
  interpolation?: "linear" | "step-after";
  height?: number;
  emptyLabel?: string;
  invalidDataLabel?: string;
  missingValueLabel?: string;
  dataTableLabel?: string;
  columnLabels?: readonly [string, string, string];
};

/** A small native time plot with sparse axes and exact, accessible observations. */
export function CompactTimeSeries({
  label,
  description,
  series,
  domain,
  timeDomain,
  formatTime,
  formatValue = String,
  reference,
  markers = "none",
  interpolation = "linear",
  height = 160,
  emptyLabel = "No data",
  invalidDataLabel = "Cannot plot these observations on the supplied scales",
  missingValueLabel = "Unavailable",
  dataTableLabel = "View data",
  columnLabels = ["Series", "Time", "Value"],
}: CompactTimeSeriesProps) {
  const { ref, width } = usePlotWidth();
  const times = series.flatMap((item) =>
    item.points.map((point) => point.time),
  );
  let first = Infinity;
  let last = -Infinity;
  for (const time of times)
    if (Number.isFinite(time)) {
      first = Math.min(first, time);
      last = Math.max(last, time);
    }
  const xDomain = timeDomain ?? [first, last];
  const valid =
    series.length > 0 &&
    series.length <= 3 &&
    isDomain(domain) &&
    xDomain.every(Number.isFinite) &&
    xDomain[0] <= xDomain[1] &&
    (!reference ||
      (Number.isFinite(reference.value) &&
        reference.value >= domain[0] &&
        reference.value <= domain[1])) &&
    series.every((item) =>
      item.points.every(
        (point, index) =>
          Number.isFinite(point.time) &&
          point.time >= xDomain[0] &&
          point.time <= xDomain[1] &&
          (!index || point.time > item.points[index - 1].time) &&
          (point.value === null ||
            !Number.isFinite(point.value) ||
            (point.value >= domain[0] && point.value <= domain[1])),
      ),
    );
  const plotHeight = Math.max(140, Math.min(280, height));
  const left = 58,
    right = width - 12,
    top = 14,
    bottom = plotHeight - 30;
  const x = (value: number) =>
    left + position(value, xDomain as [number, number]) * (right - left);
  const y = (value: number) =>
    bottom - position(value, domain) * (bottom - top);
  const plots = valid
    ? series.map((item) => {
        const segments: PlotPoint[][] = [];
        let segment: PlotPoint[] = [];
        for (const point of item.points) {
          if (point.value === null || !Number.isFinite(point.value)) {
            segment = [];
            continue;
          }
          if (!segment.length) segments.push(segment);
          segment.push([x(point.time), y(point.value)]);
        }
        return segments;
      })
    : [];
  const hasData = plots.some((segments) => segments.length);
  const tickValues = [domain[0], domain[0] / 2 + domain[1] / 2, domain[1]];
  return (
    <figure className={styles.root} aria-label={label}>
      <figcaption>
        <strong>{label}</strong>
        <p className={styles.description}>{description}</p>
      </figcaption>
      <div ref={ref}>
        {hasData ? (
          <svg
            className={styles.plot}
            viewBox={`0 0 ${width} ${plotHeight}`}
            role="img"
            aria-label={description}
          >
            {tickValues.map((value, index) => (
              <g key={index}>
                <line
                  className={styles.grid}
                  x1={left}
                  x2={right}
                  y1={y(value)}
                  y2={y(value)}
                />
                <text
                  className={styles.tick}
                  x={left - 8}
                  y={y(value) + 4}
                  textAnchor="end"
                >
                  {formatValue(value)}
                </text>
              </g>
            ))}
            {reference && (
              <line
                className={styles.reference}
                x1={left}
                x2={right}
                y1={y(reference.value)}
                y2={y(reference.value)}
              />
            )}
            {plots.map((segments, index) => (
              <g
                key={series[index].id}
                className={
                  [styles.primary, styles.secondary, styles.tertiary][index]
                }
              >
                {segments.map((points, segmentIndex) =>
                  points.length === 1 ? (
                    <circle
                      key={segmentIndex}
                      cx={points[0][0]}
                      cy={points[0][1]}
                      r={3}
                    />
                  ) : (
                    <path
                      key={segmentIndex}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeDasharray={
                        index === 1 ? "6 3" : index === 2 ? "2 3" : undefined
                      }
                      d={points
                        .map(([px, py], i) =>
                          i === 0
                            ? `M${px},${py}`
                            : interpolation === "step-after"
                              ? `H${px}V${py}`
                              : `L${px},${py}`,
                        )
                        .join(" ")}
                    />
                  ),
                )}
                {markerPoints(segments, markers).map(([px, py], i) => (
                  <circle key={`marker-${i}`} cx={px} cy={py} r={3} />
                ))}
              </g>
            ))}
            <text
              className={styles.tick}
              x={xDomain[0] === xDomain[1] ? (left + right) / 2 : left}
              y={plotHeight - 6}
              textAnchor={xDomain[0] === xDomain[1] ? "middle" : "start"}
            >
              {formatTime(xDomain[0])}
            </text>
            {xDomain[0] !== xDomain[1] && (
              <text
                className={styles.tick}
                x={right}
                y={plotHeight - 6}
                textAnchor="end"
              >
                {formatTime(xDomain[1])}
              </text>
            )}
          </svg>
        ) : (
          <p className={styles.empty}>
            {times.length && !valid ? invalidDataLabel : emptyLabel}
          </p>
        )}
      </div>
      {hasData && (
        <ul className={styles.legend} role="list">
          {series.map((item, index) => (
            <li key={item.id}>
              <span
                className={`${styles.swatch} ${[styles.primary, styles.secondary, styles.tertiary][index]}`}
                style={{
                  borderTopStyle:
                    index === 0 ? "solid" : index === 1 ? "dashed" : "dotted",
                }}
                aria-hidden="true"
              />{" "}
              {item.label}
            </li>
          ))}
        </ul>
      )}
      {reference && (
        <p className={styles.description}>
          {reference.label}:{" "}
          {Number.isFinite(reference.value)
            ? formatValue(reference.value)
            : missingValueLabel}
        </p>
      )}
      {series.some((item) => item.points.length) && (
        <details className={styles.details}>
          <summary>{dataTableLabel}</summary>
          <div
            className={styles.tableScroll}
            tabIndex={0}
            role="region"
            aria-label={dataTableLabel}
          >
            <table>
              <thead>
                <tr>
                  {columnLabels.map((column, index) => (
                    <th scope="col" key={index}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {series.flatMap((item) =>
                  item.points.map((point, index) => (
                    <tr key={`${item.id}-${index}`}>
                      <th scope="row">{item.label}</th>
                      <td>
                        {Number.isFinite(point.time)
                          ? formatTime(point.time)
                          : missingValueLabel}
                      </td>
                      <td>
                        {point.value === null || !Number.isFinite(point.value)
                          ? missingValueLabel
                          : formatValue(point.value)}
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </figure>
  );
}
