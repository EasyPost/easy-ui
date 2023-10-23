import React, { ReactNode, useCallback } from "react";
import { Overlay, useDialog, useModalOverlay } from "react-aria";
import { classNames } from "../utilities/css";
import { ScreenSizeSwitcher } from "./ScreenSizeSwitcher";
import { useProductLayout } from "./context";

import styles from "./ProductLayoutSidebar.module.scss";

export type ProductLayoutSidebarProps = {
  /**
   * The content to render in the sidebar.
   */
  children: ReactNode;
};

export function ProductLayoutSidebar(props: ProductLayoutSidebarProps) {
  const { sidebarTriggerState } = useProductLayout();
  const handleScreenSizeChange = useCallback(
    (isLargeScreen: boolean) => {
      if (isLargeScreen) {
        sidebarTriggerState.close();
      }
    },
    [sidebarTriggerState],
  );
  return (
    <ScreenSizeSwitcher
      onChange={handleScreenSizeChange}
      renderOnLargeScreen={() => <LargeScreenSidebar {...props} />}
      renderOnSmallScreen={() => <SmallScreenSidebar {...props} />}
    />
  );
}

function LargeScreenSidebar(props: ProductLayoutSidebarProps) {
  const { children } = props;
  const { sidebarTriggerState } = useProductLayout();
  const className = classNames(
    styles.ProductLayoutSidebar,
    sidebarTriggerState.isOpen && styles.open,
  );
  return (
    <div role="region" aria-label="Sidebar" className={className}>
      {children}
    </div>
  );
}

function SmallScreenSidebar(props: ProductLayoutSidebarProps) {
  const { children } = props;
  const { sidebarTriggerState } = useProductLayout();
  return sidebarTriggerState.isOpen ? (
    <DialogSidebarOverlay>
      <DialogSidebar>{children}</DialogSidebar>
    </DialogSidebarOverlay>
  ) : null;
}

function DialogSidebar(props: ProductLayoutSidebarProps) {
  const { children } = props;
  const ref = React.useRef(null);
  const { dialogProps } = useDialog(
    { role: "dialog", "aria-label": "Sidebar" },
    ref,
  );
  const className = classNames(styles.ProductLayoutSidebar, styles.open);
  return (
    <div {...dialogProps} ref={ref} className={className}>
      {children}
    </div>
  );
}

function DialogSidebarOverlay(props: { children: ReactNode }) {
  const { children } = props;
  const { layoutContainerRef, sidebarTriggerState } = useProductLayout();
  const ref = React.useRef(null);
  const { modalProps, underlayProps } = useModalOverlay(
    { isDismissable: true, isKeyboardDismissDisabled: false },
    sidebarTriggerState,
    ref,
  );
  return (
    <Overlay portalContainer={layoutContainerRef.current ?? undefined}>
      <div className={styles.overlay} {...underlayProps}>
        <div ref={ref} {...modalProps}>
          {children}
        </div>
      </div>
    </Overlay>
  );
}
