import React, { ReactElement, cloneElement, useMemo, useState } from "react";
import { useOverlayTrigger } from "react-aria";
import { useOverlayTriggerState } from "react-stately";
import { DrawerUnderlay } from "./DrawerUnderlay";
import { DrawerTriggerContext } from "./context";

export type CloseableDrawerElement = (close: () => void) => ReactElement;

export type DrawerTriggerProps = {
  /**
   * Content of modal trigger. Must be exactly two elements.
   */
  children: [ReactElement, CloseableDrawerElement | ReactElement];

  /**
   * Whether the modal is open by default (uncontrolled).
   */
  defaultOpen?: boolean;

  /**
   * Whether or not the modal can be dismissed.
   */
  isDismissable?: boolean;

  /**
   * Whether the modal is open by default (controlled).
   */
  isOpen?: boolean;

  /**
   * Handler that is called when the overlay's open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
};

export function DrawerTrigger(props: DrawerTriggerProps) {
  const { children, isDismissable = true, ...inTriggerProps } = props;

  const state = useOverlayTriggerState(inTriggerProps);
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: "dialog" },
    state,
  );
  const [animationExited, setAnimationExited] = useState(!state.isOpen);

  if (children.length !== 2) {
    throw new Error(
      "children must be exactly one trigger element and one modal element",
    );
  }

  const [trigger, modal] = children;

  const context = useMemo(() => {
    return { state, isDismissable };
  }, [isDismissable, state]);

  return (
    <DrawerTriggerContext.Provider value={context}>
      {cloneElement(trigger, triggerProps)}
      {(state.isOpen || !animationExited) && (
        <DrawerUnderlay
          setAnimationExited={setAnimationExited}
          {...props}
          state={state}
        >
          {cloneElement(
            typeof modal === "function" ? modal(state.close) : modal,
            overlayProps,
          )}
        </DrawerUnderlay>
      )}
    </DrawerTriggerContext.Provider>
  );
}
