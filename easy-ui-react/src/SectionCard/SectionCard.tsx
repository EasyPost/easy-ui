import React, { ReactNode } from "react";
import { omit } from "lodash";
import {
  Card,
  CardAreaProps,
  CardContainerProps,
  CardProps,
  pickCardAreaProps,
} from "../Card";
import { Text, TextProps } from "../Text";
import { VerticalStack } from "../VerticalStack";

import styles from "./SectionCard.module.scss";
import { HorizontalStack } from "../HorizontalStack";

export type SectionCardProps = CardProps;
export type SectionCardContainerProps = CardContainerProps;
export type SectionCardAreaProps = CardAreaProps;
export type SectionCardTitleProps = TextProps;

export type SectionCardHeaderProps = {
  /** SectionCard header children. */
  children: ReactNode;
};

export type SectionCardActionsProps = {
  /** SectionCard actions children. */
  children: ReactNode;
};

export type SectionCardControlsProps = {
  /** SectionCard controls children. */
  children: ReactNode;
};

export type SectionCardTabsProps = {
  /** SectionCard tabs children. */
  children: ReactNode;
};

/**
 * A SectionCard is a styled container for grouping section content on a page.
 *
 * @example
 * <SectionCard>
 *   <SectionCard.Header>
 *     <SectionCard.Title>SectionTitle</SectionCard.Title>
 *   </SectionCard.Header>
 *   <div>Content</div>
 * </SectionCard>
 */
export function SectionCard(props: SectionCardProps) {
  const { children, ...cardProps } = props;
  const cardAreaProps = pickCardAreaProps(props);
  const cardContainerProps = omit(cardProps, Object.keys(cardAreaProps));
  return (
    <SectionCardContainer {...cardContainerProps}>
      <SectionCardArea {...cardAreaProps}>{children}</SectionCardArea>
    </SectionCardContainer>
  );
}

function SectionCardContainer(props: SectionCardContainerProps) {
  const { children, ...cardContainerProps } = props;
  return (
    <Card.Container
      as="section"
      variant="solid"
      boxShadow="2"
      borderRadius="lg"
      {...cardContainerProps}
    >
      <VerticalStack>{children}</VerticalStack>
    </Card.Container>
  );
}

function SectionCardArea(props: SectionCardAreaProps) {
  const { children, ...cardAreaProps } = props;
  return (
    <Card.Area padding="3" {...cardAreaProps}>
      <VerticalStack gap="2">{children}</VerticalStack>
    </Card.Area>
  );
}

function SectionCardHeader(props: SectionCardHeaderProps) {
  return <div className={styles.header}>{props.children}</div>;
}

function SectionCardControls(props: SectionCardControlsProps) {
  return <div className={styles.controls}>{props.children}</div>;
}

function SectionCardActions(props: SectionCardActionsProps) {
  return (
    <HorizontalStack align="end" gap="1">
      {props.children}
    </HorizontalStack>
  );
}

function SectionCardTitle(props: TextProps) {
  return <Text variant="heading5" as="h2" {...props} />;
}

function SectionCardTabs(props: SectionCardTabsProps) {
  const { children } = props;
  return <div className={styles.tabs}>{children}</div>;
}

/**
 * Represents the outer container of a SectionCard.
 */
SectionCard.Container = SectionCardContainer;

/**
 * Represents the inner area of a SectionCard.
 */
SectionCard.Area = SectionCardArea;

/**
 * Represents the header of a SectionCard.
 */
SectionCard.Header = SectionCardHeader;

/**
 * Represents the actions of a SectionCard.
 */
SectionCard.Actions = SectionCardActions;

/**
 * Represents the middle controls of a SectionCard.
 */
SectionCard.Controls = SectionCardControls;

/**
 * Represents the title of a SectionCard. Use within a SectionCard.Header.
 */
SectionCard.Title = SectionCardTitle;

/**
 * Represents a tabs container for a SectionCard. Use around a TabPanels.Tabs or a TabNav.
 */
SectionCard.Tabs = SectionCardTabs;
