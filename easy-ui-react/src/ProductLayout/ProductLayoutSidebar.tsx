import React, { ReactNode } from "react";
import { Overlay, useDialog, useModalOverlay } from "react-aria";
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
  const { sidebarTriggerState } = useProductLayout();
  const className = classNames(
    styles.ProductLayoutSidebar,
    styles.notDialog,
    sidebarTriggerState.isOpen && styles.open,
  );
  return (
    <>
      {sidebarTriggerState.isOpen && (
        <SidebarAsDialogOverlay>
          <SidebarAsDialog>{children}</SidebarAsDialog>
        </SidebarAsDialogOverlay>
      )}
      <div role="region" aria-label="Sidebar" className={className}>
        {children}
      </div>
    </>
  );
}

function SidebarAsDialog(props: ProductLayoutSidebarProps) {
  const { children } = props;

  const ref = React.useRef(null);
  const { dialogProps } = useDialog(
    { role: "dialog", "aria-label": "Sidebar" },
    ref,
  );

  const className = classNames(
    styles.ProductLayoutSidebar,
    styles.open,
    styles.dialog,
  );

  return (
    <div {...dialogProps} ref={ref} className={className}>
      {children}
    </div>
  );
}

function SidebarAsDialogOverlay(props: { children: ReactNode }) {
  const { children } = props;

  const { sidebarTriggerState } = useProductLayout();

  const ref = React.useRef(null);
  const { modalProps, underlayProps } = useModalOverlay(
    { isDismissable: true, isKeyboardDismissDisabled: false },
    sidebarTriggerState,
    ref,
  );

  return (
    <Overlay>
      <div className={styles.overlay} {...underlayProps}>
        <div ref={ref} {...modalProps}>
          {children}
        </div>
      </div>
    </Overlay>
  );
}
