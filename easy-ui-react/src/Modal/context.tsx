import React, { ReactNode } from "react";
import { FocusableElement } from "@react-types/shared";
import {
  DOMAttributes,
  RefObject,
  createContext,
  useContext,
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

export type ModalTriggerProviderProps = Pick<
  ModalTriggerContextType,
  "state" | "isDismissable"
> & {
  children: ReactNode;
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

export function ModalTriggerProvider({
  state,
  isDismissable,
  children,
}: ModalTriggerProviderProps) {
  const [hasOpenNestedModal, setHasOpenNestedModal] = useState(false);
  const context = useMemo(() => {
    return { hasOpenNestedModal, setHasOpenNestedModal, state, isDismissable };
  }, [hasOpenNestedModal, state, isDismissable]);
  return (
    <ModalTriggerContext.Provider value={context}>
      {children}
    </ModalTriggerContext.Provider>
  );
}
