import React, { ReactNode } from "react";
import { Text } from "../Text";

type VisuallyHiddenCellContentProps = {
  children: ReactNode;
};

export function VisuallyHiddenCellContent({
  children,
}: VisuallyHiddenCellContentProps) {
  return <Text visuallyHidden>{children}</Text>;
}
