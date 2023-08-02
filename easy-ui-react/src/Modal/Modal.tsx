import React, {
  ElementRef,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDialog } from "react-aria";
import { classNames, variationName } from "../utilities/css";
import { ModalBody } from "./ModalBody";
import { ModalFooter } from "./ModalFooter";
import { ModalHeader } from "./ModalHeader";
import { ModalTrigger } from "./ModalTrigger";
import { ModalContext } from "./context";

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
   * @default "lg"
   */
  size?: ModalSize;
};

export function Modal(props: ModalProps) {
  const { children, size = "lg" } = props;

  const bodyRef = useRef<ElementRef<"div">>(null);
  const headerInterceptorRef = useRef<ElementRef<"div">>(null);
  const footerInterceptorRef = useRef<ElementRef<"div">>(null);

  const [isHeaderStuck, setIsHeaderStuck] = useState(false);
  const [isFooterStuck, setIsFooterStuck] = useState(false);

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

  useEffect(() => {
    if (
      !headerInterceptorRef.current ||
      !footerInterceptorRef.current ||
      !bodyRef.current
    ) {
      return;
    }

    const hObserver = new IntersectionObserver(
      ([entry]) => {
        setIsHeaderStuck(!entry.isIntersecting);
      },
      { root: bodyRef.current },
    );

    const fObserver = new IntersectionObserver(
      ([entry]) => {
        setIsFooterStuck(!entry.isIntersecting);
      },
      { root: bodyRef.current },
    );

    hObserver.observe(headerInterceptorRef.current);
    fObserver.observe(footerInterceptorRef.current);

    return () => {
      hObserver.disconnect();
      fObserver.disconnect();
    };
  }, []);

  const className = classNames(
    styles.dialog,
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
