import React, {
  ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";
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
import { ForgeLayoutNavToggle } from "./ForgeLayoutNavToggle";

import styles from "./ForgeLayout.module.scss";

export type Mode = "test" | "production";

/**
 * Display state of the nav menu.
 *
 * - `expanded` renders the nav at full width with labelled links.
 * - `rail` renders the nav as a narrow, icon-only rail. This is the state
 *   design refers to as "collapsed".
 * - `collapsed` removes the nav entirely for distraction-free content.
 */
export type NavState = "expanded" | "rail" | "collapsed";

/**
 * Nav states that `ForgeLayout.Controls` can be gated on.
 *
 * `rail` is deliberately excluded. A rail is a nav-only concern, so it shares
 * `expanded`'s header semantics rather than introducing a third branch.
 */
export type NavVisibilityState = Exclude<NavState, "rail">;

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
   * Display state of the nav menu. Pass this to control the nav state.
   * Use `defaultNavState` instead to leave the state uncontrolled.
   *
   * @default expanded
   */
  navState?: NavState;

  /**
   * Initial display state of the nav menu when left uncontrolled.
   *
   * @default expanded
   */
  defaultNavState?: NavState;

  /**
   * Called when the nav state changes, such as when a
   * `ForgeLayout.NavToggle` is pressed.
   *
   * Persisting the nav state across sessions is left to the consuming
   * application.
   */
  onNavStateChange?: (navState: NavState) => void;

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
  navState: NavState;
  /** Sets the nav state, notifying `onNavStateChange` of the new value. */
  setNavState: (navState: NavState) => void;
  /** `id` of the nav element, for `aria-controls` on nav toggles. */
  navId: string;
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
 * <ForgeLayout mode="test" defaultNavState="expanded">
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
 *       <ForgeLayout.NavToggle />
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
    navState: controlledNavState,
    defaultNavState = "expanded",
    onNavStateChange,
    children,
  } = props;
  const [navState, setNavState] = useNavState(
    controlledNavState,
    defaultNavState,
    onNavStateChange,
  );
  const navId = useId();
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
    return { mode, navState, setNavState, navId };
  }, [mode, navState, setNavState, navId]);
  return (
    <ForgeLayoutContext.Provider value={context}>
      <div className={bgClassName} />
      <div className={className} data-testid="ForgeLayout">
        {children}
      </div>
    </ForgeLayoutContext.Provider>
  );
}

/**
 * Resolves the nav state from either a controlled `navState` prop or internal
 * state, always notifying `onNavStateChange` of requested changes.
 */
function useNavState(
  controlledNavState: NavState | undefined,
  defaultNavState: NavState,
  onNavStateChange: ((navState: NavState) => void) | undefined,
) {
  const [uncontrolledNavState, setUncontrolledNavState] =
    useState(defaultNavState);
  const isControlled = controlledNavState !== undefined;
  const navState = isControlled ? controlledNavState : uncontrolledNavState;
  const setNavState = useCallback(
    (nextNavState: NavState) => {
      if (!isControlled) {
        setUncontrolledNavState(nextNavState);
      }
      onNavStateChange?.(nextNavState);
    },
    [isControlled, onNavStateChange],
  );
  return [navState, setNavState] as const;
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
 * Represents a control for toggling the nav between its expanded and rail
 * states in a `<ForgeLayout />`.
 */
ForgeLayout.NavToggle = ForgeLayoutNavToggle;

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
