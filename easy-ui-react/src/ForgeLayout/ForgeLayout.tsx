import React, { ReactNode, useContext, useMemo } from "react";
import { classNames, variationName } from "../utilities/css";
import {
  ForgeLayoutActionBadge,
  ForgeLayoutActions,
  ForgeLayoutButtonAction,
  ForgeLayoutLinkAction,
  ForgeLayoutMenuAction,
} from "./ForgeLayoutActions";
import {
  ForgeLayoutNav,
  ForgeLayoutNavLink,
  ForgeLayoutNavSection,
  useForgeLayoutNav,
} from "./ForgeLayoutNav";
import { ForgeLayoutHeader } from "./ForgeLayoutHeader";
import {
  ForgeLayoutControls,
  ForgeLayoutBreadcrumbsNavigation,
  ForgeLayoutBackButton,
  ForgeLayoutBreadcrumbs,
  ForgeLayoutBreadcrumb,
  ForgeLayoutSearch,
  ForgeLayoutModeSwitcher,
} from "./ForgeLayoutControls";

import styles from "./ForgeLayout.module.scss";

export type Mode = "test" | "production";

export type NavState = "expanded" | "collapsed";

export type ForgeLayoutProps = {
  /** Layout children. */
  children: ReactNode;

  /**
   * Provides obvious visual indicator for non-production modes.
   *
   * @default production
   */
  mode?: Mode;

  /**
   * Display state of the nav menu.
   *
   * @default expanded
   */
  navState?: NavState;

  /**
   * Background decoration for layout.
   *
   * @default 01
   */
  backgroundDecoration?: "01";
};

export type ForgeLayoutContentProps = {
  /** Content children. */
  children: ReactNode;
};

export type ForgeLayoutContextType = {
  mode?: Mode;
  navState?: NavState;
};

const ForgeLayoutContext = React.createContext<ForgeLayoutContextType | null>(
  null,
);

export const useForgeLayout = () => {
  const context = useContext(ForgeLayoutContext);
  if (!context) {
    throw new Error("useForgeLayout must be used within a ForgeLayout");
  }
  return context;
};

/**
 * `ForgeLayout` defines the header, nav, and main content areas of a Forge product page.
 *
 * @example
 * ```tsx
 * <ForgeLayout mode="test" navState="expanded">
 *   <ForgeLayout.Nav>
 *     <ForgeLayout.NavLink href="/1" iconSymbol={Icon}>
 *       Item 1
 *     </ForgeLayout.NavLink>
 *     <ForgeLayout.NavSection title={<>Title</>}>
 *       <ForgeLayout.NavLink href="/2" iconSymbol={Icon}>
 *         Item 2
 *       </ForgeLayout.NavLink>
 *       <ForgeLayout.NavLink href="/3" iconSymbol={Icon}>
 *         Item 3
 *       </ForgeLayout.NavLink>
 *     </ForgeLayout.NavSection>
 *     <ForgeLayout.NavSection title={<>Title</>}>
 *       <ForgeLayout.NavLink href="/4" iconSymbol={Icon}>
 *         Item 4
 *       </ForgeLayout.NavLink>
 *       <ForgeLayout.NavLink href="/5" iconSymbol={Icon}>
 *         Item 5
 *       </ForgeLayout.NavLink>
 *     </ForgeLayout.NavSection>
 *   </ForgeLayout.Nav>
 *   <ForgeLayout.Header>
 *     <ForgeLayout.Controls visibleWhenNavStateIs="collapsed">
 *       <ForgeLayout.BreadcrumbsNavigation>
 *         <ForgeLayout.BackButton onClick={() => {}}>
 *           Back
 *         </ForgeLayout.BackButton>
 *         <ForgeLayout.Breadcrumbs>
 *           <ForgeLayout.Breadcrumb>Breadcrumb</ForgeLayout.Breadcrumb>
 *           <ForgeLayout.Breadcrumb>Breadcrumb</ForgeLayout.Breadcrumb>
 *         </ForgeLayout.Breadcrumbs>
 *       </ForgeLayout.BreadcrumbsNavigation>
 *     </ForgeLayout.Controls>
 *     <ForgeLayout.Controls visibleWhenNavStateIs="expanded">
 *       <ForgeLayout.ModeSwitcher onModeChange={action("Mode changed!")} />
 *       <ForgeLayout.Search value={"search"} onChange={() => {}} />
 *     </ForgeLayout.Controls>
 *     <ForgeLayout.Actions>
 *       <ForgeLayout.MenuAction
 *         accessibilityLabel="Action 1"
 *         iconSymbol={AlarmIcon}
 *         renderBadge={() => <ForgeLayout.ActionBadge />}
 *       >
 *         <Menu.Overlay onAction={action("Menu item clicked!")}>
 *           <Menu.Item>Action 1:1</Menu.Item>
 *           <Menu.Item>Action 1:2</Menu.Item>
 *         </Menu.Overlay>
 *       </ForgeLayout.MenuAction>
 *       <ForgeLayout.MenuAction
 *         accessibilityLabel="Action 2"
 *         iconSymbol={SupportIcon}
 *       >
 *         <Menu.Overlay onAction={action("Menu item clicked!")}>
 *           <Menu.Item>Action 2:1</Menu.Item>
 *           <Menu.Item>Action 2:2</Menu.Item>
 *         </Menu.Overlay>
 *       </ForgeLayout.MenuAction>
 *       <ForgeLayout.LinkAction
 *         href="/4"
 *         accessibilityLabel="Action 3"
 *         iconSymbol={SettingsIcon}
 *       />
 *     </ForgeLayout.Actions>
 *   </ForgeLayout.Header>
 *   <ForgeLayout.Content>Page Content</ForgeLayout.Content>
 * </ForgeLayout>
 * ```
 */
