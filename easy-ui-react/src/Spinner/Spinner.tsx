import React, { useId, ReactNode } from "react";
import { useProgressBar } from "react-aria";
import { IconSize } from "../Icon";
import { Text } from "../Text";
import { ThemeColorAliases, IntRange } from "../types";
import {
  classNames,
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
   * Adjust color of spinner and label.
   * @default "neutral.500"
   */
  color?: ThemeColorAliases;
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
 * _Color:_
 * ```tsx
 * <Spinner color="primary.500" isIndeterminate />
 * ```
 */

export const Spinner = (props: SpinnerProps) => {
  const {
    children,
    size = "md",
    color = "neutral.500",
    isIndeterminate = false,
    value,
  } = props;
  const { progressBarProps, labelProps } = useProgressBar({
    ...props,
    label: children,
  });
  const id = useId();
  const degrees = !isIndeterminate && value && (value * 360) / 100;
  const style = {
    ...getComponentThemeToken("spinner", "color", "color", color),
    ...getComponentDesignToken("spinner", "size", "size.icon", size),
    ...(degrees && {
      ...getComponentToken("spinner", "degrees", `${degrees}deg`),
    }),
  } as React.CSSProperties;
  return (
    <div
      {...progressBarProps}
      className={styles.spinner}
      style={style}
      role={isIndeterminate ? "status" : progressBarProps.role}
      aria-labelledby={progressBarProps["aria-labelledby"] ?? id}
    >
      <div
        className={classNames(
          isIndeterminate ? styles.indeterminate : styles.progress,
        )}
      />
      <Text
        {...labelProps}
        id={labelProps.id ?? id}
        visuallyHidden={!children}
        variant="subtitle2"
      >
        {children ? children : "Loading"}
      </Text>
    </div>
  );
};
