import React, { ReactNode } from "react";

import styles from "./ProductLayout.module.scss";

export type ProductLayoutContentProps = {
  /**
   * The content to render.
   */
  children: ReactNode;
};

export function ProductLayoutContent(props: ProductLayoutContentProps) {
  const { children } = props;
  return <main className={styles.content}>{children}</main>;
}
