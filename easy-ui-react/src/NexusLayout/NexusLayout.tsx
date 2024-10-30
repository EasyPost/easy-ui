import React, { ReactNode } from "react";
import { classNames, variationName } from "../utilities/css";
import { EasyPostLogo } from "../utilities/EasyPostLogo";
import {
  NexusLayoutActionBadge,
  NexusLayoutActions,
  NexusLayoutLinkAction,
  NexusLayoutMenuAction,
} from "./NexusLayoutActions";
import {
  NexusLayoutMultipageContainer,
  NexusLayoutMultipageContent,
  NexusLayoutMultipageHeader,
  NexusLayoutMultipageSidebar,
  NexusLayoutMultipageTitle,
} from "./NexusLayoutMultipage";
import {
  NexusLayoutMultipageSidebarNav,
  NexusLayoutMultipageSidebarNavLink,
  NexusLayoutMultipageSidebarNavSection,
  useNexusLayoutMultipageSidebarNav,
} from "./NexusLayoutMultipageSidebarNav";
import {
  NexusLayoutNav,
  NexusLayoutNavLink,
  useNexusLayoutNav,
} from "./NexusLayoutNav";

import styles from "./NexusLayout.module.scss";

export type NexusLayoutProps = {
  /** Layout children. */
  children: ReactNode;

  /**
   * Background decoration for layout.
   *
   * @default 01
   */
  backgroundDecoration?: "01";
};

export type NexusLayoutHeaderProps = {
  /** Header children. */
  children: ReactNode;
};

export type NexusLayoutLogoProps = {
  /**
   * Custom logo for layout. Defaults to EasyPost logo.
   */
  children?: ReactNode;
};

export type NexusLayoutContentProps = {
  /** Content children. */
  children: ReactNode;
};

/**
 * `NexusLayout` defines the header, main content, and multi-page content areas of a Nexus product page.
 *
 * @example
 * ```tsx
 * <NexusLayout>
 *   <NexusLayout.Header>
 *     <NexusLayout.Logo />
 *     <NexusLayout.Nav selectedKey="/1">
 *       <NexusLayout.NavLink key="/1" href="/1" iconSymbol={Icon}>
 *         Order Fulfillment
 *       </NexusLayout.NavLink>
 *       <NexusLayout.NavLink key="/2" href="/2" iconSymbol={Icon}>
 *         Post Delivery
 *       </NexusLayout.NavLink>
 *     </NexusLayout.Nav>
 *     <NexusLayout.Actions>
 *       <NexusLayout.MenuAction
 *         accessibilityLabel="Label"
 *         iconSymbol={Icon}
 *         renderBadge={() => <Badge />}
 *       >
 *         <Menu.Overlay onAction={() => {}}>
 *           <Menu.Item>Action 1</Menu.Item>
 *           <Menu.Item>Action 2</Menu.Item>
 *         </Menu.Overlay>
 *       </NexusLayout.MenuAction>
 *       <NexusLayout.MenuAction accessibilityLabel="Label" iconSymbol={Icon}>
 *         <Menu.Overlay onAction={() => {}}>
 *           <Menu.Item>Action 1</Menu.Item>
 *           <Menu.Item>Action 2</Menu.Item>
 *         </Menu.Overlay>
 *       </NexusLayout.MenuAction>
 *     </NexusLayout.Actions>
 *   </NexusLayout.Header>
 *   <NexusLayout.Content>
 *     <div>Content</div>
 *   </NexusLayout.Content>
 * </NexusLayout>
 * ```
 */
export function NexusLayout(props: NexusLayoutProps) {
  const { backgroundDecoration = "01", children } = props;
  const className = classNames(
    styles.NexusLayout,
    styles[variationName("backgroundDecoration", backgroundDecoration)],
  );
  return <div className={className}>{children}</div>;
}

function NexusLayoutHeader(props: NexusLayoutHeaderProps) {
  const { children } = props;
  return <header className={styles.header}>{children}</header>;
}

function NexusLayoutLogo(props: NexusLayoutLogoProps) {
  const { children = <EasyPostLogo /> } = props;
  return <div className={styles.logo}>{children}</div>;
}

function NexusLayoutContent(props: NexusLayoutContentProps) {
  const { children } = props;
  return <main className={styles.content}>{children}</main>;
}

/**
 * Represents the header of a `<NexusLayout />`.
 */
NexusLayout.Header = NexusLayoutHeader;

/**
 * Represents the logo in a `<NexusLayout />`.
 */
NexusLayout.Logo = NexusLayoutLogo;

/**
 * Represents the primary nav of a `<NexusLayout />`.
 */
NexusLayout.Nav = NexusLayoutNav;

/**
 * Represents a primary nav link of a `<NexusLayout />`.
 */
NexusLayout.NavLink = NexusLayoutNavLink;

/**
 * Represents the secondary actions of a `<NexusLayout />`.
 */
NexusLayout.Actions = NexusLayoutActions;

/**
 * Represents an action badge in a `<NexusLayout />`.
 */
NexusLayout.ActionBadge = NexusLayoutActionBadge;

/**
 * Represents a secondary menu action of a `<NexusLayout />`.
 */
NexusLayout.MenuAction = NexusLayoutMenuAction;

/**
 * Represents a secondary link action of a `<NexusLayout />`.
 */
NexusLayout.LinkAction = NexusLayoutLinkAction;

/**
 * Represents the main content of a `<NexusLayout />`.
 */
NexusLayout.Content = NexusLayoutContent;

/**
 * Represents a multipage container for a `<NexusLayout />`.
 */
NexusLayout.MultipageContainer = NexusLayoutMultipageContainer;

/**
 * Represents the sidebar in a multipage container for a `<NexusLayout />`.
 */
NexusLayout.MultipageSidebar = NexusLayoutMultipageSidebar;

/**
 * Represents the content in a multipage container for a `<NexusLayout />`.
 */
NexusLayout.MultipageContent = NexusLayoutMultipageContent;

/**
 * Represents the header in a multipage container for a `<NexusLayout />`.
 */
NexusLayout.MultipageHeader = NexusLayoutMultipageHeader;

/**
 * Represents the title in a multipage container for a `<NexusLayout />`.
 */
NexusLayout.MultipageTitle = NexusLayoutMultipageTitle;

/**
 * Represents the sidebar nav in a multipage container for a `<NexusLayout />`.
 */
NexusLayout.MultipageSidebarNav = NexusLayoutMultipageSidebarNav;

/**
 * Represents a sidebar nav section in a multipage container for a `<NexusLayout />`.
 */
NexusLayout.MultipageSidebarNavSection = NexusLayoutMultipageSidebarNavSection;

/**
 * Represents a sidebar nav link in a multipage container for a `<NexusLayout />`.
 */
NexusLayout.MultipageSidebarNavLink = NexusLayoutMultipageSidebarNavLink;

/**
 * Helper hook for retrieving nav state. Useful for custom nav links.
 */
NexusLayout.useNexusLayoutNav = useNexusLayoutNav;

/**
 * Helper hook for retrieving multipage sidebar nav state. Useful for custom nav links.
 */
NexusLayout.useNexusLayoutMultipageSidebarNav =
  useNexusLayoutMultipageSidebarNav;
