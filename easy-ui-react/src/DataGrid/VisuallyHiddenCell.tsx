import React, { ReactNode } from "react";
import { Text } from "../Text";

type VisuallyHiddenCellProps = {
  children: ReactNode;
};

export function VisuallyHiddenCell({ children }: VisuallyHiddenCellProps) {
  return <Text visuallyHidden>{children}</Text>;
}
