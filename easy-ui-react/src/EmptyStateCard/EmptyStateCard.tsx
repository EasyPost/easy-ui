import React, { ReactNode } from "react";
import { Text, TextProps } from "../Text";
import { Card } from "../Card";
import { VerticalStack, VerticalStackProps } from "../VerticalStack";
import { HorizontalStack, HorizontalStackProps } from "../HorizontalStack";
import { classNames } from "../utilities/css";

import { BASE_64_BLUE_BOX, BASE_64_CLAPPING_BENJAMIN } from "./utilities";
import styles from "./EmptyStateCard.module.scss";

export type EmptyStateCardProps = {
  /**
   * The children of the <EmptyStateCard> element.
   */
  children: ReactNode;
};

/**
 * An `<EmptyStateCard />` is a styled container designed to display
 * relevant information when there is no nearby data to display.
 *
 * @remarks
 * Supports custom spacing and alignment between elements and multiple sections.
 *
 * @example
 * _Basic:_
 * ```tsx
 * <EmptyStateCard>
 *  <EmptyStateCard.Section>
 *    <EmptyStateCard.TextGroup>
 *      <EmptyStateCard.HeaderText>
 *        Shipment Insurance
 *      </EmptyStateCard.HeaderText>
 *      <EmptyStateCard.BodyText>
 *        Rest easy knowing if one of your customers orders is damaged, lost
 *        in transit or stolen you are covered! Automatically add insurance
 *        to all your shipments
 *      </EmptyStateCard.BodyText>
 *    </EmptyStateCard.TextGroup>
 *    <EmptyStateCard.ActionGroup>
 *      <Button>Manage Insurance Settings</Button>
 *    </EmptyStateCard.ActionGroup>
 *  </EmptyStateCard.Section>
 * </EmptyStateCard>
 * ```
 *
 * @example
 * _Alignment:_
 * ```tsx
 * <EmptyStateCard>
 *  <EmptyStateCard.Section inlineAlign="center">
 *    <EmptyStateCard.TextGroup gap="2">
 *      <EmptyStateCard.HeaderText>
 *        Shipment Insurance
 *      </EmptyStateCard.HeaderText>
 *      <EmptyStateCard.BodyText>
 *        Rest easy knowing if one of your customers orders is damaged, lost
 *        in transit or stolen you are covered! Automatically add insurance
 *        to all your shipments
 *      </EmptyStateCard.BodyText>
 *    </EmptyStateCard.TextGroup>
 *    <EmptyStateCard.ActionGroup>
 *      <Button>Manage Insurance Settings</Button>
 *    </EmptyStateCard.ActionGroup>
 *  </EmptyStateCard.Section>
 * </EmptyStateCard>
 * ```
 */
export function EmptyStateCard(props: EmptyStateCardProps) {
  const { children } = props;

  return (
    <Card background="primary.800" borderRadius="lg" padding="0" boxShadow="1">
      {children}
    </Card>
  );
}

function EmptyStateCardMultiSection(props: HorizontalStackProps) {
  const {
    children,
    gap = "5",
    align = "space-between",
    wrap = false,
    ...restProps
  } = props;
  return (
    <HorizontalStack gap={gap} align={align} wrap={wrap} {...restProps}>
      {children}
    </HorizontalStack>
  );
}

export type EmptyStateCardSectionProps = VerticalStackProps & {
  /**
   * Renders a section with a decorative background.
   * @default false
   */
  hasDecorativeBackground?: boolean;
};

function EmptyStateCardSection(props: EmptyStateCardSectionProps) {
  const {
    gap = "2",
    hasDecorativeBackground = false,
    inlineAlign = "start",
    children,
    ...restProps
  } = props;

  const isInlineSection = inlineAlign === "center";

  const sectionClassName = classNames(
    styles.container,
    isInlineSection && styles.inlineMargin,
  );

  const decorativeImageStyle = {
    backgroundImage: `url("data:image/svg+xml;base64,${BASE_64_CLAPPING_BENJAMIN}"), url("data:image/svg+xml;base64,${BASE_64_BLUE_BOX}")`,
  } as React.CSSProperties;

  return (
    <div className={sectionClassName}>
      {!hasDecorativeBackground ? (
        <Card.Area padding="5">
          <VerticalStack gap={gap} inlineAlign={inlineAlign} {...restProps}>
            {children}
          </VerticalStack>
        </Card.Area>
      ) : (
        <Card.Area padding="0">
          <div className={styles.decorative} style={decorativeImageStyle}>
            <div className={styles.decorativeContent}>
              <VerticalStack gap={gap} inlineAlign={inlineAlign} {...restProps}>
                {children}
              </VerticalStack>
            </div>
          </div>
        </Card.Area>
      )}
    </div>
  );
}

function EmptyStateCardTextGroup(props: VerticalStackProps) {
  const { gap = "1", children, ...restProps } = props;
  return (
    <VerticalStack gap={gap} {...restProps}>
      {children}
    </VerticalStack>
  );
}

function EmptyStateCardActionGroup(props: HorizontalStackProps) {
  const { gap = "1", align = "space-between", children, ...restProps } = props;
  return (
    <HorizontalStack gap={gap} align={align} {...restProps}>
      {children}
    </HorizontalStack>
  );
}

function EmptyStateCardHeaderText(props: TextProps) {
  const {
    variant = "heading5",
    color = "neutral.000",
    ...restTextProps
  } = props;

  return <Text variant={variant} color={color} {...restTextProps} />;
}

function EmptyStateCardBodyText(props: TextProps) {
  const {
    variant = "subtitle1",
    color = "neutral.000",
    ...restTextProps
  } = props;

  return <Text variant={variant} color={color} {...restTextProps} />;
}

EmptyStateCard.displayName = "EmptyStateCard";

/** Represents a container for multiple sections in a `<EmptyStateCard />`*/
EmptyStateCard.MultiSection = EmptyStateCardMultiSection;

/** Represents a section in a `<EmptyStateCard />`*/
EmptyStateCard.Section = EmptyStateCardSection;

/** Represents the text group in a `<EmptyStateCard />`*/
EmptyStateCard.TextGroup = EmptyStateCardTextGroup;

/** Represents header text in a `<EmptyStateCard />`*/
EmptyStateCard.HeaderText = EmptyStateCardHeaderText;

/** Represents body text in a `<EmptyStateCard />`*/
EmptyStateCard.BodyText = EmptyStateCardBodyText;

/** Represents the action group in a `<EmptyStateCard />`*/
EmptyStateCard.ActionGroup = EmptyStateCardActionGroup;
