import React, { ReactNode } from "react";
import { HorizontalStack } from "../HorizontalStack";
import { classNames } from "../utilities/css";
import { EasyPostLogo } from "../utilities/EasyPostLogo";
import {
  NexusLayoutActions,
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
} from "./NexusLayoutMultipageSidebarNav";
import { NexusLayoutNav, NexusLayoutNavLink } from "./NexusLayoutNav";

import styles from "./NexusLayout.module.scss";

export type NexusLayoutNexusHeaderProps = {
  logo?: ReactNode;
  children: ReactNode;
};

export function NexusLayout(props: { children: ReactNode }) {
  const { children } = props;
  const className = classNames(
    styles.NexusLayout,
    styles.backgroundDecoration01,
  );
  return <div className={className}>{children}</div>;
}

function NexusLayoutHeader(props: NexusLayoutNexusHeaderProps) {
  const { logo = <EasyPostLogo />, children } = props;
  return (
    <div className={styles.header}>
      <HorizontalStack blockAlign="center" align="space-between">
        {logo}
        {children}
      </HorizontalStack>
    </div>
  );
}

function NexusLayoutContent(props: { children: ReactNode }) {
  const { children } = props;
  return <div className={styles.content}>{children}</div>;
}

NexusLayout.Header = NexusLayoutHeader;
NexusLayout.Actions = NexusLayoutActions;
NexusLayout.MenuAction = NexusLayoutMenuAction;
NexusLayout.Header = NexusLayoutHeader;
NexusLayout.Nav = NexusLayoutNav;
NexusLayout.NavLink = NexusLayoutNavLink;
NexusLayout.Content = NexusLayoutContent;
NexusLayout.MultiPageContainer = NexusLayoutMultipageContainer;
NexusLayout.MultiPageSidebar = NexusLayoutMultipageSidebar;
NexusLayout.MultiPageSidebarNav = NexusLayoutMultipageSidebarNav;
NexusLayout.MultiPageSidebarNavSection = NexusLayoutMultipageSidebarNavSection;
NexusLayout.MultiPageSidebarNavLink = NexusLayoutMultipageSidebarNavLink;
NexusLayout.MultiPageContent = NexusLayoutMultipageContent;
NexusLayout.MultiPageHeader = NexusLayoutMultipageHeader;
NexusLayout.MultiPageTitle = NexusLayoutMultipageTitle;
