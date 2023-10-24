import React from "react";
import { classNames, variationName } from "../utilities/css";

import styles from "./Separator.module.scss";

export type SeparatorProps = {
  /**
   * Group separator between items.
   */
  group: "logo" | "cta";
};

export function Separator(props: SeparatorProps) {
  const { group } = props;

  return (
    <div
      className={classNames(
        styles.separator,
        styles[variationName("group", group)],
      )}
    />
  );
}
