import React from "react";
import { useProgressBar } from "react-aria";
import { Text } from "../Text";
import { getComponentToken } from "../utilities/css";
import styles from "./ActivityTray.module.scss";

export type ActivityTrayProgressProps = {
  /** Units of work finished. */
  completed: number;
  /** Total units of work. */
  total: number;
  /** What the counts count, e.g. "labels". */
  unit?: string;
  /** `id` of the row title, which names this progress bar. */
  labelId: string;
};

/**
 * A linear determinate progress bar for a task row.
 *
 * @privateRemarks
 * Easy UI has no `ProgressBar` component—`Spinner` is the only progress
 * primitive and it's radial, which doesn't fit a one-line row. This bar is
 * deliberately private to `ActivityTray` so the eventual public `ProgressBar` API
 * gets designed on its own terms rather than reverse-engineered from this one
 * consumer. See documentation/specs/ActivityTray.md.
 */
export function ActivityTrayProgress(props: ActivityTrayProgressProps) {
  const { completed, total, unit, labelId } = props;

  // The human phrasing, used for both the visible counter and `aria-valuetext`,
  // so a screen reader says "127 of 250 labels" rather than "51 percent".
  const valueLabel = unit
    ? `${completed} of ${total} ${unit}`
    : `${completed} of ${total}`;

  const { progressBarProps } = useProgressBar({
    value: completed,
    minValue: 0,
    // `maxValue` is the unit count, not 100, so `aria-valuenow` is the real
    // number of finished units.
    maxValue: total,
    valueLabel,
    "aria-labelledby": labelId,
  });

  const percent =
    total > 0 ? Math.min(100, Math.max(0, (completed / total) * 100)) : 0;

  return (
    <div className={styles.progress}>
      <div
        {...progressBarProps}
        className={styles.progressTrack}
        style={getComponentToken(
          "activity-tray",
          "progress.fill",
          `${percent}%`,
        )}
      >
        <div className={styles.progressFill} />
      </div>
      {/* Tabular figures keep the counter from jittering as digits change. */}
      <Text
        variant="caption"
        color="neutral.600"
        fontVariantNumeric="tabular-nums"
        whiteSpace="nowrap"
      >
        {valueLabel}
      </Text>
    </div>
  );
}
