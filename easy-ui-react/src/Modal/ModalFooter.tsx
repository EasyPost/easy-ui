import React from "react";
import { Button } from "../Button";
import { classNames } from "../utilities/css";
import { useModalContext } from "./context";

import styles from "./Modal.module.scss";

type ModalAction = {
  /**
   * Content of the action.
   */
  content: string;

  /**
   * Event that's triggered by the action.
   */
  onAction: () => void;
};

type ModalFooterProps = {
  /**
   * Primary action slot.
   */
  primaryAction: ModalAction;

  /**
   * Secondary action slot.
   */
  secondaryAction?: ModalAction;
};

export function ModalFooter(props: ModalFooterProps) {
  const { primaryAction, secondaryAction } = props;
  const modalContext = useModalContext();
  const className = classNames(
    styles.footer,
    modalContext.isFooterStuck && styles.stuck,
  );
  return (
    <div className={className}>
      {secondaryAction && (
        <Button onPress={secondaryAction.onAction} color="neutral">
          {secondaryAction.content}
        </Button>
      )}
      <Button onPress={primaryAction.onAction}>{primaryAction.content}</Button>
    </div>
  );
}
