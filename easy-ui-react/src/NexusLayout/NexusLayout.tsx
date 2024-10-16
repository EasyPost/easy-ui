/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Key, ReactNode, useId, useRef } from "react";
import { AriaLinkOptions, useLink } from "react-aria";
import { UnstyledPressButton } from "../DataGrid/UnstyledPressButton";
import { HorizontalStack } from "../HorizontalStack";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { VerticalStack } from "../VerticalStack";

import styles from "./NexusLayout.module.scss";

export type NexusLayoutProps = {
  children: ReactNode;
};

export type NexusLayoutNexusContentProps = {
  children: ReactNode;
};

export type NexusLayoutNavProps = {
  "aria-label"?: string;
  selectedKey?: Key;
  children: ReactNode;
};

export type NexusLayoutNexusHeaderProps = {
  logo?: ReactNode;
  children: ReactNode;
};

export type MenuAction = {
  /** Optional custom accessibility label describing the menu action. */
  accessibilityLabel?: string;

  /** Icon symbol for the action. */
  iconSymbol: IconSymbol;

  /** Badge for the action. */
  renderBadge?: () => ReactNode;

  /** Render the menu overlay. */
  children: ReactNode;
};

export type NexusLayoutActionsProps = {
  children: ReactNode;
};

export type NexusLayoutNexusNavLinkProps = {
  iconSymbol: IconSymbol;
  children: ReactNode;
} & AriaLinkOptions;

export type NexusLayoutMultiPageNavProps = {
  title: ReactNode;
  selectedKey?: Key;
  children: ReactNode;
};

export function NexusLayout(props: NexusLayoutProps) {
  const { children } = props;
  return <div className={styles.NexusLayout}>{children}</div>;
}

function NexusLayoutHeader(props: NexusLayoutNexusHeaderProps) {
  const { logo = <EasyPostLogo />, children } = props;
  return (
    <div className={styles.header}>
      <div className={styles.nexusHeader}>
        <HorizontalStack blockAlign="center" align="space-between">
          {logo}
          {children}
        </HorizontalStack>
      </div>
    </div>
  );
}

function NexusLayoutActions(props: NexusLayoutActionsProps) {
  const { children } = props;
  return <HorizontalStack gap="0.5">{children}</HorizontalStack>;
}

function NexusLayoutMenuAction(props: MenuAction) {
  const {
    accessibilityLabel = "Actions",
    iconSymbol,
    children,
    renderBadge,
  } = props;
  return (
    <Menu>
      <Menu.Trigger>
        <UnstyledPressButton className={styles.menuActionButton}>
          <Text visuallyHidden>{accessibilityLabel}</Text>
          <Icon symbol={iconSymbol} />
          {renderBadge && (
            <div className={styles.menuActionBadge}>{renderBadge()}</div>
          )}
        </UnstyledPressButton>
      </Menu.Trigger>
      {children}
    </Menu>
  );
}

function NexusLayoutNav(props: NexusLayoutNavProps) {
  const { "aria-label": ariaLabel = "Main", children } = props;
  return (
    <nav aria-label={ariaLabel} className={styles.nexusNav}>
      {children}
    </nav>
  );
}

function NexusLayoutNavLink(props: NexusLayoutNexusNavLinkProps) {
  const ref = useRef(null);
  const { iconSymbol, children } = props;
  const ElementType = props.href && !props.isDisabled ? "a" : "span";
  const { linkProps } = useLink({ ...props, elementType: ElementType }, ref);
  return (
    <ElementType ref={ref} className={styles.nexusNavButton} {...linkProps}>
      <Icon symbol={iconSymbol} />
      <Text variant="subtitle2">{children}</Text>
    </ElementType>
  );
}

function NexusLayoutContent(props: NexusLayoutNexusContentProps) {
  const { children } = props;
  return <div className={styles.content}>{children}</div>;
}

function NexusLayoutMultiPageContainer(props: NexusLayoutNexusContentProps) {
  const { children } = props;
  return <div className={styles.multiPageContainer}>{children}</div>;
}

function NexusLayoutMultiPageSidebar(props: NexusLayoutNexusContentProps) {
  const { children } = props;
  return <div className={styles.multiPageSidebar}>{children}</div>;
}

function NexusLayoutMultiPageSidebarNav(props: any) {
  const { title, children } = props;
  const titleId = useId();
  return (
    <VerticalStack gap="2" aria-labelledBy={titleId}>
      <Text variant="heading4" id={titleId}>
        {title}
      </Text>
      {children}
    </VerticalStack>
  );
}

function NexusLayoutMultiPageSidebarNavSection(props: any) {
  const { title, children } = props;
  return (
    <VerticalStack gap="2">
      <Text variant="overline">{title}</Text>
      {children}
    </VerticalStack>
  );
}

function NexusLayoutMultiPageSidebarNavLink(props: any) {
  const ref = useRef(null);
  const { iconSymbol, children } = props;
  const ElementType = props.href && !props.isDisabled ? "a" : "span";
  const { linkProps } = useLink({ ...props, elementType: ElementType }, ref);
  return (
    <ElementType
      ref={ref}
      className={styles.multiPageSidebarNavLink}
      {...linkProps}
    >
      <Icon symbol={iconSymbol} />
      <Text variant="body2">{children}</Text>
    </ElementType>
  );
}

