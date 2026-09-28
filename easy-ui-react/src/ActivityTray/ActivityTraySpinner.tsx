import React from "react";
import { IconSize } from "../Icon";
import { getComponentDesignToken } from "../utilities/css";
import styles from "./ActivityTray.module.scss";

export type ActivityTraySpinnerProps = {
  /**
   * Matches the `Icon` sizes, so a spinning row and a finished row line up.
   * @default "md"
   */
  size?: IconSize;
};

/**
 * A silent spinner, private to `<ActivityTray />`.
 *
 * @remarks
 * Easy UI's `Spinner` can't do this job yet, for two reasons. Its indeterminate
 * mode renders a `role="status"` live region, and one per running row would turn
 * the tray into exactly the chatter its single live region exists to avoid; and
 * its only label channel is `children`, which it renders as visible text, so
 * there is no way to ask for a spinner that says nothing. Together those make it
 * unusable as a decorative glyph.
 *
 * This is a one-element ring rather than a copy of `Spinner`'s three-arc
 * animation—close enough to read as the same family, small enough not to pretend
 * it's the real thing. The spec lists the `Spinner` change that would let this
 * be deleted.
 */
export function ActivityTraySpinner({ size = "md" }: ActivityTraySpinnerProps) {
  const style = getComponentDesignToken(
    "activity-tray",
    "spinner-size",
    "size.icon",
    size,
  ) as React.CSSProperties;
  return <div aria-hidden="true" className={styles.spinner} style={style} />;
}
