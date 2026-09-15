import React, { ReactNode, useEffect } from "react";
import { HorizontalStack } from "../HorizontalStack";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import { IconSymbol } from "../types";
import { classNames } from "../utilities/css";
import { ModalCloseButton } from "./ModalCloseButton";
import { useModalContext } from "./context";

import styles from "./Modal.module.scss";

// New flexible slot API - preferred method
export type ModalHeaderCustomProps = {
  /**
   * Renders `children` as-is, letting the consumer own the header's layout.
   * Compose with `<Modal.Title />`, which carries the modal's accessible name,
   * and `<Modal.CloseButton />`.
   */
  layout: "custom";

  /**
   * The content for the modal header.
   */
  children: ReactNode;
};

// Existing constrained API - for backwards compatibility
export type ModalHeaderTitleProps = {
  /**
   * How the header composes its content. `title` renders `children` as the
   * modal's heading; `custom` renders `children` as-is.
   *
   * @default title
   */
  layout?: "title";

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

export type ModalHeaderProps = ModalHeaderCustomProps | ModalHeaderTitleProps;

export function ModalHeader(props: ModalHeaderProps) {
  const modalContext = useModalContext();
  const className = classNames(
    styles.header,
    props.layout === "custom" && styles.headerCustom,
    modalContext.isHeaderStuck && styles.stuck,
  );

  // Dev guard: verify something actually claimed the id the dialog's
  // aria-labelledby points at. Checking the DOM rather than the children tree
  // means it works no matter how deeply `Modal.Title` is nested.
  const titleId = (modalContext.titleProps as { id?: string }).id;
  const isCustomLayout = props.layout === "custom";
  useEffect(() => {
    if (isCustomLayout && titleId && !document.getElementById(titleId)) {
      console.warn(
        "A custom Modal.Header should contain a Modal.Title so the modal has an accessible name",
      );
    }
  }, [isCustomLayout, titleId]);

  if (props.layout === "custom") {
    return <div className={className}>{props.children}</div>;
  }

  const { as = "h2", children, subtitle, iconAtStart, iconAtEnd } = props;

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
          ) : (
            <ModalCloseButton />
          )}
        </HorizontalStack>
        {subtitle && <Text variant="subtitle1">{subtitle}</Text>}
      </VerticalStack>
    </div>
  );
}
