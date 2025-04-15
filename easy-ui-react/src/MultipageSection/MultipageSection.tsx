import React, { ReactNode } from "react";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import {
  MultipageSectionSidebarNav,
  MultipageSectionSidebarNavLink,
  MultipageSectionSidebarNavSection,
  useMultipageSectionSidebarNav,
} from "./MultipageSectionSidebarNav";

import styles from "./MultipageSection.module.scss";
import { IconSymbol } from "../types";
import { Icon } from "../Icon";

export type MultipageSectionProps = {
  /** MultipageSection children. */
  children: ReactNode;
};

export type MultipageSectionContainerProps = {
  /** MultipageSection container children. */
  children: ReactNode;
};

export type MultipageSectionSplitContainerProps = {
  /** MultipageSection split container children. */
  children: ReactNode;
};

export type MultipageSectionSidebarProps = {
  /** MultipageSection sidebar children. */
  children: ReactNode;
};

export type MultipageSectionBrandHeaderProps = {
  /** MultipageSection brand header children. */
  children: ReactNode;
};

export type MultipageSectionBrandHeaderLogoProps = {
  /** MultipageSection brand header logo children. */
  children: ReactNode;
};

export type MultipageSectionBrandHeaderTitleProps = {
  /** MultipageSection brand header title children. */
  children: ReactNode;
};

export type MultipageSectionContentProps = {
  /** MultipageSection content children. */
  children: ReactNode;
};

export type MultipageSectionContentHeaderProps = {
  /** MultipageSection container header children. */
  children: ReactNode;
};

export type MultipageSectionContentTitleProps = {
  /** MultipageSection content title icon. */
  titleIcon?: IconSymbol;
  /** MultipageSection content title text. */
  children: ReactNode;
};

/**
 * `MultipageSection` represents a section for multipage navigation and
 * a content area that is preceded by a branded header.
 *
 * @example
 * ```tsx
 *  <MultipageSection>
 *     <MultipageSection.Container>
 *       <MultipageSection.BrandHeader>
 *         <MultipageSection.BrandHeaderLogo>
 *           <SomeLogo />
 *         </MultipageSection.BrandHeaderLogo>
 *         <MultipageSection.BrandHeaderTitle>
 *           Brand Title
 *         </MultipageSection.BrandHeaderTitle>
 *       </MultipageSection.BrandHeader>
 *       <MultipageSection.SplitContainer>
 *         <MultipageSection.Sidebar>
 *           <MultipageSection.SidebarNav selectedHref="/1">
 *             <MultipageSection.SidebarNavLink
 *               href="/1"
 *               iconSymbol={Icon}
 *             >
 *               Link 1
 *             </MultipageSection.SidebarNavLink>
 *             <MultipageSection.SidebarNavLink
 *               href="/2"
 *               iconSymbol={Icon}
 *             >
 *               Link 2
 *             </MultipageSection.SidebarNavLink>
 *           </MultipageSection.SidebarNav>
 *         </MultipageSection.Sidebar>
 *         <MultipageSection.Content>
 *           <MultipageSection.ContentHeader>
 *             <MultipageSection.ContentTitle titleIcon={Icon}>
 *               Content Title
 *             </MultipageSection.ContentTitle>
 *           </MultipageSection.ContentHeader>
 *           <div>Content</div>
 *         </MultipageSection.Content>
 *       </MultipageSection.SplitContainer>
 *     </MultipageSection.Container>
 *   </MultipageSection>
 * ```
 */
export function MultipageSection(props: MultipageSectionProps) {
  const { children } = props;
  return <section className={styles.MultipageSection}>{children}</section>;
}

export function MultipageSectionContainer(
  props: MultipageSectionContainerProps,
) {
  const { children } = props;
  return <div className={styles.container}>{children}</div>;
}

export function MultipageSectionSplitContainer(
  props: MultipageSectionSplitContainerProps,
) {
  const { children } = props;
  return <div className={styles.splitContainer}>{children}</div>;
}

