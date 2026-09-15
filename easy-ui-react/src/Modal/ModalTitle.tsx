import React from "react";
import { Text, TextProps } from "../Text";
import { useModalContext } from "./context";

// `id` is owned by the modal—the dialog's `aria-labelledby` points at it—so it
// isn't accepted here. Everything else on `Text` stays available.
export type ModalTitleProps = Omit<TextProps, "id">;

export function ModalTitle(props: ModalTitleProps) {
  const modalContext = useModalContext();
  // `titleProps` spreads last so the `id` can't be overwritten, which would
  // leave the modal without an accessible name.
  return (
    <Text
      as="h2"
      variant="heading4"
      truncate
      {...props}
      {...modalContext.titleProps}
    />
  );
}
