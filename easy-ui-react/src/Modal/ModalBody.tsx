import React, { ReactNode } from "react";
import { useScrollbar } from "../utilities/useScrollbar";
import { useModalContext } from "./context";

import styles from "./Modal.module.scss";

type ModalBodyProps = {
  /**
   * Modal body content.
   */
  children: ReactNode;
};

export function ModalBody(props: ModalBodyProps) {
  const { children } = props;
  const modalContext = useModalContext();
  useScrollbar(modalContext.bodyRef, "ezui-os-theme-modal");
  return (
    <div className={styles.body} ref={modalContext.bodyRef}>
      <div className={styles.content}>
        <div data-intercept="header" ref={modalContext.headerInterceptorRef} />
        {children}
        <div data-intercept="footer" ref={modalContext.footerInterceptorRef} />
      </div>
    </div>
  );
}
