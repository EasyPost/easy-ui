import React, { ReactNode } from "react";

export type ContentProps = {
  children: ReactNode;
};

export function Content({ children }: ContentProps) {
  return <main>{children}</main>;
}
