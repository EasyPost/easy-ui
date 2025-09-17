import CloseIcon from "@easypost/easy-ui-icons/Close";
import React, { ReactNode } from "react";
import { HorizontalStack } from "../HorizontalStack";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import { IconSymbol } from "../types";
import { classNames } from "../utilities/css";
import { useModalContext, useModalTriggerContext } from "./context";

import styles from "./Modal.module.scss";

export type ModalHeaderProps = {
  /**
   * Modal header element type. Should be a valid document heading level.
   *
   * @default h2
   */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  /**
   * The content for the title of the modal.
   */
  children: ReactNode;

  /**
   * The content for the subtitle of the modal.
   */
  subtitle?: ReactNode;

  /**
   * Icon to display at the start of the header title.
   */
  iconAtStart?: {
    accessibilityLabel?: string;
    symbol: IconSymbol;
  };

  /**
   * Icon to display at the end of the header title.
   */
  iconAtEnd?: {
    accessibilityLabel?: string;
    symbol: IconSymbol;
    size?: "md" | "2xl";
  };
};

export function ModalHeader(props: ModalHeaderProps) {
  const { as = "h2", children, subtitle, iconAtStart, iconAtEnd } = props;
  const modalContext = useModalContext();
  const modalTriggerContext = useModalTriggerContext();
  const className = classNames(
    styles.header,
    modalContext.isHeaderStuck && styles.stuck,
  );
  return (
    <div className={className}>
      <VerticalStack gap="1.5">
        <HorizontalStack align="space-between" blockAlign="center" wrap={false}>
          <HorizontalStack gap="2" wrap={false}>
            {iconAtStart && (
              <span>
                <Icon {...iconAtStart} size="lg" />
              </span>
            )}
            <Text
              as={as}
              variant="heading4"
              truncate
              {...modalContext.titleProps}
            >
              {children}
            </Text>
          </HorizontalStack>
          {iconAtEnd ? (
            <span className={styles.iconAtEnd} data-size={iconAtEnd.size}>
              <Icon {...iconAtEnd} />
            </span>
          ) : modalTriggerContext.isDismissable ? (
            <button
              className={styles.closeBtn}
              onClick={() => {
                modalTriggerContext.state.close();
              }}
            >
              <Text visuallyHidden>Close modal</Text>
              <Icon symbol={CloseIcon} size="sm" />
            </button>
          ) : null}
        </HorizontalStack>
        {subtitle && <Text variant="subtitle1">{subtitle}</Text>}
      </VerticalStack>
    </div>
  );
}
