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
  const { bodyRef, headerInterceptorRef, footerInterceptorRef } =
    useModalContext();
  useScrollbar(bodyRef, "ezui-os-theme-modal");
  return (
    <div className={styles.body} ref={bodyRef}>
      <div className={styles.content}>
        <div data-intercept="header" ref={headerInterceptorRef} />
        {children}
        <div data-intercept="footer" ref={footerInterceptorRef} />
      </div>
    </div>
  );
}
