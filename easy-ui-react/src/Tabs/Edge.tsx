import React from "react";
import { classNames, variationName } from "../utilities/css";

import styles from "./Edge.module.scss";

type EdgeProps = {
  side: "left" | "right";
  isUnderScroll: boolean;
};

export function Edge({ side, isUnderScroll }: EdgeProps) {
  const className = classNames(
    styles.Edge,
    styles[variationName("side", side)],
    isUnderScroll && styles.activated,
  );
  return <div className={className} />;
}
