import React, { ReactNode, useMemo, useRef } from "react";
import { useOverlayTrigger } from "react-aria";
import { useOverlayTriggerState } from "react-stately";
import { ProductLayoutContent } from "./ProductLayoutContent";
import { ProductLayoutHeader } from "./ProductLayoutHeader";
import { ProductLayoutSidebar } from "./ProductLayoutSidebar";
import { ProductLayoutTabbedContent } from "./ProductLayoutTabbedContent";
import { ProductLayoutContext } from "./context";

import styles from "./ProductLayout.module.scss";

export type ProductLayoutProps = {
  /**
   * The main content for the product layout. Should contain a
   * `<ProductLayout.Content />` or `<ProductLayout.TabbedContent />`
   * component as children.
   */
  content: ReactNode;

  /**
   * The sidebar for the product layout. Should contain a
   * `<ProductLayout.Sidebar />` component as children.
   */
  sidebar: ReactNode;

  /**
   * The header for the product layout. Should contain a
   * `<ProductLayout.Header />` component as children.
   */
  header: ReactNode;
};

/**
 * `ProductLayout` defines the header, sidebar, and main areas of a
 * product page.
 *
 * @example
 * ```tsx
 * <ProductLayout
 *   sidebar={
 *     <ProductLayout.Sidebar>
 *       <div />
 *     </ProductLayout.Sidebar>
 *   }
 *   header={
 *     <ProductLayout.Header
 *       renderSmallScreenLogo={() => <EasyPostLogoMark />}
 *       title="Page title"
 *       helpMenuItems={[
 *         <Menu.Item
 *           key="1"
 *           href="https://www.easypost.com/docs/api"
 *           target="_blank"
 *           rel="noopener"
 *         >
 *           Documentation
 *         </Menu.Item>
 *       ]}
 *       primaryAction={{
 *         content: "CTA 1",
 *         onAction: () => {},
 *       }}
 *       secondaryAction={{
 *         content: "CTA 2",
 *         onAction: () => {},
 *       }}
 *     />
 *   }
 *   content={
 *     <ProductLayout.Content>
 *       <div>Content</div>
 *     </ProductLayout.Content>
 *   }
 * />
 * ```
 */
export function ProductLayout(props: ProductLayoutProps) {
  const { sidebar, header, content } = props;
  const layoutContainerRef = useRef<HTMLDivElement | null>(null);
  const state = useOverlayTriggerState({});
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: "dialog" },
    state,
  );
  const context = useMemo(() => {
    return {
      layoutContainerRef,
      sidebarTriggerState: state,
      sidebarTriggerProps: triggerProps,
      sidebarOverlayProps: overlayProps,
    };
  }, [state, triggerProps, overlayProps]);
  return (
    <ProductLayoutContext.Provider value={context}>
      <div className={styles.ProductLayout} ref={layoutContainerRef}>
        {sidebar}
        <div className={styles.body}>
          {header}
          {content}
        </div>
      </div>
    </ProductLayoutContext.Provider>
  );
}

/**
 * Represents the sidebar in a `<ProductLayout />`.
 */
ProductLayout.Sidebar = ProductLayoutSidebar;

/**
 * Represents the header in a `<ProductLayout />`.
 */
ProductLayout.Header = ProductLayoutHeader;

/**
 * Represents an empty content section in a `<ProductLayout />`.
 */
ProductLayout.Content = ProductLayoutContent;

/**
 * Represents a nested content section in a `<ProductLayout />`.
 */
ProductLayout.TabbedContent = ProductLayoutTabbedContent;
