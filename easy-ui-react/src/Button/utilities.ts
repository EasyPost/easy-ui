import omit from "lodash/omit";
import { ButtonColor } from "./Button";
import { ButtonVariant } from "./Button";

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

export function logWarningIfInvalidColorVariantCombination(
  color: ButtonColor,
  variant: ButtonVariant,
): void {
  const validColorVariantCombinations = {
    filled: FILLED_BUTTON_COLORS,
    outlined: OUTLINED_BUTTON_COLORS,
    link: LINK_BUTTON_COLORS,
    text: TEXT_BUTTON_COLORS,
  };
  if (!validColorVariantCombinations[variant]?.includes(color)) {
    console.warn(
      `The color '${color}' is not supported with the '${variant}' variant`,
    );
  }
}

/**
 * Removes aria-specific props from being applied to button DOM element.
 *
 * @remarks
 * `onClick` is included because `useButton()` hands it to `usePress()`, which
 * calls it from the `onClick` it returns. Spreading the original alongside that
 * one would fire the consumer's handler twice per click.
 */
export function omitReactAriaSpecificProps(props: object) {
  return omit(props, [
    "onClick",
    "onPress",
    "onPressChange",
    "onPressStart",
    "onPressEnd",
    "onPressUp",
    "preventFocusOnPress",
    "routerOptions",
  ]);
}
