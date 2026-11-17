import omit from "lodash/omit.js";
import { ButtonColor } from "./Button";
import { ButtonVariant } from "./Button";
import type { IconButtonVariant } from "../IconButton";

export const FILLED_BUTTON_COLORS = [
  "primary",
  "secondary",
  "success",
  "warning",
  "neutral",
  "inverse",
];

export const OUTLINED_BUTTON_COLORS = [
  "primary",
  "secondary",
  "support",
  "warning",
  "inverse",
];

export const LINK_BUTTON_COLORS = ["primary", "secondary"];

export const TEXT_BUTTON_COLORS = ["primary", "secondary"];

// Ghost is outlined without the border, so it supports the same colors.
export const GHOST_BUTTON_COLORS = OUTLINED_BUTTON_COLORS;

export function logWarningIfInvalidColorVariantCombination(
  color: ButtonColor,
  variant: ButtonVariant | IconButtonVariant,
): void {
  const validColorVariantCombinations = {
    filled: FILLED_BUTTON_COLORS,
    outlined: OUTLINED_BUTTON_COLORS,
    link: LINK_BUTTON_COLORS,
    text: TEXT_BUTTON_COLORS,
    ghost: GHOST_BUTTON_COLORS,
  };
  if (!validColorVariantCombinations[variant]?.includes(color)) {
    console.warn(
      `The color '${color}' is not supported with the '${variant}' variant`,
    );
  }
}

/**
 * Removes aria-specific props from being applied to button DOM element.
 */
export function omitReactAriaSpecificProps(props: object) {
  return omit(props, [
    "onPress",
    "onPressChange",
    "onPressStart",
    "onPressEnd",
    "onPressUp",
    "preventFocusOnPress",
    "routerOptions",
  ]);
}
