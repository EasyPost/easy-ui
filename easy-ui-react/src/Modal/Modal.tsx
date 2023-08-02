import React, { ElementRef, ReactNode, useMemo, useRef } from "react";
import { useDialog } from "react-aria";
import { classNames, variationName } from "../utilities/css";
import { ModalBody } from "./ModalBody";
import { ModalFooter } from "./ModalFooter";
import { ModalHeader } from "./ModalHeader";
import { ModalTrigger } from "./ModalTrigger";
import { ModalContext } from "./context";
import { useIntersectionDetection } from "./useIntersectionDetection";

import styles from "./Modal.module.scss";

type ModalSize = "sm" | "md" | "lg";

type ModalProps = {
  /**
   * Content of the modal.
   */
  children: ReactNode;

  /**
   * Size of the modal.
   *
   * @default lg
   */
  size?: ModalSize;
};

export function Modal(props: ModalProps) {
  const { children, size = "lg" } = props;

  const bodyRef = useRef<ElementRef<"div">>(null);
  const headerInterceptorRef = useRef<ElementRef<"div">>(null);
  const footerInterceptorRef = useRef<ElementRef<"div">>(null);

  const isHeaderStuck = useIntersectionDetection(headerInterceptorRef, bodyRef);
  const isFooterStuck = useIntersectionDetection(footerInterceptorRef, bodyRef);

  const dialogRef = React.useRef(null);
  const { dialogProps, titleProps } = useDialog({ role: "dialog" }, dialogRef);

  const context = useMemo(() => {
    return {
      bodyRef,
      headerInterceptorRef,
      footerInterceptorRef,
      isHeaderStuck,
      isFooterStuck,
      dialogProps,
      titleProps,
    };
  }, [dialogProps, isFooterStuck, isHeaderStuck, titleProps]);

  const className = classNames(
    styles.Modal,
    styles[variationName("size", size)],
  );

  return (
    <ModalContext.Provider value={context}>
      <div {...dialogProps} className={className} ref={dialogRef}>
        {children}
      </div>
    </ModalContext.Provider>
  );
}

Modal.Trigger = ModalTrigger;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
