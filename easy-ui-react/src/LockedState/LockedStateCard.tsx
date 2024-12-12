import React, { ReactNode } from "react";
import { Text, TextProps } from "../Text";
import { Card, CardProps } from "../Card";
import { VerticalStack, VerticalStackProps } from "../VerticalStack";
import { HorizontalStack, HorizontalStackProps } from "../HorizontalStack";
import { classNames } from "../utilities/css";

import styles from "./LockedStateCard.module.scss";

export type LockedStateCardProps = CardProps & {
  /**
   * The children of the <LockedStateCard> element.
   */
  children: ReactNode;
};

/**
 * An `<LockedStateCard />` is a styled container designed to display relevant information when a user is locked out of a feature or functionality.
 *
 * @remarks
 * Supports custom spacing and alignment between elements.
 *
 * @example
 * _Basic:_
 * ```tsx
 * <LockedStateCard>
 *  <LockedStateCard.Section>
 *    <LockedStateCard.TextGroup>
 *     <LockedStateCard.Icon>
 *      <Icon />
 *      <LockedStateCard.HeaderText>
 *        Shipment Insurance
 *      </LockedStateCard.HeaderText>
 *      <LockedStateCard.BodyText>
 *        Rest easy knowing if one of your customers orders is damaged, lost
 *        in transit or stolen you are covered! Automatically add insurance
 *        to all your shipments
 *      </LockedStateCard.BodyText>
 *    </LockedStateCard.TextGroup>
 *    <LockedStateCard.ActionGroup>
 *      <Button>Manage Insurance Settings</Button>
 *    </LockedStateCard.ActionGroup>
 *  </LockedStateCard.Section>
 * </LockedStateCard>
 * ```
 *
 * @example
 * _Alignment:_
 * ```tsx
 * <LockedStateCard>
 *  <LockedStateCard.Section inlineAlign="center">
 *    <LockedStateCard.TextGroup gap="2">
 *      <LockedStateCard.HeaderText>
 *        Shipment Insurance
 *      </LockedStateCard.HeaderText>
 *      <LockedStateCard.BodyText>
 *        Rest easy knowing if one of your customers orders is damaged, lost
 *        in transit or stolen you are covered! Automatically add insurance
 *        to all your shipments
 *      </LockedStateCard.BodyText>
 *    </LockedStateCard.TextGroup>
 *    <LockedStateCard.ActionGroup>
 *      <Button>Manage Insurance Settings</Button>
 *    </LockedStateCard.ActionGroup>
 *  </LockedStateCard.Section>
 * </LockedStateCard>
 * ```
 */
export function LockedStateCard(props: LockedStateCardProps) {
  const { children, ...cardProps } = props;

  return (
    <Card
      variant="solid"
      background="secondary.050"
      borderRadius="lg"
      padding="0"
      boxShadow="1"
      {...cardProps}
    >
      {children}
    </Card>
  );
}

function LockedStateCardSection(props: VerticalStackProps) {
  const { gap = "2", inlineAlign = "start", children, ...restProps } = props;

  const isInlineSection = inlineAlign === "center";

  const sectionClassName = classNames(
    styles.container,
    isInlineSection && styles.inlineMargin,
  );

  return (
    <div className={sectionClassName}>
      <Card.Area padding="5">
        <VerticalStack gap={gap} inlineAlign={inlineAlign} {...restProps}>
          {children}
        </VerticalStack>
      </Card.Area>
    </div>
  );
}

function LockedStateCardTextGroup(props: VerticalStackProps) {
  const { gap = "1", children, ...restProps } = props;
  return (
    <VerticalStack gap={gap} {...restProps}>
      {children}
    </VerticalStack>
  );
}

function LockedStateCardActionGroup(props: HorizontalStackProps) {
  const { gap = "1", align = "space-between", children, ...restProps } = props;
  return (
    <HorizontalStack gap={gap} align={align} {...restProps}>
      {children}
    </HorizontalStack>
  );
}

function LockedStateCardHeaderText(props: TextProps) {
  const {
    variant = "subtitle1",
    color = "neutral.900",
    ...restTextProps
  } = props;

  return <Text variant={variant} color={color} {...restTextProps} />;
}

function LockedStateCardBodyText(props: TextProps) {
  const { variant = "body2", color = "neutral.900", ...restTextProps } = props;

  return <Text variant={variant} color={color} {...restTextProps} />;
}

LockedStateCard.displayName = "LockedStateCard";

/** Represents a section in a `<LockedStateCard />`*/
LockedStateCard.Section = LockedStateCardSection;

/** Represents the text group in a `<LockedStateCard />`*/
LockedStateCard.TextGroup = LockedStateCardTextGroup;

/** Represents header text in a `<LockedStateCard />`*/
LockedStateCard.HeaderText = LockedStateCardHeaderText;

/** Represents body text in a `<LockedStateCard />`*/
LockedStateCard.BodyText = LockedStateCardBodyText;

/** Represents the action group in a `<LockedStateCard />`*/
LockedStateCard.ActionGroup = LockedStateCardActionGroup;
