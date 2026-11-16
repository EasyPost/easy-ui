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
  const { bodyRef, headerInterceptorRef } = useDrawerContext();
  useScrollbar(bodyRef, "ezui-os-theme-drawer");
  return (
    <div className={styles.body} ref={bodyRef}>
      <div data-intercept="header" ref={headerInterceptorRef} />
      {children}
    </div>
  );
}
