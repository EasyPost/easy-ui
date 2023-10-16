import React, { ReactNode } from "react";
import { ProductLayoutContent } from "./ProductLayoutContent";
import { ProductLayoutHeader } from "./ProductLayoutHeader";
import { ProductLayoutSidebar } from "./ProductLayoutSidebar";
import { ProductLayoutTabbedContent } from "./ProductLayoutTabbedContent";

import styles from "./ProductLayout.module.scss";

export type ProductLayoutProps = {
  content: ReactNode;
  sidebar: ReactNode;
  header: ReactNode;
};

export function ProductLayout(props: ProductLayoutProps) {
  const { sidebar, header, content } = props;
  return (
    <div className={styles.ProductLayout}>
      {sidebar}
      <div className={styles.body}>
        {header}
        {content}
      </div>
    </div>
  );
}

ProductLayout.Sidebar = ProductLayoutSidebar;
ProductLayout.Header = ProductLayoutHeader;
ProductLayout.Content = ProductLayoutContent;
ProductLayout.TabbedContent = ProductLayoutTabbedContent;
