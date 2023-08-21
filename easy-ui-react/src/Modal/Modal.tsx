import React, { ElementRef, ReactNode, useMemo, useRef } from "react";
import { useDialog } from "react-aria";
import { classNames, variationName } from "../utilities/css";
import { ModalBody } from "./ModalBody";
import { ModalFooter } from "./ModalFooter";
import { ModalHeader } from "./ModalHeader";
import { ModalTrigger } from "./ModalTrigger";
import { ModalContext } from "./context";
import { useIntersectionDetection } from "./useIntersectionDetection";
import { ModalContainer } from "./ModalContainer";
import { useModalTrigger } from "./context";

import styles from "./Modal.module.scss";

type ModalSize = "sm" | "md" | "lg";

export type ModalProps = {
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

/**
 * A `Modal` is a page overlay that displays information and blocks interaction
 * with the page until an action is taken or the `Modal` is dismissed.
 *
 * @remarks
 * Use a `<Modal />` when you want to capture information from the user without
 * having them leave the parent page, or when you want to show additional
 * information to the user without losing context of the parent page.
 *
 * @example
 * <Modal.Trigger>
 *   <Button>Open modal</Button>
 *   <Modal>
 *     <Modal.Header>H4 Title</Modal.Header>
 *     <Modal.Body>Modal content</Modal.Body>
 *     <Modal.Footer
 *       primaryAction={{
 *         content: "Button 1",
 *         onAction: () => {},
 *       }}
 *     />
 *   </Modal>
 * </Modal.Trigger>
 */
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

/**
 * Represents the trigger for a `<Modal />`.
 *
 * @remarks
 * A `<Modal />` must be attached to a focusable trigger element such as a
 * `Button` through the `<Modal.Trigger />` component. This ensures
 * the trigger and modal are accessible.
 *
 * `<Modal.Trigger />` must contain exactly two direct children. The first
 * child must be a focusable trigger such as `Button`. The second child must
 * be either a `Modal` or a render function that returns a `Modal`. If using
 * a render function, a `close` argument will be passed to allow for
 * programmatically closing the `Modal`.
 */
Modal.Trigger = ModalTrigger;

/**
 * Represents the header of a `<Modal />`.
 */
Modal.Header = ModalHeader;

/**
 * Represents the body of a `<Modal />`.
 */
Modal.Body = ModalBody;

/**
 * Represents the footer of a `<Modal />`.
 */
Modal.Footer = ModalFooter;

export { ModalContainer, useModalTrigger };
