import React from "react";
import { Button, ButtonColor } from "../Button";
import { classNames } from "../utilities/css";
import { useModalContext } from "./context";

import styles from "./Modal.module.scss";

type ModalFooterProps = {
  /**
   * Primary action slot.
   */
  primaryAction: {
    color?: ButtonColor;
    content: string;
    onAction: () => void;
    isDisabled?: boolean;
  };

  /**
   * Secondary action slot.
   */
  secondaryAction?: {
    color?: ButtonColor;
    content: string;
    onAction: () => void;
    isDisabled?: boolean;
  };
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
        <Button
          onPress={secondaryAction.onAction}
          color={secondaryAction.color ? secondaryAction.color : "neutral"}
          isDisabled={secondaryAction.isDisabled}
        >
          {secondaryAction.content}
        </Button>
      )}
      <Button
        onPress={primaryAction.onAction}
        isDisabled={primaryAction.isDisabled}
        color={primaryAction.color ? primaryAction.color : undefined}
      >
        {primaryAction.content}
      </Button>
    </div>
  );
}
