import React, { ReactNode } from "react";
import { Card, CardAreaProps, CardContainerProps, CardProps } from "../Card";
import { HorizontalStack } from "../HorizontalStack";
import { Text, TextProps } from "../Text";
import { VerticalStack } from "../VerticalStack";

import styles from "./SectionCard.module.scss";

export type SectionCardProps = CardProps;

export type SectionCardContainerProps = CardContainerProps;

export type SectionCardTabsContainerProps = SectionCardContainerProps;

export type SectionCardAreaProps = CardAreaProps;

export type SectionCardHeaderProps = {
  children: ReactNode;
};

export type SectionCardTitleProps = TextProps;

export function SectionCard(props: SectionCardProps) {
  const { background, children, padding, ...containerProps } = props;
  return (
    <SectionCardContainer {...containerProps}>
      <SectionCardArea background={background} padding={padding}>
        {children}
      </SectionCardArea>
    </SectionCardContainer>
  );
}

function SectionCardContainer(props: SectionCardContainerProps) {
  const { children, ...cardContainerProps } = props;
  return (
    <Card.Container as="section" variant="outlined" {...cardContainerProps}>
      <VerticalStack>{children}</VerticalStack>
    </Card.Container>
  );
}

function SectionCardTabsContainer(props: SectionCardTabsContainerProps) {
  const { children, ...cardContainerProps } = props;
  return (
    <SectionCardContainer {...cardContainerProps}>
      <div className={styles.tabsContainerSpacer} />
      {children}
    </SectionCardContainer>
  );
}

function SectionCardHeader(props: SectionCardHeaderProps) {
  return (
    <HorizontalStack blockAlign="center" align="space-between" gap="2">
      {props.children}
    </HorizontalStack>
  );
}

function SectionCardTitle(props: TextProps) {
  return <Text variant="heading5" as="h2" {...props} />;
}

function SectionCardArea(props: SectionCardAreaProps) {
  const { children, ...cardAreaProps } = props;
  return (
    <Card.Area {...cardAreaProps}>
      <VerticalStack gap="2">{children}</VerticalStack>
    </Card.Area>
  );
}

SectionCard.Container = SectionCardContainer;
SectionCard.TabsContainer = SectionCardTabsContainer;
SectionCard.Area = SectionCardArea;
SectionCard.Header = SectionCardHeader;
SectionCard.Title = SectionCardTitle;
