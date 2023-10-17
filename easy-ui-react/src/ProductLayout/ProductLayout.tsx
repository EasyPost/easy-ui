import React, { ReactNode, useMemo, useState } from "react";
import { ProductLayoutContent } from "./ProductLayoutContent";
import { ProductLayoutHeader } from "./ProductLayoutHeader";
import { ProductLayoutSidebar } from "./ProductLayoutSidebar";
import { ProductLayoutTabbedContent } from "./ProductLayoutTabbedContent";

import styles from "./ProductLayout.module.scss";
import { ProductLayoutContext } from "./context";

export type ProductLayoutProps = {
  content: ReactNode;
  sidebar: ReactNode;
  header: ReactNode;
};

export function ProductLayout(props: ProductLayoutProps) {
  const { sidebar, header, content } = props;
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const context = useMemo(() => {
    return { isMobileSidebarOpen, setIsMobileSidebarOpen };
  }, [isMobileSidebarOpen]);
  return (
    <ProductLayoutContext.Provider value={context}>
      <div className={styles.ProductLayout}>
        {sidebar}
        <div className={styles.body}>
          {header}
          {content}
        </div>
      </div>
    </ProductLayoutContext.Provider>
  );
}

ProductLayout.Sidebar = ProductLayoutSidebar;
ProductLayout.Header = ProductLayoutHeader;
ProductLayout.Content = ProductLayoutContent;
ProductLayout.TabbedContent = ProductLayoutTabbedContent;
