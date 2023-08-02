import { FocusableElement } from "@react-types/shared";
import { DOMAttributes, RefObject, createContext, useContext } from "react";
import { OverlayTriggerState } from "react-stately";

export type ModalContextType = {
  dialogProps: DOMAttributes<FocusableElement>;
  titleProps: DOMAttributes<FocusableElement>;
  isHeaderStuck: boolean;
  isFooterStuck: boolean;
  bodyRef: RefObject<HTMLDivElement>;
  headerInterceptorRef: RefObject<HTMLDivElement>;
  footerInterceptorRef: RefObject<HTMLDivElement>;
};

type ModalTriggerContextType = {
  isDismissable: boolean;
  state: OverlayTriggerState;
};

export const ModalContext = createContext<ModalContextType | null>(null);

export const useModalContext = () => {
  const modalContext = useContext(ModalContext);
  if (!modalContext) {
    throw new Error("useModal must be used within a Modal");
  }
  return modalContext;
};

export const ModalTriggerContext =
  createContext<ModalTriggerContextType | null>(null);

export const useModalTriggerContext = () => {
  const modalTriggerContext = useContext(ModalTriggerContext);
  if (!modalTriggerContext) {
    throw new Error("useModalTrigger must be used within a ModalTrigger");
  }
  return modalTriggerContext;
};
