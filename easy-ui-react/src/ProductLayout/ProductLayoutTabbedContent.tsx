import { AriaLabelingProps } from "@react-types/shared";
import React, { ReactElement, ReactNode } from "react";
import { TabNav } from "../TabNav";

import styles from "./ProductLayoutTabbedContent.module.scss";

export type ProductLayoutTabbedContentProps = AriaLabelingProps & {
  children: ReactNode;
  tabs: ReactElement[];
};

export function ProductLayoutTabbedContent(
  props: ProductLayoutTabbedContentProps,
) {
  const { children, tabs, ...tabNavProps } = props;
  return (
    <div className={styles.ProductLayoutTabbedContent}>
      <div>
        <TabNav {...tabNavProps}>{tabs}</TabNav>
      </div>
      <main>{children}</main>
    </div>
  );
}
