import React, { ReactNode } from "react";
import { Text } from "../Text";
import { classNames } from "../utilities/css";

import styles from "./Title.module.scss";

export type TitleProps = {
  /**
   * Emphasized text content to display.
   */
  children: ReactNode;
};

export function Title(props: TitleProps) {
  const { children } = props;

  return (
    <span className={classNames(styles.title)}>
      <Text variant="subtitle1">{children}</Text>
    </span>
  );
}

Title.displayName = "SearchNav.Title";
