import React from "react";
import { FocusableElement } from "@react-types/shared";
import {
  DOMAttributes,
  RefObject,
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
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
  hasOpenNestedModal: boolean;
  setHasOpenNestedModal: (hasOpenNestedModal: boolean) => void;
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

export const useModalTrigger = () => {
  const modalTriggerContext = useModalTriggerContext();
  return modalTriggerContext.state;
};

export type ModalTriggerProviderProps = {
  /**
   * Modal state.
   */
  state: ModalTriggerContextType["state"];

  /**
   * Whether or not the modal is dismissable.
   */
  isDismissable: ModalTriggerContextType["isDismissable"];

  /**
   * Modal wrap content.
   */
  children: React.ReactNode;
};

export function ModalTriggerProvider(props: ModalTriggerProviderProps) {
  const { state, isDismissable, children } = props;
  const parentModalTriggerContext = useContext(ModalTriggerContext);
  const [hasOpenNestedModal, setHasOpenNestedModal] = useState(false);

  const context = useMemo(() => {
    return { hasOpenNestedModal, setHasOpenNestedModal, state, isDismissable };
  }, [hasOpenNestedModal, state, isDismissable]);

  useLayoutEffect(() => {
    if (!parentModalTriggerContext) {
      return;
    }
    if (state.isOpen && !parentModalTriggerContext.hasOpenNestedModal) {
      parentModalTriggerContext.setHasOpenNestedModal(true);
    }
    if (!state.isOpen && parentModalTriggerContext.hasOpenNestedModal) {
      parentModalTriggerContext.setHasOpenNestedModal(false);
    }
  }, [parentModalTriggerContext, state.isOpen]);

  return (
    <ModalTriggerContext.Provider value={context}>
      {children}
    </ModalTriggerContext.Provider>
  );
}
