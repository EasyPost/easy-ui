import React, { ReactNode } from "react";
import { Card } from "../Card";
import { VerticalStack } from "../VerticalStack";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";

import styles from "./SectionCard.module.scss";

export type SectionCardProps = {
  children: ReactNode;
};

export type SectionCardContainerProps = {
  children: ReactNode;
};

export type SectionCardContentProps = {
  children: ReactNode;
};

export type SectionCardHeaderProps = {
  title?: ReactNode;
  controls?: ReactNode;
  actions?: ReactNode;
};

export function SectionCard(props: SectionCardProps) {
  return (
    <SectionCardContainer>
      <SectionCardContent>{props.children}</SectionCardContent>
    </SectionCardContainer>
  );
}

function SectionCardContainer(props: SectionCardContainerProps) {
  return (
    <Card.Container>
      <VerticalStack>{props.children}</VerticalStack>
    </Card.Container>
  );
}

function SectionCardTabsContainer(props: SectionCardContainerProps) {
  return (
    <Card.Container>
      <VerticalStack>
        <div className={styles.tabsContainerSpacer} />
        {props.children}
      </VerticalStack>
    </Card.Container>
  );
}

function SectionCardHeader(props: SectionCardHeaderProps) {
  return (
    <HorizontalStack blockAlign="center" align="space-between" gap="2">
      <Text variant="heading5">{props.title}</Text>
      {props.controls}
      {props.actions}
    </HorizontalStack>
  );
}

function SectionCardContent(props: SectionCardContentProps) {
  return (
    <Card.Area>
      <VerticalStack gap="2">{props.children}</VerticalStack>
    </Card.Area>
  );
}

SectionCard.Container = SectionCardContainer;
SectionCard.TabsContainer = SectionCardTabsContainer;
SectionCard.Content = SectionCardContent;
SectionCard.Header = SectionCardHeader;
