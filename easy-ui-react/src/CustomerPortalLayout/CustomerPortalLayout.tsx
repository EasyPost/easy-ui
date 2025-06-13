import React, { ReactNode, useContext, useMemo } from "react";
import ExperimentIcon from "@easypost/easy-ui-icons/Experiment";
import { EasyPostLogo } from "../utilities/EasyPostLogo";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { Icon } from "../Icon";
import {
  CustomerPortalLayoutActionBadge,
  CustomerPortalLayoutActions,
  CustomerPortalLayoutButtonAction,
  CustomerPortalLayoutLinkAction,
  CustomerPortalLayoutMenuAction,
} from "./CustomerPortalLayoutActions";

import styles from "./CustomerPortalLayout.module.scss";

export type Mode = "test" | "production";

export type CustomerPortalLayoutProps = {
  /**
   * Displays a prominent message with an icon when in test mode.
   *
   * @default production
   */
  mode?: Mode;
  /**
   * Controls whether the EasyPost logo displays.
   *
   * @default true
   */
  shouldDisplayEasyPostLogo?: boolean;
  /** Layout children. */
  children: ReactNode;
};

export type CustomerPortalLayoutHeaderProps = {
  /** Header children. */
  children: ReactNode;
};

export type CustomerPortalLayoutLogoContainerProps = {
  /** Logo container children */
  children: ReactNode;
};

export type CustomerPortalLayoutLogoProps = {
  /** Logo children. */
  children: ReactNode;
};

export type CustomerPortalLayoutContentProps = {
  /** Content children. */
  children: ReactNode;
};

export type CustomerPortalLayoutContextType = {
  shouldDisplayEasyPostLogo?: boolean;
  mode?: Mode;
};

const CustomerPortalLayoutContext =
  React.createContext<CustomerPortalLayoutContextType | null>(null);

export const useCustomerPortalLayout = () => {
  const context = useContext(CustomerPortalLayoutContext);
  if (!context) {
    throw new Error(
      "useCustomerPortalLayout must be used within a CustomerPortalLayout",
    );
  }
  return context;
};

/**
 * `CustomerPortalLayout` defines a header and main content area for a CustomerPortal product page.
 *
 * @remarks
 * `CustomerPortalLayout` can be combined with `MultipageSection` to render a multipage navigational container.
 *
 * @example
 * ```tsx
 * <CustomerPortalLayout mode="test">
 *   <CustomerPortalLayout.Header>
 *    <CustomerPortalLayout.LogoContainer>
 *      <CustomerPortalLayout.Logo>
 *        <SomeLogo />
 *      </CustomerPortalLayout.Logo>
 *    </CustomerPortalLayout.LogoContainer>
 *    <CustomerPortalLayout.Actions>
 *      <CustomerPortalLayout.MenuAction
 *        accessibilityLabel="Menu Action"
 *        iconSymbol={Icon}
 *        renderBadge={() => <CustomerPortalLayout.ActionBadge />}
 *      >
 *        <Menu.Overlay onAction={() => {}}>
 *          <Menu.Item>Action 1</Menu.Item>
 *          <Menu.Item>Action 2</Menu.Item>
 *        </Menu.Overlay>
 *      </CustomerPortalLayout.MenuAction>
 *      <CustomerPortalLayout.ButtonAction
 *        accessibilityLabel="Button Action"
 *        iconSymbol={Icon}
 *        onPress={() => {}}
 *      />
 *    </CustomerPortalLayout.Actions>
 *   </CustomerPortalLayout.Header>
 *     <CustomerPortalLayout.Content>
 *        CustomerPortal Content
 *     </CustomerPortalLayout.Content>
 *  </CustomerPortalLayout>
 * ```
 */
export function CustomerPortalLayout(props: CustomerPortalLayoutProps) {
  const {
    children,
    mode = "production",
    shouldDisplayEasyPostLogo = true,
  } = props;

  const context = useMemo(() => {
    return { mode, shouldDisplayEasyPostLogo };
  }, [mode, shouldDisplayEasyPostLogo]);
  return (
    <CustomerPortalLayoutContext.Provider value={context}>
      <div className={styles.CustomerPortalLayout}>{children}</div>
    </CustomerPortalLayoutContext.Provider>
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

function CustomerPortalLayoutHeader(props: CustomerPortalLayoutHeaderProps) {
  const { children } = props;
  const { mode } = useCustomerPortalLayout();
  const isTestMode = mode === "test";
  return (
    <header className={styles.header}>
      {isTestMode && <TestModeBanner />}
      <div className={styles.logoAndActions}>{children}</div>
    </header>
  );
}

function CustomerPortalLayoutLogo(props: CustomerPortalLayoutLogoProps) {
  const { children } = props;

  return <div className={styles.logo}>{children}</div>;
}

function CustomerPortalLayoutLogoContainer(
  props: CustomerPortalLayoutLogoContainerProps,
) {
  const { children } = props;
  const { shouldDisplayEasyPostLogo } = useCustomerPortalLayout();
  return (
    <HorizontalStack gap="1" blockAlign="center" align="start" wrap={false}>
      {shouldDisplayEasyPostLogo && (
        <CustomerPortalLayoutLogo>
          <EasyPostLogo />
        </CustomerPortalLayoutLogo>
      )}
      {children}
    </HorizontalStack>
  );
}

function CustomerPortalLayoutContent(props: CustomerPortalLayoutContentProps) {
  const { children } = props;
  return <main className={styles.content}>{children}</main>;
}

/**
 * Represents the header of a `<CustomerPortalLayout />`.
 */
CustomerPortalLayout.Header = CustomerPortalLayoutHeader;

/**
 * Represents a logo in a `<CustomerPortalLayout />`.
 */
CustomerPortalLayout.Logo = CustomerPortalLayoutLogo;

/**
 * Represents the logo container in a `<CustomerPortalLayout />`.
 */
CustomerPortalLayout.LogoContainer = CustomerPortalLayoutLogoContainer;

/**
 * Represents the secondary actions of a `<CustomerPortalLayout />`.
 */
CustomerPortalLayout.Actions = CustomerPortalLayoutActions;

/**
 * Represents an action badge in a `<CustomerPortalLayout />`.
 */
CustomerPortalLayout.ActionBadge = CustomerPortalLayoutActionBadge;

/**
 * Represents a secondary menu action of a `<CustomerPortalLayout />`.
 */
CustomerPortalLayout.MenuAction = CustomerPortalLayoutMenuAction;

/**
 * Represents a secondary link action of a `<CustomerPortalLayout />`.
 */
CustomerPortalLayout.LinkAction = CustomerPortalLayoutLinkAction;

/**
 * Represents a secondary button action of a `<CustomerPortalLayout />`.
 */
CustomerPortalLayout.ButtonAction = CustomerPortalLayoutButtonAction;

/**
 * Represents the main content of a `<CustomerPortalLayout />`.
 */
CustomerPortalLayout.Content = CustomerPortalLayoutContent;
