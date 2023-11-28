import React, { ReactNode } from "react";
import { Text } from "../Text";

export type HelperTextProps = {
  id?: string;
  children: ReactNode;
};

export function HelperText(props: HelperTextProps) {
  const { children } = props;
  return <Text variant="body1">{children}</Text>;
}
