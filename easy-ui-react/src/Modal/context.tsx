import { FocusableElement } from "@react-types/shared";
import React, {
  DOMAttributes,
  ReactNode,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
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
  setNestedModalOpen: (id: string, open: boolean) => void;
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
  const id = useId();
  const idRef = useRef(id);
  const [, forceRerender] = useState([]);
  const nestedModalSetRef = useRef<Set<string>>(new Set());
  const parentContext = useContext(ModalTriggerContext);
  const openNestedModalCount = nestedModalSetRef.current.size;
  const hasOpenNestedModal = openNestedModalCount > 0;

  const setNestedModalOpen = useCallback((id: string, isOpen: boolean) => {
    if (isOpen && !nestedModalSetRef.current.has(id)) {
      nestedModalSetRef.current.add(id);
      forceRerender([]);
    }
    if (!isOpen && nestedModalSetRef.current.has(id)) {
      nestedModalSetRef.current.delete(id);
      forceRerender([]);
    }
  }, []);

  const context = useMemo(
    () => ({ state, hasOpenNestedModal, setNestedModalOpen, isDismissable }),
    [state, hasOpenNestedModal, setNestedModalOpen, isDismissable],
  );

  useLayoutEffect(() => {
    if (!parentContext) {
      return;
    }
    const id = idRef.current;
    const isOpen = state.isOpen || hasOpenNestedModal;
    parentContext.setNestedModalOpen(id, isOpen);
    return () => {
      parentContext.setNestedModalOpen(id, false);
    };
  }, [parentContext, state.isOpen, hasOpenNestedModal]);

  return (
    <ModalTriggerContext.Provider value={context}>
      {children}
    </ModalTriggerContext.Provider>
  );
}