function NexusLayoutMultiPageContent(props: NexusLayoutNexusContentProps) {
  const { children } = props;
  return (
    <div className={styles.multiPageContent}>
      <VerticalStack gap="2">{children}</VerticalStack>
    </div>
  );
}

function NexusLayoutMultiPageHeader(props: NexusLayoutNexusContentProps) {
  const { children } = props;
  return (
    <HorizontalStack blockAlign="center" align="space-between">
      {children}
    </HorizontalStack>
  );
}

function NexusLayoutMultiPageTitle(props: NexusLayoutNexusContentProps) {
  const { children } = props;
  return <Text variant="heading5">{children}</Text>;
}
NexusLayout.Header = NexusLayoutHeader;
NexusLayout.Actions = NexusLayoutActions;
NexusLayout.MenuAction = NexusLayoutMenuAction;
NexusLayout.Header = NexusLayoutHeader;
NexusLayout.Nav = NexusLayoutNav;
NexusLayout.NavLink = NexusLayoutNavLink;
NexusLayout.Content = NexusLayoutContent;
NexusLayout.MultiPageContainer = NexusLayoutMultiPageContainer;
NexusLayout.MultiPageSidebar = NexusLayoutMultiPageSidebar;
NexusLayout.MultiPageSidebarNav = NexusLayoutMultiPageSidebarNav;
NexusLayout.MultiPageSidebarNavSection = NexusLayoutMultiPageSidebarNavSection;
NexusLayout.MultiPageSidebarNavLink = NexusLayoutMultiPageSidebarNavLink;
NexusLayout.MultiPageContent = NexusLayoutMultiPageContent;
NexusLayout.MultiPageHeader = NexusLayoutMultiPageHeader;
NexusLayout.MultiPageTitle = NexusLayoutMultiPageTitle;

