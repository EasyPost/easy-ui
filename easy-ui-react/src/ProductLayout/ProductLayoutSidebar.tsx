import React, { ReactNode } from "react";

export type ProductLayoutSidebarProps = {
  children: ReactNode;
};

export function ProductLayoutSidebar(props: ProductLayoutSidebarProps) {
  const { children } = props;
  return <div>{children}</div>;
}
