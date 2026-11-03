import { ReactNode } from "react";
import { InputSize } from "./InputField";

/** Small fields need xs icon */
export function mapIconSize(size: InputSize) {
  if (size === "sm") {
    return "xs";
  } else if (size === "lg") {
    return "md";
  }
  return size;
}

export function logWarningsForInvalidPropConfiguration(
  bothIconPropsDefined: boolean,
  smallSizeTextarea: boolean,
  definedIconAtEndWithTextarea: boolean,
  iconAndTextPropsDefined: boolean,
  maxRowsWithoutAutoGrow: boolean,
) {
  if (bothIconPropsDefined) {
    console.warn("Cannot simultaneously define `iconAtEnd` and `iconAtStart`");
  }

  if (smallSizeTextarea) {
    console.warn("`textarea` cannot be defined with size `sm`");
  }

  if (definedIconAtEndWithTextarea) {
    console.warn("Cannot define `textarea` with `iconAtEnd`");
  }

  if (iconAndTextPropsDefined) {
    console.warn(
      "Cannot simultaneously define `iconAtEnd` and `textAtEnd` or `iconAtStart` and `textAtStart`",
    );
  }

  if (maxRowsWithoutAutoGrow) {
    console.warn("`maxRows` has no effect without `autoGrow`");
  }
}

export function logWarningForMissingAriaLabel(
  label: ReactNode,
  ariaLabel: string | undefined,
) {
  if (!label && !ariaLabel) {
    console.warn("An aria-label must be provided if omitting `label`");
  }
}

export function getElementType(isMultiline: boolean) {
  return isMultiline ? "textarea" : "input";
}
