import React, { ReactNode } from "react";

import styles from "./ProductLayout.module.scss";

export type ProductLayoutSidebarProps = {
  children: ReactNode;
};

export function ProductLayoutSidebar(props: ProductLayoutSidebarProps) {
  const { children } = props;
  return (
    <div role="region" aria-label="Sidebar" className={styles.sidebar}>
      {children}
    </div>
  );
}
