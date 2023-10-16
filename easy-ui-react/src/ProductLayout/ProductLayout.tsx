import React, { ReactNode } from "react";
import { ProductLayoutContent } from "./ProductLayoutContent";
import { ProductLayoutHeader } from "./ProductLayoutHeader";
import { ProductLayoutSidebar } from "./ProductLayoutSidebar";
import { ProductLayoutTabbedContent } from "./ProductLayoutTabbedContent";

export type ProductLayoutProps = {
  children: ReactNode;
};

export function ProductLayout(props: ProductLayoutProps) {
  return <>{props.children}</>;
}

ProductLayout.Sidebar = ProductLayoutSidebar;
ProductLayout.Header = ProductLayoutHeader;
ProductLayout.Content = ProductLayoutContent;
ProductLayout.TabbedContent = ProductLayoutTabbedContent;
