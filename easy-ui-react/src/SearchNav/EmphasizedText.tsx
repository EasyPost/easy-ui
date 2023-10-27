import React, { ReactNode } from "react";
import { Text } from "../Text";

export type EmphasizedTextProps = {
  /**
   * Text content to display.
   */
  children: ReactNode;
};

export function EmphasizedText(props: EmphasizedTextProps) {
  const { children } = props;

  return <Text variant="subtitle1">{children}</Text>;
}

EmphasizedText.displayName = "SearchNav.EmphasizedText";
