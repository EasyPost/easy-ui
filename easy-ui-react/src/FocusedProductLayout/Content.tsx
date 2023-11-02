import React, { ReactNode } from "react";

export type ContentProps = {
  /**
   * Main content to render for the focused product layout.
   * Rendered in a `<main />`.
   */
  children: ReactNode;
};

export function Content({ children }: ContentProps) {
  return <main>{children}</main>;
}
