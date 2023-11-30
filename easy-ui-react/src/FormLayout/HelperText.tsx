import React, { ReactNode } from "react";
import { Text } from "../Text";

export type HelperTextProps = {
  /**
   * Id to assign to the HTML element.
   */
  id?: string;

  /**
   * Content of the helper text.
   */
  children: ReactNode;
};

export function HelperText(props: HelperTextProps) {
  const { children } = props;
  return <Text variant="body1">{children}</Text>;
}
