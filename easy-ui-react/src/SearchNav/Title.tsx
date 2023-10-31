import React, { ReactNode } from "react";
import { Text } from "../Text";

export type TitleProps = {
  /**
   * Text content to display.
   */
  children: ReactNode;
};

export function Title(props: TitleProps) {
  const { children } = props;

  return (
    <Text variant="subtitle1" transform="uppercase">
      {children}
    </Text>
  );
}

Title.displayName = "SearchNav.Title";
