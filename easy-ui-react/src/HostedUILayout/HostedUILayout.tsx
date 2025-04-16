import React, { ReactNode } from "react";
import { EasyPostLogo } from "../utilities/EasyPostLogo";
import { HorizontalStack } from "../HorizontalStack";
import {
  HostedUILayoutActionBadge,
  HostedUILayoutActions,
  HostedUILayoutButtonAction,
  HostedUILayoutLinkAction,
  HostedUILayoutMenuAction,
} from "./HostedUILayoutActions";

import styles from "./HostedUILayout.module.scss";

export type HostedUILayoutProps = {
  /** Layout children. */
  children: ReactNode;
};

export type HostedUILayoutHeaderProps = {
  /** Header children. */
  children: ReactNode;
};

export type HostedUILayoutLogoContainerProps = {
  /** Logo container children */
  children: ReactNode;
};

export type HostedUILayoutLogoProps = {
  /** Logo children. */
  children: ReactNode;
};

export type HostedUILayoutContentProps = {
  /** Content children. */
  children: ReactNode;
};

/**
 * `HostedUILayout` defines a header and main content area for a HostedUI product page.
 *
 * @example
 * ```tsx
 * <HostedUILayout>
 *   <HostedUILayout.Header>
 *    <HostedUILayout.LogoContainer>
 *      <HostedUILayout.Logo>
 *        <SomeLogo />
 *      </HostedUILayout.Logo>
 *    </HostedUILayout.LogoContainer>
 *    <HostedUILayout.Actions>
 *      <HostedUILayout.MenuAction
 *        accessibilityLabel="Menu Action"
 *        iconSymbol={Icon}
 *        renderBadge={() => <HostedUILayout.ActionBadge />}
 *      >
 *        <Menu.Overlay onAction={() => {}}>
 *          <Menu.Item>Action 1</Menu.Item>
 *          <Menu.Item>Action 2</Menu.Item>
 *        </Menu.Overlay>
 *      </HostedUILayout.MenuAction>
 *      <HostedUILayout.ButtonAction
 *        accessibilityLabel="Button Action"
 *        iconSymbol={Icon}
 *        onPress={() => {}}
 *      />
 *    </HostedUILayout.Actions>
 *   </HostedUILayout.Header>
 *     <HostedUILayout.Content>
 *        HostedUI Content
 *     </HostedUILayout.Content>
 *  </HostedUILayout>
 * ```
 */
export function HostedUILayout(props: HostedUILayoutProps) {
  const { children } = props;
  return <div className={styles.HostedUILayout}>{children}</div>;
}

function HostedUILayoutHeader(props: HostedUILayoutHeaderProps) {
  const { children } = props;
  return <header className={styles.header}>{children}</header>;
}

function HostedUILayoutLogo(props: HostedUILayoutLogoProps) {
  const { children } = props;

  return <div className={styles.logo}>{children}</div>;
}

function HostedUILayoutLogoContainer(props: HostedUILayoutLogoContainerProps) {
  const { children } = props;
  return (
    <HorizontalStack gap="1" blockAlign="center" align="start" wrap={false}>
      <HostedUILayoutLogo>
        <EasyPostLogo />
      </HostedUILayoutLogo>
      {children}
    </HorizontalStack>
  );
}

function HostedUILayoutContent(props: HostedUILayoutContentProps) {
  const { children } = props;
  return <main className={styles.content}>{children}</main>;
}

/**
 * Represents the header of a `<HostedUILayout />`.
 */
HostedUILayout.Header = HostedUILayoutHeader;

/**
 * Represents a logo in a `<HostedUILayout />`.
 */
HostedUILayout.Logo = HostedUILayoutLogo;

/**
 * Represents the logo container in a `<HostedUILayout />`.
 */
HostedUILayout.LogoContainer = HostedUILayoutLogoContainer;

/**
 * Represents the secondary actions of a `<HostedUILayout />`.
 */
HostedUILayout.Actions = HostedUILayoutActions;

/**
 * Represents an action badge in a `<HostedUILayout />`.
 */
HostedUILayout.ActionBadge = HostedUILayoutActionBadge;

/**
 * Represents a secondary menu action of a `<HostedUILayout />`.
 */
HostedUILayout.MenuAction = HostedUILayoutMenuAction;

/**
 * Represents a secondary link action of a `<HostedUILayout />`.
 */
HostedUILayout.LinkAction = HostedUILayoutLinkAction;

/**
 * Represents a secondary button action of a `<HostedUILayout />`.
 */
HostedUILayout.ButtonAction = HostedUILayoutButtonAction;

/**
 * Represents the main content of a `<HostedUILayout />`.
 */
HostedUILayout.Content = HostedUILayoutContent;
