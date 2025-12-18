import React from "react";
import { Button, ButtonColor } from "../Button";
import { classNames } from "../utilities/css";
import { useModalContext } from "./context";

import styles from "./Modal.module.scss";

type LegacyAction = {
  color?: ButtonColor;
  content: string;
  onAction: () => void;
  isDisabled?: boolean;
};

// New flexible slot API - preferred method
type ModalFooterSlotProps = {
  /**
   * If `children` is provided, the footer renders this content.
   */
  children: React.ReactNode;
};

// Existing constrained API - for backwards compatibility
type ModalFooterActionsProps = {
  /**
   * Primary action slot.
   */
  primaryAction: LegacyAction;

  /**
   * Secondary action slot.
   */
  secondaryAction?: LegacyAction;
};

export type ModalFooterProps = ModalFooterSlotProps | ModalFooterActionsProps;

export function ModalFooter(props: ModalFooterProps) {
  const modalContext = useModalContext();

  const className = classNames(
    styles.footer,
    "children" in props ? styles.footerSlot : styles.footerActions,
    modalContext.isFooterStuck && styles.stuck,
  );

  if ("children" in props) {
    return <div className={className}>{props.children}</div>;
  }

  const { primaryAction, secondaryAction } = props;

  return (
    <div className={className}>
      {secondaryAction && (
        <Button
          onPress={secondaryAction.onAction}
          color={secondaryAction.color ?? "neutral"}
          isDisabled={secondaryAction.isDisabled}
        >
          {secondaryAction.content}
        </Button>
      )}
      <Button
        onPress={primaryAction.onAction}
        color={primaryAction.color}
        isDisabled={primaryAction.isDisabled}
      >
        {primaryAction.content}
      </Button>
    </div>
  );
}