export function ForgeLayout(props: ForgeLayoutProps) {
  const {
    backgroundDecoration = "01",
    mode = "production",
    navState = "expanded",
    children,
  } = props;
  const className = classNames(
    styles.ForgeLayout,
    styles[variationName("mode", mode)],
    styles[variationName("navState", navState)],
  );
  const bgClassName = classNames(
    styles.bg,
    styles[variationName("backgroundDecoration", backgroundDecoration)],
  );
  const context = useMemo(() => {
    return { mode, navState };
  }, [mode, navState]);
  return (
    <ForgeLayoutContext.Provider value={context}>
      <div className={bgClassName} />
      <div className={className} data-testid="ForgeLayout">
        {children}
      </div>
    </ForgeLayoutContext.Provider>
  );
}

function ForgeLayoutBody(props: ForgeLayoutContentProps) {
  const { children } = props;
  return <div className={styles.body}>{children}</div>;
}

function ForgeLayoutContent(props: ForgeLayoutContentProps) {
  const { children } = props;
  return <main className={styles.content}>{children}</main>;
}

/**
 * Represents the primary nav of a `<ForgeLayout />`.
 */
ForgeLayout.Nav = ForgeLayoutNav;

/**
 * Represents a section in the primary nav of a `<ForgeLayout />`.
 */
ForgeLayout.NavSection = ForgeLayoutNavSection;

/**
 * Represents a primary nav link of a `<ForgeLayout />`.
 */
ForgeLayout.NavLink = ForgeLayoutNavLink;

/**
 * Represents a body that holds the header and main content in a `<ForgeLayout />`.
 */
ForgeLayout.Body = ForgeLayoutBody;

/**
 * Represents the header of a `<ForgeLayout />`.
 */
ForgeLayout.Header = ForgeLayoutHeader;

/**
 * Represents the controls of a `<ForgeLayout />`.
 */
ForgeLayout.Controls = ForgeLayoutControls;

/**
 * Represents the breadcrumbs and navigation in a `<ForgeLayout />`.
 */
ForgeLayout.BreadcrumbsNavigation = ForgeLayoutBreadcrumbsNavigation;

/**
 * Represents a navigation back button in a `<ForgeLayout />`.
 */
ForgeLayout.BackButton = ForgeLayoutBackButton;

/**
 * Represents breadcrumbs in a `<ForgeLayout />`.
 */
ForgeLayout.Breadcrumbs = ForgeLayoutBreadcrumbs;

/**
 * Represents a breadcrumb in a `<ForgeLayout />`.
 */
ForgeLayout.Breadcrumb = ForgeLayoutBreadcrumb;

/**
 * Represents a mode switcher in a `<ForgeLayout />`.
 */
ForgeLayout.ModeSwitcher = ForgeLayoutModeSwitcher;

/**
 * Represents a search input in a `<ForgeLayout />`.
 */
ForgeLayout.Search = ForgeLayoutSearch;

/**
 * Represents the secondary actions of a `<ForgeLayout />`.
 */
ForgeLayout.Actions = ForgeLayoutActions;

/**
 * Represents an action badge in a `<ForgeLayout />`.
 */
ForgeLayout.ActionBadge = ForgeLayoutActionBadge;

/**
 * Represents a secondary menu action of a `<ForgeLayout />`.
 */
ForgeLayout.MenuAction = ForgeLayoutMenuAction;

/**
 * Represents a secondary link action of a `<ForgeLayout />`.
 */
ForgeLayout.LinkAction = ForgeLayoutLinkAction;

/**
 * Represents a secondary button action of a `<ForgeLayout />`.
 */
ForgeLayout.ButtonAction = ForgeLayoutButtonAction;

/**
 * Represents the main content of a `<ForgeLayout />`.
 */
ForgeLayout.Content = ForgeLayoutContent;

/**
 * Helper hook for retrieving nav state. Useful for custom nav links.
 */
ForgeLayout.useForgeLayoutNav = useForgeLayoutNav;
