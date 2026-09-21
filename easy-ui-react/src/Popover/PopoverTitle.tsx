import React from "react";
import { Text, TextProps } from "../Text";
import { useInternalPopoverOverlayContext } from "./PopoverContext";

// `id` is owned by the popover—the dialog's `aria-labelledby` points at it—so it
// isn't accepted here. Everything else on `Text` stays available.
export type PopoverTitleProps = Omit<TextProps, "id">;

export function PopoverTitle(props: PopoverTitleProps) {
  const { titleId } = useInternalPopoverOverlayContext();
  // `as="h2"` regardless of `variant`: a popover's heading level is a document
  // structure question and its size is a visual one, so they're set separately.
  // `id` is applied last so it can't be overwritten, which would leave the
  // popover without an accessible name.
  return <Text as="h2" variant="subtitle1" truncate {...props} id={titleId} />;
}
