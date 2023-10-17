import React, { ReactNode } from "react";
import { classNames } from "../utilities/css";
import { useProductLayout } from "./context";

import styles from "./ProductLayoutSidebar.module.scss";

export type ProductLayoutSidebarProps = {
  /**
   * The content to render in the sidebar.
   */
  children: ReactNode;
};

export function ProductLayoutSidebar(props: ProductLayoutSidebarProps) {
  const { children } = props;
  const { isMobileSidebarOpen } = useProductLayout();
  const className = classNames(
    styles.ProductLayoutSidebar,
    isMobileSidebarOpen && styles.open,
  );
  return (
    <div role="region" aria-label="Sidebar" className={className}>
      {children}
    </div>
  );
}
