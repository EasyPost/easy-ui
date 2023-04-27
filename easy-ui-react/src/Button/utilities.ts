import omit from "lodash/omit";
import { ButtonColor } from "./Button";
import { ButtonVariant } from "./Button";

export function logWarningIfInvalidColorVariantCombination(
  color: ButtonColor,
  variant: ButtonVariant,
): void {
  const validColorVariantCombinations = {
    filled: ["primary", "secondary", "success", "warning", "neutral"],
    outlined: ["primary", "secondary", "support", "inverse"],
    link: ["primary", "secondary"],
  };
  if (!validColorVariantCombinations[variant]?.includes(color)) {
    // eslint-disable-next-line no-console
    console.warn(
      `The color '${color}' is not supported with the '${variant}' variant`,
    );
  }
}

/**
 * Removes aria-specific props from being applied to button DOM element.
 */
export function filterButtonDOMProps(props: object) {
  return omit(props, [
    "onPress",
    "onPressChange",
    "onPressStart",
    "onPressEnd",
    "onPressUp",
  ]);
}
