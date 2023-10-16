import React, { ReactNode } from "react";

import styles from "./ProductLayoutSidebar.module.scss";

export type ProductLayoutSidebarProps = {
  children: ReactNode;
};

export function ProductLayoutSidebar(props: ProductLayoutSidebarProps) {
  const { children } = props;
  return (
    <div
      role="region"
      aria-label="Sidebar"
      className={styles.ProductLayoutSidebar}
    >
      {children}
    </div>
  );
}
