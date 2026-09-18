import React from "react";
import { Placement } from "react-aria";
import {
  ResponsiveProp,
  getComponentToken,
  getResponsiveValue,
} from "../utilities/css";

/**
 * How wide the overlay is.
 *
 * - `fit-content` sizes the overlay to its content.
 * - `auto` is at least the trigger's width, growing for wider content. This is
 *   what `<Menu />` and `<Select />` do.
 * - `trigger` is the trigger's width exactly, so wider content wraps.
 * - Anything else is used as an explicit width, responsively.
 */
export type PopoverWidth =
  "fit-content" | "auto" | "trigger" | ResponsiveProp<string | number>;

export const DEFAULT_POPOVER_WIDTH: PopoverWidth = "fit-content";
export const DEFAULT_POPOVER_PLACEMENT: Placement = "bottom start";

// React Aria Components measures the trigger and publishes the result as
// `--trigger-width` on the overlay itself, so—unlike `Menu`, which measures the
// trigger with its own hook—there's no width to thread through here. It's written
// in a layout effect, so it's there on the first paint. Reading the property is
// free; *setting* it would make React Aria skip its own resize observer.
const TRIGGER_WIDTH = "var(--trigger-width)";

export function getPopoverWidthStyles(
  width: PopoverWidth,
): React.CSSProperties {
  return {
    // `auto` is a floor rather than a width, matching `Menu`: the popover is
    // never narrower than its trigger, but content wider than the trigger widens
    // it. `trigger` is the same measurement used as a width, for a popover that
    // has to line up with its trigger exactly.
    ...getComponentToken(
      "popover",
      "min-width",
      width === "auto" ? TRIGGER_WIDTH : undefined,
    ),
    ...getResponsiveValue(
      "popover",
      "width",
      width === "trigger"
        ? TRIGGER_WIDTH
        : width === "auto" || width === "fit-content"
          ? "auto"
          : width,
    ),
  };
}
