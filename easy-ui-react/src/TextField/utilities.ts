import { InputSize } from "./TextField";

/** Small textfield needs xs icon */
export function mapIconSize(size: InputSize) {
  if (size === "sm") {
    return "xs";
  } else if (size === "lg") {
    return "md";
  }
  return size;
}
