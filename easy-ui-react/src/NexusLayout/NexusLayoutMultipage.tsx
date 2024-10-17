import React, { ReactNode } from "react";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";

import styles from "./NexusLayoutMultipage.module.scss";

export function NexusLayoutMultipageContainer(props: { children: ReactNode }) {
  const { children } = props;
  return <div className={styles.container}>{children}</div>;
}

export function NexusLayoutMultipageSidebar(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <div role="region" className={styles.sidebar}>
      {children}
    </div>
  );
}

export function NexusLayoutMultipageContent(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <div className={styles.content}>
      <VerticalStack gap="2">{children}</VerticalStack>
    </div>
  );
}

export function NexusLayoutMultipageHeader(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <HorizontalStack as="header" blockAlign="center" align="space-between">
      {children}
    </HorizontalStack>
  );
}

export function NexusLayoutMultipageTitle(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <Text as="h3" variant="heading5">
      {children}
    </Text>
  );
}
