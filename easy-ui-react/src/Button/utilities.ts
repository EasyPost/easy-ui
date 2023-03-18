import { ButtonColor } from "../types";
import { ButtonVariant } from "./Button";
import { DropdownButtonVariant } from "../DropdownButton";

export function logWarningIfInvalidColorVariantCombination(
  color: ButtonColor,
  variant: ButtonVariant | DropdownButtonVariant,
): void {
  const validColorVariantCombinations = {
    filled: ["primary", "secondary", "success", "warning", "neutral"],
    outlined: [
      "primary",
      "secondary",
      "success",
      "warning",
      "support",
      "inverse",
    ],
    link: ["primary", "secondary"],
  };
  if (!validColorVariantCombinations[variant]?.includes(color)) {
    // eslint-disable-next-line no-console
    console.warn(
      `The color '${color}' is not supported with the '${variant}' variant`,
    );
  }
}
