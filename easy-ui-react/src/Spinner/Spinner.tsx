import React, { ReactNode } from "react";
import { useProgressBar } from "react-aria";
import { IconSize } from "../Icon";
import { Text } from "../Text";
import { ThemeColorAliases, IntRange } from "../types";
import {
  getComponentThemeToken,
  getComponentDesignToken,
  getComponentToken,
} from "../utilities/css";
import styles from "./Spinner.module.scss";

export type ProgressProps = {
  /**
   * Mark the `Spinner` as indeterminate when progress is
   * unknown.
   */
  isIndeterminate: true;
  /**
   * The current progress
   */
  value?: undefined;
};

export type IndeterminateProps = {
  /**
   * Mark the `Spinner` as indeterminate when progress is
   * unknown.
   */
  isIndeterminate?: false;
  /**
   * The current progress
   */
  value: IntRange<0, 100>;
};

export type SpinnerProps = (ProgressProps | IndeterminateProps) & {
  /**
   * Size of spinner.
   * @default md
   */
  size?: IconSize;
  /**
   * The label for spinner.
   */
  children?: ReactNode;
  /**
   * Accessible name for the spinner when it has no visible label. Without
   * one, a spinner with no `children` is named "Loading".
   */
  "aria-label"?: string;
  /**
   * Id of an element that names the spinner. Takes the place of the
   * "Loading" fallback, like `aria-label`.
   */
  "aria-labelledby"?: string;
  /**
   * Adjust color of spinner and label.
   * @default "neutral.500"
   */
  color?: ThemeColorAliases;
  /**
   * Hide the spinner from assistive technology. Use it when the loading state
   * already reaches a screen reader some other way—a status in the text beside
   * it, a progress bar, a live region—so the spinner is only a visual cue.
   * `children` are not rendered.
   * @default false
   */
  isDecorative?: boolean;
};

/**
 * A `Spinner` component indicate the loading state of a component or page.
 *
 * @remarks
 * Use a `Spinner` component to display a visible loading indicator for
 * situations when an asynchronous API call or process might take a while.
 *
 * @example
 * ```tsx
 * <Spinner isIndeterminate>Loading...</Spinner>
 * ```
 *
 * @example
 * _Progress:_
 * ```tsx
 * <Spinner value={50}>Loading...</Spinner>
 * ```
 *
 * @example
 * _Sizing:_
 * ```tsx
 * <Spinner size="xl" isIndeterminate />
 * ```
 *
 * @example
 * _Decorative, beside text that already says what's loading:_
 * ```tsx
 * <Spinner isIndeterminate isDecorative />
 * ```
 *
 * @example
 * _Color:_
 * ```tsx
 * <Spinner color="primary.500" isIndeterminate />
 * ```
 */
export const Spinner = (props: SpinnerProps) => {
  // Separate components so a decorative spinner skips `useProgressBar`
  // entirely—it has no role, value, or label to compute.
  return props.isDecorative ? (
    <DecorativeSpinner {...props} />
  ) : (
    <AccessibleSpinner {...props} />
  );
};

function getSpinnerStyle({
  size = "md",
  color = "neutral.500",
  isIndeterminate,
  value,
}: SpinnerProps) {
  const degrees = !isIndeterminate && value && (value * 360) / 100;
  return {
    ...getComponentThemeToken("spinner", "color", "color", color),
    ...getComponentDesignToken("spinner", "size", "size.icon", size),
    ...(degrees && {
      ...getComponentToken("spinner", "degrees", `${degrees}deg`),
    }),
  } as React.CSSProperties;
}

function SpinnerIndicator({ isIndeterminate }: { isIndeterminate?: boolean }) {
  return isIndeterminate ? (
    <div className={styles.indeterminate}>
      <div />
      <div />
      <div />
    </div>
  ) : (
    <div className={styles.progress} />
  );
}

function DecorativeSpinner(props: SpinnerProps) {
  return (
    <div
      aria-hidden="true"
      className={styles.spinner}
      style={getSpinnerStyle(props)}
    >
      <SpinnerIndicator isIndeterminate={props.isIndeterminate} />
    </div>
  );
}

function AccessibleSpinner(props: SpinnerProps) {
  const { children, isIndeterminate = false } = props;
  // A spinner needs a name. Use `children` when given; otherwise fall back to
  // a hidden "Loading"—but only if no `aria-label` or `aria-labelledby` names
  // it already, since a label would take precedence over them.
  const isNamedByAria = !!(props["aria-label"] || props["aria-labelledby"]);
  const label = children || (isNamedByAria ? undefined : "Loading");
  const { progressBarProps, labelProps } = useProgressBar({ ...props, label });
  return (
    <div
      {...progressBarProps}
      className={styles.spinner}
      style={getSpinnerStyle(props)}
      role={isIndeterminate ? "status" : progressBarProps.role}
    >
      <SpinnerIndicator isIndeterminate={isIndeterminate} />
      {label && (
        <Text {...labelProps} visuallyHidden={!children} variant="subtitle2">
          {label}
        </Text>
      )}
    </div>
  );
}
