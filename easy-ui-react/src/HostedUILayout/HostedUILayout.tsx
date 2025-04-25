import React, { ReactNode, useContext, useMemo } from "react";
import ExperimentIcon from "@easypost/easy-ui-icons/Experiment";
import { EasyPostLogo } from "../utilities/EasyPostLogo";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { Icon } from "../Icon";
import {
  HostedUILayoutActionBadge,
  HostedUILayoutActions,
  HostedUILayoutButtonAction,
  HostedUILayoutLinkAction,
  HostedUILayoutMenuAction,
} from "./HostedUILayoutActions";

import styles from "./HostedUILayout.module.scss";

export type Mode = "test" | "production";

export type HostedUILayoutProps = {
  /**
   * Displays a prominent message with an icon when in test mode.
   *
   * @default production
   */
  mode?: Mode;
  /**
   * Controls whether the EasyPost logo displays
   *
   * @default true
   */
  shouldDisplayEasyPostLogo?: boolean;
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

export type HostedUILayoutContextType = {
  shouldDisplayEasyPostLogo?: boolean;
  mode?: Mode;
};

const HostedUILayoutContext =
  React.createContext<HostedUILayoutContextType | null>(null);

export const useHostedUILayout = () => {
  const context = useContext(HostedUILayoutContext);
  if (!context) {
    throw new Error("useHostedUILayout must be used within a HostedUILayout");
  }
  return context;
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
  const {
    children,
    mode = "production",
    shouldDisplayEasyPostLogo = true,
  } = props;

  const context = useMemo(() => {
    return { mode, shouldDisplayEasyPostLogo };
  }, [mode, shouldDisplayEasyPostLogo]);
  return (
    <HostedUILayoutContext.Provider value={context}>
      <div className={styles.HostedUILayout}>{children}</div>
    </HostedUILayoutContext.Provider>
  );
}

function TestModeBanner() {
  return (
    <div className={styles.testModeBanner} data-testid="test-mode">
      <HorizontalStack gap="1" blockAlign="center">
        <Icon symbol={ExperimentIcon} color="primary.700" size="lg" />
        <Text variant="subtitle1" color="warning.900">
          This Environment is in Test Mode
        </Text>
      </HorizontalStack>
    </div>
  );
}

function HostedUILayoutHeader(props: HostedUILayoutHeaderProps) {
  const { children } = props;
  const { mode } = useHostedUILayout();
  const isTestMode = mode === "test";
  return (
    <header className={styles.header}>
      {isTestMode && <TestModeBanner />}
      <div className={styles.logoAndActions}>{children}</div>
    </header>
  );
}

function HostedUILayoutLogo(props: HostedUILayoutLogoProps) {
  const { children } = props;

  return <div className={styles.logo}>{children}</div>;
}

function HostedUILayoutLogoContainer(props: HostedUILayoutLogoContainerProps) {
  const { children } = props;
  const { shouldDisplayEasyPostLogo } = useHostedUILayout();
  return (
    <HorizontalStack gap="1" blockAlign="center" align="start" wrap={false}>
      {shouldDisplayEasyPostLogo && (
        <HostedUILayoutLogo>
          <EasyPostLogo />
        </HostedUILayoutLogo>
      )}
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
