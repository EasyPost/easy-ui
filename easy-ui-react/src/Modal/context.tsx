import React, { ReactNode } from "react";
import { FocusableElement } from "@react-types/shared";
import {
  DOMAttributes,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { OverlayTriggerState } from "react-stately";

/**
 * Controls how one modal in a nested stack presents relative to the modal it
 * connects to. The same value describes that connection from either end —
 * `childNestingBehavior` (set on the parent, cascades down) and
 * `selfNestingBehavior` (set on the child, local) — and resolves to:
 *
 * - `stack` — both modals keep their own backdrops; modals simply stack.
 * - `stack-shared-backdrop` — the nested modal suppresses its backdrop, so only
 *   the lowest modal's backdrop shows.
 * - `replace` — the nested modal hides the modal beneath it, so only the topmost
 *   modal is visible.
 */
export type ModalNestingBehavior =
  | "stack"
  | "stack-shared-backdrop"
  | "replace";

export type ModalContextType = {
  dialogProps: DOMAttributes<FocusableElement>;
  titleProps: DOMAttributes<FocusableElement>;
  isHeaderStuck: boolean;
  isFooterStuck: boolean;
  bodyRef: RefObject<HTMLDivElement | null>;
  headerInterceptorRef: RefObject<HTMLDivElement | null>;
  footerInterceptorRef: RefObject<HTMLDivElement | null>;
};

type ModalTriggerContextType = {
  isDismissable: boolean;
  state: OverlayTriggerState;
  /**
   * Whether this modal is nested under an open ancestor modal. Combined with
   * `selfNestingBehavior`, this decides whether the modal suppresses its own
   * backdrop.
   */
  isNested: boolean;
  /**
   * Whether this modal currently has one or more open nested modals whose
   * connection resolved to `replace`. When true, this modal hides itself so the
   * nested modal takes its place.
   */
  hasReplacingChild: boolean;
  /**
   * The resolved behavior this modal imposes on its children's connections.
   * Cascades: a child that sets neither `childNestingBehavior` nor
   * `selfNestingBehavior` inherits this value.
   */
  childNestingBehavior: ModalNestingBehavior;
  /**
   * The resolved behavior of this modal's connection to its parent. Drives this
   * modal's own rendering — suppressing its backdrop or hiding its parent.
   */
  selfNestingBehavior: ModalNestingBehavior;
  /**
   * Registers an open nested modal with this modal. The `replaces` argument
   * records whether that nested modal's connection resolved to `replace`.
   * Returns a cleanup that unregisters it. Callers invoke this from an effect
   * tied to the nested modal's open state so the count stays accurate across
   * open/close/unmount.
   */
  registerNested: (replaces: boolean) => () => void;
};

export type ModalTriggerProviderProps = Pick<
  ModalTriggerContextType,
  "state" | "isDismissable"
> & {
  children: ReactNode;
  /**
   * How this modal's nested children present relative to it. Cascades to
   * descendants. Defaults to the nearest ancestor's value, or `stack` at the
   * root.
   */
  childNestingBehavior?: ModalNestingBehavior;
  /**
   * How this modal presents relative to its parent. Local to this modal (does
   * not cascade) and overrides the parent's `childNestingBehavior` for this one
   * connection. Defaults to the parent's `childNestingBehavior`.
   */
  selfNestingBehavior?: ModalNestingBehavior;
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

/**
 * Resolves a modal's nesting connections and wires up parent/child registration,
 * returning the nesting values for the trigger context. A connection can be
 * configured from either end — the parent's `childNestingBehavior` (cascades) or
 * the child's `selfNestingBehavior` (local, wins for its own connection) — and
 * resolves to `stack`, `stack-shared-backdrop`, or `replace`. See
 * {@link ModalNestingBehavior}.
 */
function useModalNesting({
  childNestingBehavior,
  selfNestingBehavior,
  isOpen,
}: {
  childNestingBehavior: ModalNestingBehavior | undefined;
  selfNestingBehavior: ModalNestingBehavior | undefined;
  isOpen: boolean;
}) {
  const parentContext = useContext(ModalTriggerContext);
  const [replacingChildCount, setReplacingChildCount] = useState(0);

  // Both behaviors fall back to the parent's resolved `childNestingBehavior`
  // (which cascades), then `stack`. The child's `selfNestingBehavior` wins for
  // its own connection to the parent.
  const childNesting =
    childNestingBehavior ?? parentContext?.childNestingBehavior ?? "stack";
  const selfNesting =
    selfNestingBehavior ?? parentContext?.childNestingBehavior ?? "stack";

  // The provider tree mirrors the modal tree, and a modal's underlay only
  // renders while open, so a present parent context means this modal is nested
  // under an open ancestor.
  const isNested = parentContext != null;

  // A counter (rather than a boolean) keeps sibling nested modals independent:
  // closing one replacing modal must not un-hide this modal while another is
  // still open. Functional updates avoid reading stale state across calls.
  const registerNested = useCallback((replaces: boolean) => {
    if (!replaces) {
      return () => {};
    }
    setReplacingChildCount((count) => count + 1);
    let released = false;
    return () => {
      if (released) {
        return;
      }
      released = true;
      setReplacingChildCount((count) => Math.max(0, count - 1));
    };
  }, []);

  // If this modal's connection to its parent resolves to `replace`, register
  // that with the parent so the parent hides while this modal is open. We depend
  // on the parent's `registerNested` (stable for the parent's lifetime) rather
  // than the whole parent context, whose identity changes as its state updates —
  // depending on the full context would re-fire this effect and flicker the
  // modal.
  const parentRegisterNested = parentContext?.registerNested;
  const selfReplacesParent = selfNesting === "replace";
  useEffect(() => {
    if (!parentRegisterNested || !isOpen) {
      return;
    }
    return parentRegisterNested(selfReplacesParent);
  }, [parentRegisterNested, isOpen, selfReplacesParent]);

  return useMemo(
    () => ({
      isNested,
      hasReplacingChild: replacingChildCount > 0,
      childNestingBehavior: childNesting,
      selfNestingBehavior: selfNesting,
      registerNested,
    }),
    [isNested, replacingChildCount, childNesting, selfNesting, registerNested],
  );
}

export function ModalTriggerProvider({
  state,
  isDismissable,
  childNestingBehavior,
  selfNestingBehavior,
  children,
}: ModalTriggerProviderProps) {
  const nesting = useModalNesting({
    childNestingBehavior,
    selfNestingBehavior,
    isOpen: state.isOpen,
  });

  const context = useMemo(
    () => ({ ...nesting, state, isDismissable }),
    [nesting, state, isDismissable],
  );

  return (
    <ModalTriggerContext.Provider value={context}>
      {children}
    </ModalTriggerContext.Provider>
  );
}
