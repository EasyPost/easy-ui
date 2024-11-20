import React, { ReactNode } from "react";
import { useScrollbar } from "../utilities/useScrollbar";
import { useDrawerContext } from "./context";

import styles from "./Drawer.module.scss";

type DrawerBodyProps = {
  /**
   * Drawer body content.
   */
  children: ReactNode;
};

export function DrawerBody(props: DrawerBodyProps) {
  const { children } = props;
  const drawerContext = useDrawerContext();
  useScrollbar(drawerContext.bodyRef, "ezui-os-theme-drawer");
  return (
    <div className={styles.body} ref={drawerContext.bodyRef}>
      <div data-intercept="header" ref={drawerContext.headerInterceptorRef} />
      {children}
    </div>
  );
}

export function DrawerBannerBody(props: DrawerBodyProps) {
  const { children } = props;
  return (
    <DrawerBody>
      <div className={styles.banneredContent}>{children}</div>
    </DrawerBody>
  );
}

export function DrawerStandaloneBody(props: DrawerBodyProps) {
  const { children } = props;
  return (
    <DrawerBody>
      <div className={styles.standaloneContent}>{children}</div>
    </DrawerBody>
  );
}
