import React, { ReactElement, cloneElement, useMemo } from "react";
import { useOverlayTrigger } from "react-aria";
import { useOverlayTriggerState } from "react-stately";
import { ModalWrap } from "./ModalWrap";
import { ModalTriggerContext } from "./context";

type CloseableModalElement = (close: () => void) => ReactElement;

type ModalTriggerProps = {
  /**
   * Content of modal trigger. Must be exactly two elements.
   */
  children: [ReactElement, CloseableModalElement | ReactElement];

  /**
   * Whether or not the modal can be dismissed.
   */
  isDismissable?: boolean;
};

export function ModalTrigger(props: ModalTriggerProps) {
  const { children, isDismissable = true, ...inTriggerProps } = props;

  const state = useOverlayTriggerState(inTriggerProps);
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: "dialog" },
    state,
  );

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
    <ModalTriggerContext.Provider value={context}>
      {cloneElement(trigger, triggerProps)}
      {state.isOpen && (
        <ModalWrap {...props} state={state}>
          {cloneElement(
            typeof modal === "function" ? modal(state.close) : modal,
            overlayProps,
          )}
        </ModalWrap>
      )}
    </ModalTriggerContext.Provider>
  );
}