function EasyPostLogo() {
  return (
    <svg
      width="139"
      height="32"
      viewBox="0 0 139 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M134.983 13.2778H138.606V10.4025H134.983C134.743 10.4025 134.62 10.2781 134.62 10.0655V7.21875H131.391V19.4561C131.391 22.6684 132.78 24.4443 136.403 24.4443H138.606V21.5665H136.884C134.983 21.5665 134.62 20.7109 134.62 18.9972V13.6433C134.622 13.3996 134.743 13.2778 134.983 13.2778ZM126.595 16.153L125.387 15.5412C124.059 14.8671 123.727 14.5922 123.727 13.9804C123.727 13.3089 124.239 12.8785 125.175 12.8785C125.991 12.8785 126.955 13.1844 128.073 13.8274L129.312 11.3203C127.802 10.3092 126.293 10.0344 125.024 10.0344C122.276 10.0344 120.527 11.7792 120.527 14.0737C120.527 16.0312 121.494 17.2549 123.998 18.4475L125.144 18.9972C126.352 19.5779 126.715 20.0083 126.715 20.5579C126.715 21.385 125.93 21.7817 124.691 21.7817C123.576 21.7817 122.489 21.4446 121.343 20.742L120.074 23.3736C121.644 24.3821 123.394 24.7191 124.842 24.7191C127.861 24.7191 129.974 23.2206 129.974 20.405C129.974 18.5383 129.01 17.3768 126.595 16.153ZM112.225 10.0344C107.94 10.0344 104.98 13.0315 104.98 17.3768C104.98 21.7194 107.94 24.7191 112.225 24.7191C116.513 24.7191 119.47 21.7194 119.47 17.3768C119.467 13.0315 116.51 10.0344 112.225 10.0344ZM112.225 21.7817C109.841 21.7817 108.27 20.0368 108.27 17.3768C108.27 14.7141 109.841 12.9718 112.225 12.9718C114.609 12.9718 116.18 14.7141 116.18 17.3768C116.178 20.0368 114.607 21.7817 112.225 21.7817ZM96.4075 10.0344C92.1813 10.0344 89.4056 12.7878 89.4056 17.5297V30.8378H92.6341V23.4643C92.6341 23.2802 92.7263 23.1895 92.8465 23.1895C92.936 23.1895 92.9974 23.2206 93.1177 23.3424C93.903 24.1073 95.2896 24.7191 96.7401 24.7191C100.815 24.7191 103.773 21.7194 103.773 17.3768C103.77 13.0315 100.813 10.0344 96.4075 10.0344ZM96.5252 21.7817C94.1409 21.7817 92.5702 20.0368 92.5702 17.3768C92.5702 14.7141 94.1409 12.9718 96.5252 12.9718C98.9095 12.9718 100.48 14.7141 100.48 17.3768C100.48 20.0368 98.9095 21.7817 96.5252 21.7817ZM71.9278 16.153L70.7203 15.5412C69.3901 14.8671 69.06 14.5922 69.06 13.9804C69.06 13.3089 69.5717 12.8785 70.508 12.8785C71.3241 12.8785 72.2885 13.1844 73.4065 13.8274L74.6447 11.3203C73.1353 10.3092 71.6259 10.0344 70.3571 10.0344C67.6095 10.0344 65.8597 11.7792 65.8597 14.0737C65.8597 16.0312 66.8241 17.2549 69.3312 18.4475L70.4773 18.9972C71.6848 19.5779 72.0481 20.0083 72.0481 20.5579C72.0481 21.385 71.2627 21.7817 70.0245 21.7817C68.9091 21.7817 67.8219 21.4446 66.6732 20.742L65.4069 23.3736C66.9751 24.3821 68.7275 24.7191 70.1754 24.7191C73.1941 24.7191 75.3072 23.2206 75.3072 20.405C75.3047 18.5383 74.3428 17.3768 71.9278 16.153ZM60.8174 10.4025V11.2892C60.8174 11.4733 60.7279 11.564 60.6076 11.564C60.5156 11.564 60.4567 11.5329 60.3365 11.4111C59.5511 10.6462 58.162 10.0344 56.714 10.0344C52.6388 10.0344 49.6789 13.0315 49.6789 17.3768C49.6789 21.7194 52.6388 24.7191 56.714 24.7191C58.162 24.7191 59.5511 24.1073 60.3365 23.3424C60.4567 23.2206 60.5156 23.1895 60.6076 23.1895C60.7279 23.1895 60.8174 23.2802 60.8174 23.4643V24.351H64.0485V10.4025H60.8174ZM56.9238 21.7817C54.5395 21.7817 52.9688 20.0368 52.9688 17.3768C52.9688 14.7141 54.5395 12.9718 56.9238 12.9718C59.3081 12.9718 60.8788 14.7141 60.8788 17.3768C60.8788 20.0368 59.3055 21.7817 56.9238 21.7817ZM37.8471 18.5383H48.3512C48.4126 18.2012 48.4714 17.8668 48.4714 17.286C48.4714 13.1248 45.7546 10.0344 41.5284 10.0344C37.4531 10.0344 34.2246 13.0315 34.2246 17.4079C34.2246 21.7194 37.1512 24.7191 41.4695 24.7191C44.0661 24.7191 46.2381 23.6484 47.837 21.3539L45.5448 19.4872C44.2452 21.232 42.9482 21.7817 41.5591 21.7817C38.9036 21.7817 37.6961 19.8864 37.5452 18.9375C37.4812 18.6316 37.5759 18.5383 37.8471 18.5383ZM37.6961 15.4789C38.1489 13.9493 39.689 12.8785 41.4081 12.8785C43.0991 12.8785 44.6085 13.9493 45.0613 15.4789C45.1508 15.7849 45.1201 16.0001 44.8489 16.0001H37.9059C37.6322 16.0001 37.6015 15.7849 37.6961 15.4789Z"
        fill="#061340"
      />
      <path
        d="M89.4395 10.375L84.6259 23.1426C83.2326 26.875 81.9291 28.5432 77.3874 30.6947L76.0275 27.9648C78.5934 26.6282 79.8918 25.6745 80.6641 24.3019L75.209 10.375H78.6909L82.1421 19.747C82.2319 19.9578 82.3242 20.0195 82.4448 20.0195C82.5654 20.0195 82.686 19.9578 82.7476 19.747L86.0166 10.375H89.4395Z"
        fill="#061340"
      />
      <path
        d="M14.4749 19.0473C14.2274 19.0473 14.0405 19.0165 13.8246 18.8957L7.23744 15.1659V18.4407L13.8246 22.173C14.0405 22.2938 14.2274 22.3247 14.4749 22.3247C14.6934 22.3247 14.9409 22.263 15.1278 22.173L28.9524 14.3459V17.6233L15.1278 25.417C14.9409 25.5378 14.725 25.5995 14.4749 25.5995C14.259 25.5995 14.0405 25.5378 13.8246 25.417L7.23744 21.7181V24.962L13.8246 28.6944C14.0405 28.8152 14.259 28.846 14.4749 28.846C14.725 28.846 14.9725 28.7843 15.1278 28.6944L28.9524 20.8981V22.9596C28.9524 23.6896 28.5496 24.3862 27.8966 24.7512L15.5306 31.7275C15.2226 31.9075 14.8487 32 14.4749 32C14.1037 32 13.7614 31.9075 13.4191 31.7275L1.05574 24.7512C0.402814 24.3862 0 23.6896 0 22.9596V9.03783C0 8.27954 0.402814 7.58294 1.05574 7.21793L13.4191 0.272471C13.7614 0.0925369 14.1037 0 14.4749 0C14.8487 0 15.2226 0.0925369 15.5306 0.272471L27.8966 7.21793C28.5496 7.58294 28.9524 8.27954 28.9524 9.03783V11.1019L15.1278 18.8957C14.9409 18.9882 14.6934 19.0473 14.4749 19.0473Z"
        fill="#164DFF"
      />
    </svg>
  );
}
