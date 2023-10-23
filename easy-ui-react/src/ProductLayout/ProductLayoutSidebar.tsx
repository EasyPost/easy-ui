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
  const { children } = props;
  const { sidebarTriggerState } = useProductLayout();

  const handleScreenSizeChange = useCallback(
    (isLargeScreen: boolean) => {
      if (isLargeScreen) {
        sidebarTriggerState.close();
      }
    },
    [sidebarTriggerState],
  );

  const className = classNames(
    styles.ProductLayoutSidebar,
    sidebarTriggerState.isOpen && styles.open,
  );

  return (
    <ScreenSizeSwitcher
      onChange={handleScreenSizeChange}
      renderOnLargeScreen={() => (
        <div role="region" aria-label="Sidebar" className={className}>
          {children}
        </div>
      )}
      renderOnSmallScreen={() => (
        <>
          {sidebarTriggerState.isOpen && (
            <SidebarAsDialogOverlay>
              <SidebarAsDialog>{children}</SidebarAsDialog>
            </SidebarAsDialogOverlay>
          )}
        </>
      )}
    />
  );
}

function SidebarAsDialog(props: ProductLayoutSidebarProps) {
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

function SidebarAsDialogOverlay(props: { children: ReactNode }) {
  const { children } = props;

  const { layoutRef, sidebarTriggerState } = useProductLayout();

  const ref = React.useRef(null);
  const { modalProps, underlayProps } = useModalOverlay(
    { isDismissable: true, isKeyboardDismissDisabled: false },
    sidebarTriggerState,
    ref,
  );

  return (
    <Overlay
      portalContainer={layoutRef.current ? layoutRef.current : undefined}
    >
      <div className={styles.overlay} {...underlayProps}>
        <div ref={ref} {...modalProps}>
          {children}
        </div>
      </div>
    </Overlay>
  );
}