function MultipageSectionSidebar(props: MultipageSectionSidebarProps) {
  const { children } = props;
  return (
    <div role="region" className={styles.sidebar}>
      {children}
    </div>
  );
}

function MultipageSectionBrandHeader(props: MultipageSectionBrandHeaderProps) {
  const { children } = props;

  return (
    <div className={styles.brandHeader}>
      <HorizontalStack gap="2" blockAlign="center">
        {children}
      </HorizontalStack>
    </div>
  );
}

function MultipageSectionBrandHeaderLogo(
  props: MultipageSectionBrandHeaderLogoProps,
) {
  const { children } = props;

  return <div className={styles.brandLogo}>{children}</div>;
}

function MultipageSectionBrandHeaderTitle(
  props: MultipageSectionBrandHeaderTitleProps,
) {
  const { children } = props;
  return (
    <Text as="h2" variant="heading3" color="primary.800">
      {children}
    </Text>
  );
}

function MultipageSectionContent(props: MultipageSectionContentProps) {
  const { children } = props;
  return (
    <div className={styles.content}>
      <VerticalStack gap="2">{children}</VerticalStack>
    </div>
  );
}

function MultipageSectionContentHeader(
  props: MultipageSectionContentHeaderProps,
) {
  const { children } = props;
  return (
    <HorizontalStack as="header" blockAlign="center" align="space-between">
      {children}
    </HorizontalStack>
  );
}

function MultipageSectionContentTitle(
  props: MultipageSectionContentTitleProps,
) {
  const { children, titleIcon } = props;
  return (
    <>
      {titleIcon ? (
        <HorizontalStack gap="1" blockAlign="center">
          <Icon symbol={titleIcon} size="lg" color="primary.800" />
          <Text as="h3" variant="heading5" color="primary.800">
            {children}
          </Text>
        </HorizontalStack>
      ) : (
        <Text as="h3" variant="heading5" color="primary.800">
          {children}
        </Text>
      )}
    </>
  );
}

/**
 * Represents a container for a `<MultipageSection />`.
 */
MultipageSection.Container = MultipageSectionContainer;

/**
 * Represents a split container for a `<MultipageSection />`.
 */
MultipageSection.SplitContainer = MultipageSectionSplitContainer;

/**
 * Represents the sidebar for a `<MultipageSection />`.
 */
MultipageSection.Sidebar = MultipageSectionSidebar;

/**
 * Represents the brand header for a `<MultipageSection />`.
 */
MultipageSection.BrandHeader = MultipageSectionBrandHeader;

/**
 * Represents the brand header logo for a `<MultipageSection />`.
 */
MultipageSection.BrandHeaderLogo = MultipageSectionBrandHeaderLogo;

/**
 * Represents the brand header title for a `<MultipageSection />`.
 */
MultipageSection.BrandHeaderTitle = MultipageSectionBrandHeaderTitle;

/**
 * Represents the content for a `<MultipageSection />`.
 */
MultipageSection.Content = MultipageSectionContent;

/**
 * Represents the content header for a `<MultipageSection />`.
 */
MultipageSection.ContentHeader = MultipageSectionContentHeader;

/**
 * Represents the content title for a `<MultipageSection />`.
 */
MultipageSection.ContentTitle = MultipageSectionContentTitle;

/**
 * Represents the sidebar nav for a `<MultipageSection />`.
 */
MultipageSection.SidebarNav = MultipageSectionSidebarNav;

/**
 * Represents a sidebar nav section for a `<MultipageSection />`.
 */
MultipageSection.SidebarNavSection = MultipageSectionSidebarNavSection;

/**
 * Represents a sidebar nav link for a `<MultipageSection />`.
 */
MultipageSection.SidebarNavLink = MultipageSectionSidebarNavLink;

/**
 * Represents a helper hook for retrieving nav state  for a `<MultipageSection />`.
 */
MultipageSection.useNexusLayoutMultipageSidebarNav =
  useMultipageSectionSidebarNav;
