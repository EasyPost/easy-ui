import React, { ReactNode } from "react";
import { AriaLabelingProps } from "@react-types/shared";

import styles from "./VerticalNav.module.scss";

export type VerticalNavProps = AriaLabelingProps & {
  children: ReactNode;
};

export function VerticalNav(props: VerticalNavProps) {
  const { children } = props;
  return <nav className={styles.VerticalNav}>{children}</nav>;
}
