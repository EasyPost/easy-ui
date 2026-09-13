import React from "react";
import { Badge, BadgeVariant } from "../Badge";
import { Card } from "../Card";
import { Sparkline, SparklineProps } from "../Sparkline";
import { Text } from "../Text";
import styles from "./MetricCard.module.scss";

/** An application-calculated comparison with its explicit baseline and meaning. */
export type MetricComparison = {
  /** Formatted change, including direction and units, e.g. "4.2% lower". */
  label: string;
  /** Explicit comparison period or baseline, e.g. "vs previous 30 days". */
  baseline: string;
  /** Business meaning, independent of direction. Defaults to neutral. */
  sentiment?: "positive" | "negative" | "neutral";
};

/** Exact KPI content, optional comparison, and optional compact trend. */
export type MetricCardProps = {
  /** Name of the metric. */
  label: string;
  /** Formatted value with units. null means unavailable; "0" is a real value. */
  value: string | null;
  /** Selected period, coverage, or other metric context. */
  supportingText?: string;
  /** Change relative to an explicit baseline, calculated by the caller. */
  comparison?: MetricComparison;
  /** Optional compact trend with an accessible summary. */
  trend?: SparklineProps;
  /** Show a loading status and suppress the previous value and trend. */
  isLoading?: boolean;
  /** Localized loading message; defaults to "Loading…". */
  loadingLabel?: string;
  /** Localized label for an unavailable value; defaults to "No data". */
  emptyLabel?: string;
};

const comparisonVariants: Record<
  NonNullable<MetricComparison["sentiment"]>,
  BadgeVariant
> = {
  positive: "success",
  negative: "danger",
  neutral: "gray",
};

/** A metric, its comparison baseline, and an optional compact trend. */
export function MetricCard({
  label,
  value,
  supportingText,
  comparison,
  trend,
  isLoading = false,
  loadingLabel = "Loading…",
  emptyLabel = "No data",
}: MetricCardProps) {
  const hasValue = value !== null && !isLoading;

  return (
    <Card
      as="section"
      aria-label={label}
      aria-busy={isLoading}
      background="primary"
      padding="2"
    >
      <div className={styles.content}>
        <Text variant="subtitle2" color="neutral.700" breakWord>
          {label}
        </Text>
        <div className={styles.value}>
          {isLoading ? (
            <span role="status">{loadingLabel}</span>
          ) : (
            <Text
              variant="heading3"
              fontVariantNumeric="tabular-nums"
              color="neutral.900"
              breakWord
            >
              {value === null ? emptyLabel : value}
            </Text>
          )}
        </div>
        {supportingText && (
          <Text variant="caption" color="neutral.600" breakWord>
            {supportingText}
          </Text>
        )}
        {hasValue && trend && <Sparkline {...trend} />}
        {hasValue && comparison && (
          <div className={styles.comparison}>
            <Badge
              variant={comparisonVariants[comparison.sentiment ?? "neutral"]}
            >
              {comparison.label}
            </Badge>
            <Text variant="caption" color="neutral.600" breakWord>
              {comparison.baseline}
            </Text>
          </div>
        )}
      </div>
    </Card>
  );
}
