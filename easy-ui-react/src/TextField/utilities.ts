import { TextFieldSize } from "./TextField";

/** Small textfield needs xs icon */
export function mapIconSize(size: TextFieldSize) {
  if (size === "sm") {
    return "xs";
  } else if (size === "lg") {
    return "md";
  }
  return size;
}

export function logWarningsForInvalidPropConfiguration(
  bothIconPropsDefined: boolean,
  smallSizeTextArea: boolean,
  definedIconsWithTextArea: boolean,
) {
  if (bothIconPropsDefined) {
    console.warn("Cannot simultaneously define `iconAtEnd` and `iconAtStart`");
  }

  if (smallSizeTextArea) {
    console.warn("`textarea` cannot be defined with size `sm`");
  }

  if (definedIconsWithTextArea) {
    console.warn("Cannot define `textarea` with `iconAtEnd` or `iconAtStart`");
  }
}
