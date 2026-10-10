import { clamp } from "@react-aria/utils";
import React, { ReactNode } from "react";
import { useProgressBar } from "react-aria";
import { Text } from "../Text";
import { ThemeColorAliases } from "../types";
import {
  classNames,
  getComponentThemeToken,
  getComponentToken,
} from "../utilities/css";
import styles from "./ProgressBar.module.scss";

export type ProgressBarProps = {
  /** The current value. Clamped to `minValue` and `maxValue`. */
  value: number;
  /**
   * The value the bar starts from.
   * @default 0
   */
  minValue?: number;
  /**
   * The value that fills the bar.
   * @default 100
   */
  maxValue?: number;
  /**
   * A visible label, rendered above the bar. Without one, name the bar with
   * `aria-label` or `aria-labelledby`.
   */
  label?: ReactNode;
  /**
   * Human-readable text for the current value, e.g. "127 of 250 labels". It's
   * both what's shown beside the label and what a screen reader reads as
   * `aria-valuetext`. Defaults to the value formatted as a percentage.
   */
  valueLabel?: ReactNode;
  /**
   * Whether to show the value label. Without a visible `label`, it sits at the
   * end of the track instead of above it.
   * @default true when `label` is set, otherwise false
   */
  showValueLabel?: boolean;
  /**
   * How the default value label is formatted. Ignored when `valueLabel` is
   * set.
   * @default { style: "percent" }
   */
  formatOptions?: Intl.NumberFormatOptions;
  /**
   * Color of the filled portion of the bar.
   * @default "primary.500"
   */
  color?: ThemeColorAliases;
  /** Names the bar when there's no visible `label`. */
  "aria-label"?: string;
  /** Names the bar by another element's id when there's no visible `label`. */
  "aria-labelledby"?: string;
  /** Identifies the element (or elements) that describe the bar. */
  "aria-describedby"?: string;
};

/**
 * A `ProgressBar` shows how far along a task with a known end is.
 *
 * @remarks
 * Use a `ProgressBar` when the work has a measurable total—uploading a file,
 * buying a batch of labels, working through a multi-step import. The bar is
 * determinate only: when the app can't say how far along the work is, use a
 * `<Spinner isIndeterminate />` instead. A linear indeterminate animation
 * needs a design of its own, and a bar that fakes a percentage reads worse
 * than a spinner that never claimed to know.
 *
 * @example
 * ```tsx
 * <ProgressBar label="Uploading" value={40} />
 * ```
 *
 * @example
 * _Custom value label:_
 * ```tsx
 * <ProgressBar
 *   label="Buying labels"
 *   value={127}
 *   maxValue={250}
 *   valueLabel="127 of 250 labels"
 * />
 * ```
 *
 * @example
 * _Without a visible label:_
 * ```tsx
 * <ProgressBar aria-label="Upload progress" value={40} />
 * ```
 *
 * @example
 * _Color:_
 * ```tsx
 * <ProgressBar label="Storage used" value={92} color="negative.500" />
 * ```
 */
export function ProgressBar(props: ProgressBarProps) {
  const {
    value,
    minValue = 0,
    maxValue = 100,
    label,
    valueLabel,
    showValueLabel = Boolean(label),
    formatOptions,
    color = "primary.500",
  } = props;

  const { progressBarProps, labelProps } = useProgressBar({
    "aria-label": props["aria-label"],
    "aria-labelledby": props["aria-labelledby"],
    "aria-describedby": props["aria-describedby"],
    value,
    minValue,
    maxValue,
    label,
    valueLabel,
    formatOptions,
  });

  const range = maxValue - minValue;
  const percent = range > 0 ? clamp((value - minValue) / range, 0, 1) * 100 : 0;
  // Without a visible label the value has nothing to sit beside above the
  // track, so it sits at the end of the track instead—one line, not two.
  const isInline = !label && showValueLabel;

  const style = {
    ...getComponentThemeToken("progress-bar", "color", "color", color),
    ...getComponentToken("progress-bar", "fill", `${percent}%`),
  } as React.CSSProperties;

  // Tabular figures keep the value from jittering as its digits change.
  const valueText = showValueLabel && (
    <Text
      variant="caption"
      color="neutral.600"
      fontVariantNumeric="tabular-nums"
      whiteSpace="nowrap"
    >
      {valueLabel ?? progressBarProps["aria-valuetext"]}
    </Text>
  );

  return (
    <div
      {...progressBarProps}
      className={classNames(styles.progressBar, isInline && styles.inline)}
      style={style}
    >
      {label && (
        <div className={styles.header}>
          <Text {...labelProps} variant="body2">
            {label}
          </Text>
          {valueText}
        </div>
      )}
      <div className={styles.track}>
        <div className={styles.fill} />
      </div>
      {isInline && valueText}
    </div>
  );
}

ProgressBar.displayName = "ProgressBar";
