import React from "react";
import styles from "./Placeholder.module.css";

export interface PlaceholderProps {
  text: string;
}

export function Placeholder({ text }: PlaceholderProps) {
  return <div className={styles.Placeholder}>{text}</div>;
}
