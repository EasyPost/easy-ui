import React, { ReactNode } from "react";
import { FocusableElement } from "@react-types/shared";
import {
  DOMAttributes,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
// SSR-safe `useLayoutEffect`: behaves as `useLayoutEffect` on the client and
// no-ops without warning on the server, where `ModalTriggerProvider` still
// renders.
import { useLayoutEffect } from "@react-aria/utils";
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
  /**
   * Whether an open descendant modal (at any depth) hosts third-party overlays
   * (`allowsThirdPartyOverlays`). A focus-trapping modal reads this to stop
   * hiding/trapping the page while such a descendant is open, so the descendant's
   * injected overlay (e.g. Stripe Link) isn't `inert`'d or robbed of focus.
   */
  hasOpenThirdPartyDescendant: boolean;
  /**
   * Registers that this modal's subtree contains an open third-party-overlay
   * modal, propagating up to every ancestor. Returns a cleanup that unregisters
   * it. Like {@link registerNested}, callers invoke this from an effect tied to
   * open state so the count stays accurate across open/close/unmount.
   */
  registerThirdPartyOverlay: () => () => void;
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
  /**
   * Whether this modal hosts third-party overlays itself. Used to register this
   * modal's subtree with focus-trapping ancestors so they can relax while it's
   * open. This is the underlay's behavior; the provider only needs it to drive
   * registration.
   */
  allowsThirdPartyOverlays?: boolean;
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
  allowsThirdPartyOverlays,
  isOpen,
}: {
  childNestingBehavior: ModalNestingBehavior | undefined;
  selfNestingBehavior: ModalNestingBehavior | undefined;
  allowsThirdPartyOverlays: boolean;
  isOpen: boolean;
}) {
  const parentContext = useContext(ModalTriggerContext);
  const [replacingChildCount, setReplacingChildCount] = useState(0);
  const [thirdPartyDescendantCount, setThirdPartyDescendantCount] = useState(0);

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
  //
  // This must be a layout effect, not a passive one. When this modal closes, the
  // cleanup unhides the parent (the parent is kept mounted but `display: none`
  // while replaced). A passive cleanup runs *after* the browser paints, so the
  // frame between this modal unmounting and the parent unhiding shows neither —
  // a visible flash. A layout cleanup runs synchronously during commit and the
  // parent's unhide is flushed before paint, closing that gap.
  const parentRegisterNested = parentContext?.registerNested;
  const selfReplacesParent = selfNesting === "replace";
  useLayoutEffect(() => {
    if (!parentRegisterNested || !isOpen) {
      return;
    }
    return parentRegisterNested(selfReplacesParent);
  }, [parentRegisterNested, isOpen, selfReplacesParent]);

  // Counts open third-party-overlay modals anywhere in this modal's subtree. A
  // counter (not a boolean) keeps independent descendants from clobbering each
  // other; functional updates avoid stale reads across calls.
  const registerThirdPartyOverlay = useCallback(() => {
    setThirdPartyDescendantCount((count) => count + 1);
    let released = false;
    return () => {
      if (released) {
        return;
      }
      released = true;
      setThirdPartyDescendantCount((count) => Math.max(0, count - 1));
    };
  }, []);

  // Propagate third-party-overlay presence up the whole ancestor chain: this
  // modal registers with its parent when it either hosts a third-party overlay
  // itself or already has one open in its subtree. Bubbling means every
  // focus-trapping ancestor — not just the nearest — sees it and can relax,
  // which matters because react-aria keeps only the topmost `ariaHideOutside`
  // observer active (see ModalUnderlay). Layout effect for the same
  // flush-before-paint reasons as the `replace` registration above.
  const parentRegisterThirdPartyOverlay =
    parentContext?.registerThirdPartyOverlay;
  const hasThirdPartyInSubtree =
    allowsThirdPartyOverlays || thirdPartyDescendantCount > 0;
  useLayoutEffect(() => {
    if (
      !parentRegisterThirdPartyOverlay ||
      !isOpen ||
      !hasThirdPartyInSubtree
    ) {
      return;
    }
    return parentRegisterThirdPartyOverlay();
  }, [parentRegisterThirdPartyOverlay, isOpen, hasThirdPartyInSubtree]);

  return useMemo(
    () => ({
      isNested,
      hasReplacingChild: replacingChildCount > 0,
      childNestingBehavior: childNesting,
      selfNestingBehavior: selfNesting,
      registerNested,
      hasOpenThirdPartyDescendant: thirdPartyDescendantCount > 0,
      registerThirdPartyOverlay,
    }),
    [
      isNested,
      replacingChildCount,
      childNesting,
      selfNesting,
      registerNested,
      thirdPartyDescendantCount,
      registerThirdPartyOverlay,
    ],
  );
}

export function ModalTriggerProvider({
  state,
  isDismissable,
  childNestingBehavior,
  selfNestingBehavior,
  allowsThirdPartyOverlays = false,
  children,
}: ModalTriggerProviderProps) {
  const nesting = useModalNesting({
    childNestingBehavior,
    selfNestingBehavior,
    allowsThirdPartyOverlays,
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
