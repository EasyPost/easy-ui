import { AriaLabelingProps } from "@react-types/shared";
import React, { ReactElement, ReactNode } from "react";
import { TabNav } from "../TabNav";

import styles from "./ProductLayoutTabbedContent.module.scss";

export type ProductLayoutTabbedContentProps = AriaLabelingProps & {
  /**
   * The content to render in the nested tab.
   */
  children: ReactNode;

  /**
   * The tabs to display for nested content. Uses a `<TabNav />` and should
   * contain an array of `<TabNav.Item />`s.
   */
  tabs: ReactElement[];
};

export function ProductLayoutTabbedContent(
  props: ProductLayoutTabbedContentProps,
) {
  const { children, tabs, ...tabNavProps } = props;
  return (
    <div className={styles.ProductLayoutTabbedContent}>
      <TabNav {...tabNavProps}>{tabs}</TabNav>
      <main>{children}</main>
    </div>
  );
}
