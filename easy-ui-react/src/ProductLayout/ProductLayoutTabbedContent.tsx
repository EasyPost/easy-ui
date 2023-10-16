import { AriaLabelingProps } from "@react-types/shared";
import React, { ReactElement, ReactNode } from "react";
import { TabNav } from "../TabNav";

import styles from "./ProductLayout.module.scss";

export type ProductLayoutTabbedContentProps = AriaLabelingProps & {
  children: ReactNode;
  tabs: ReactElement[];
};

export function ProductLayoutTabbedContent(
  props: ProductLayoutTabbedContentProps,
) {
  const { children, tabs, ...tabNavProps } = props;
  return (
    <div className={styles.nestedContent}>
      <div className={styles.nestedContentTabs}>
        <TabNav {...tabNavProps}>{tabs}</TabNav>
      </div>
      <main className={styles.nestedContentMain}>{children}</main>
    </div>
  );
}
