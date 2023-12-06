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
  const { id, children } = props;
  return (
    <Text id={id} variant="body1">
      {children}
    </Text>
  );
}
