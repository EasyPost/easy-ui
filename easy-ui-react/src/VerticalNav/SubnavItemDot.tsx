import React from "react";
import { classNames } from "../utilities/css";

import styles from "./SubnavItemDot.module.scss";

export type SubnavItemDotProps = {
  isCozy?: boolean;
  isVisible?: boolean;
};

export function SubnavItemDot({ isCozy, isVisible }: SubnavItemDotProps) {
  const className = classNames(
    styles.SubnavItemDot,
    isCozy && styles.cozy,
    isVisible && styles.visible,
  );
  return <span className={className} />;
}
