import React, { ReactNode } from "react";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";

import styles from "./NexusLayoutMultipage.module.scss";

export type NexusLayoutMultipageContainerProps = {
  /** Multipage container children. */
  children: ReactNode;
};

export type NexusLayoutMultipageSidebarProps = {
  /** Multipage container sidebar children. */
  children: ReactNode;
};

export type NexusLayoutMultipageContentProps = {
  /** Multipage container content children. */
  children: ReactNode;
};

export type NexusLayoutMultipageHeaderProps = {
  /** Multipage container header children. */
  children: ReactNode;
};

export type NexusLayoutMultipageTitleProps = {
  /** Multipage container title text. */
  children: ReactNode;
};

export function NexusLayoutMultipageContainer(
  props: NexusLayoutMultipageContainerProps,
) {
  const { children } = props;
  return <div className={styles.container}>{children}</div>;
}

export function NexusLayoutMultipageSidebar(
  props: NexusLayoutMultipageSidebarProps,
) {
  const { children } = props;
  return (
    <div role="region" className={styles.sidebar}>
      {children}
    </div>
  );
}

export function NexusLayoutMultipageContent(
  props: NexusLayoutMultipageContentProps,
) {
  const { children } = props;
  return (
    <div className={styles.content}>
      <VerticalStack gap="2">{children}</VerticalStack>
    </div>
  );
}

export function NexusLayoutMultipageHeader(
  props: NexusLayoutMultipageHeaderProps,
) {
  const { children } = props;
  return (
    <HorizontalStack as="header" blockAlign="center" align="space-between">
      {children}
    </HorizontalStack>
  );
}

export function NexusLayoutMultipageTitle(
  props: NexusLayoutMultipageTitleProps,
) {
  const { children } = props;
  return (
    <Text as="h3" variant="heading5">
      {children}
    </Text>
  );
}
