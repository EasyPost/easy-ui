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
  definedIconsWithTextarea: boolean,
) {
  if (bothIconPropsDefined) {
    console.warn("Cannot simultaneously define `iconAtEnd` and `iconAtStart`");
  }

  if (smallSizeTextarea) {
    console.warn("`textarea` cannot be defined with size `sm`");
  }

  if (definedIconsWithTextarea) {
    console.warn("Cannot define `textarea` with `iconAtEnd` or `iconAtStart`");
  }
}

export function getElementType(isMultiline: boolean) {
  return isMultiline ? "textarea" : "input";
}
