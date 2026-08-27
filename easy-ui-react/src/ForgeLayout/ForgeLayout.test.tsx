import { screen } from "@testing-library/react";
import React, { ReactNode } from "react";
import { vi } from "vitest";
import { Menu } from "../Menu";
import { hoverOverTooltipTrigger } from "../Tooltip/Tooltip.test";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
  userClick,
} from "../utilities/test";
import { ForgeLayout, Mode, NavState } from "./ForgeLayout";
import type { ForgeLayoutNavProps } from "./ForgeLayoutNav";

describe("<ForgeLayout />", () => {
  let restoreGetComputedStyle: () => void;
  let restoreIntersectionObserver: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    restoreIntersectionObserver = mockIntersectionObserver();
    restoreGetComputedStyle = mockGetComputedStyle();
  });

  afterEach(() => {
    restoreGetComputedStyle();
    restoreIntersectionObserver();
    vi.useRealTimers();
  });

  it("should render a forge layout", async () => {
    const handleMenuAction1 = vi.fn();
    const handleModeChange = vi.fn();

    const { user } = render(
      createForgeLayout({
        selectedHref: "/1",
        onMenuAction1: handleMenuAction1,
        onModeChange: handleModeChange,
      }),
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Nav Link 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Action 3" })).toBeInTheDocument();

    await userClick(
      user,
      screen.getByRole("button", { name: "Menu Action 1" }),
    );
    await userClick(
      user,
      screen.getByRole("menuitem", { name: "Menu Action 1:1" }),
    );

    expect(handleMenuAction1).toBeCalled();

    expect(
      screen.getByRole("button", { name: "Production" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Search for content" }),
    ).toBeInTheDocument();

    await userClick(user, screen.getByRole("button", { name: "Production" }));
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
    await userClick(user, radios[0]);

    expect(handleModeChange).toBeCalled();
  });

  it("should render collapsed state", async () => {
    const handleBackButton = vi.fn();
    const { user } = render(
      createForgeLayout({
        navState: "collapsed",
        selectedHref: "/1",
        onBackButton: handleBackButton,
      }),
    );
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    expect(screen.queryByText("Breadcrumb One")).toBeInTheDocument();
    expect(screen.queryByText("Breadcrumb Two")).toBeInTheDocument();
    expect(screen.queryByText("Breadcrumb Three")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Production" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("searchbox", { name: "Search for content" }),
    ).not.toBeInTheDocument();
    await userClick(user, screen.getByRole("button", { name: "Back" }));
    expect(handleBackButton).toBeCalled();
  });

  it("should render test mode", async () => {
    render(
      createForgeLayout({
        mode: "test",
        selectedHref: "/1",
      }),
    );
    expect(screen.getByTestId("ForgeLayout")).toHaveAttribute(
      "class",
      expect.stringContaining("modeTest"),
    );
  });

  describe("rail nav state", () => {
    it("should keep the nav and its links named", async () => {
      render(createForgeLayout({ navState: "rail" }));
      expect(
        screen.getByRole("navigation", { name: "Main" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Nav Link 1" })).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(
        screen.getByRole("link", { name: "Nav Link 3" }),
      ).toBeInTheDocument();
    });

    it("should hide section titles visually while keeping them announced", async () => {
      render(createForgeLayout({ navState: "rail" }));
      expect(screen.getByText("Nav Section Title")).toHaveAttribute(
        "class",
        expect.stringContaining("visuallyHidden"),
      );
    });

    it.each(["expanded", "rail"] as const)(
      "should render badges with the %s nav state",
      async (navState) => {
        render(createForgeLayout({ navState }));
        expect(screen.getByTestId("nav-link-2-badge")).toHaveTextContent(
          navState,
        );
      },
    );

    it("should keep the controls shown when expanded", async () => {
      render(createForgeLayout({ navState: "rail" }));
      expect(
        screen.getByRole("button", { name: "Production" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("searchbox", { name: "Search for content" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Back" }),
      ).not.toBeInTheDocument();
    });

    it("should show a tooltip built from text children", async () => {
      const { user } = render(createForgeLayout({ navState: "rail" }));
      await hoverOverTooltipTrigger(
        user,
        screen.getByRole("link", { name: "Nav Link 1" }),
      );
      expect(screen.getByRole("tooltip")).toHaveTextContent("Nav Link 1");
    });

    it("should show a tooltip built from label when children aren't text", async () => {
      const { user } = render(createForgeLayout({ navState: "rail" }));
      await hoverOverTooltipTrigger(
        user,
        screen.getByRole("link", { name: "Nav Link 3" }),
      );
      expect(screen.getByRole("tooltip")).toHaveTextContent("Nav Link 3");
    });

    it("should skip the tooltip when there is no text to show", async () => {
      const { user } = render(createForgeLayout({ navState: "rail" }));
      await hoverOverTooltipTrigger(
        user,
        screen.getByRole("link", { name: "Nav Link 5" }),
      );
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("should not render a nav when collapsed", async () => {
      render(createForgeLayout({ navState: "collapsed" }));
      expect(
        screen.queryByRole("navigation", { name: "Main" }),
      ).not.toBeInTheDocument();
    });

    it("should support a custom logo per nav state", async () => {
      render(
        createForgeLayout({
          navState: "rail",
          renderLogo: ({ navState }) => <div>Logo {navState}</div>,
        }),
      );
      expect(screen.getByText("Logo rail")).toBeInTheDocument();
    });

    it.each(["expanded", "rail"] as const)(
      "should pass link props through once when %s",
      async (navState) => {
        const handleFocus = vi.fn();
        const { user } = render(
          createNavLinkLayout({ navState, onFocus: handleFocus }),
        );
        const link = screen.getByRole("link", { name: "Nav Link" });
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("href", "/1");
        await user.tab();
        expect(link).toHaveFocus();
        expect(handleFocus).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe("nav toggle", () => {
    it("should be wired to the nav it controls", async () => {
      render(createForgeLayout({ defaultNavState: "expanded" }));
      const toggle = screen.getByRole("button", {
        name: "Collapse navigation",
      });
      const nav = screen.getByRole("navigation", { name: "Main" });
      expect(toggle).toHaveAttribute("aria-expanded", "true");
      expect(toggle).toHaveAttribute(
        "aria-controls",
        nav.parentElement?.getAttribute("id"),
      );
    });

    it("should toggle an uncontrolled nav between expanded and rail", async () => {
      const handleNavStateChange = vi.fn();
      const { user } = render(
        createForgeLayout({
          defaultNavState: "expanded",
          onNavStateChange: handleNavStateChange,
        }),
      );

      await userClick(
        user,
        screen.getByRole("button", { name: "Collapse navigation" }),
      );
      expect(handleNavStateChange).toHaveBeenCalledWith("rail");
      expect(screen.getByText("Nav Section Title")).toHaveAttribute(
        "class",
        expect.stringContaining("visuallyHidden"),
      );

      await userClick(
        user,
        screen.getByRole("button", { name: "Expand navigation" }),
      );
      expect(handleNavStateChange).toHaveBeenLastCalledWith("expanded");
      expect(screen.getByText("Nav Section Title")).not.toHaveAttribute(
        "class",
        expect.stringContaining("visuallyHidden"),
      );
    });

    it("should leave a controlled nav to its owner", async () => {
      const handleNavStateChange = vi.fn();
      const { user } = render(
        createForgeLayout({
          navState: "expanded",
          onNavStateChange: handleNavStateChange,
        }),
      );

      await userClick(
        user,
        screen.getByRole("button", { name: "Collapse navigation" }),
      );
      expect(handleNavStateChange).toHaveBeenCalledWith("rail");
      expect(
        screen.getByRole("button", { name: "Collapse navigation" }),
      ).toBeInTheDocument();
    });

    it("should not render when the nav is collapsed", async () => {
      render(createForgeLayout({ navState: "collapsed" }));
      expect(
        screen.queryByRole("button", { name: "Collapse navigation" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Expand navigation" }),
      ).not.toBeInTheDocument();
    });

    it("should support a custom accessibility label", async () => {
      render(
        <ForgeLayout defaultNavState="expanded">
          <ForgeLayout.Nav selectedHref="/1">
            <ForgeLayout.NavLink href="/1" iconSymbol={Icon}>
              Nav Link 1
            </ForgeLayout.NavLink>
          </ForgeLayout.Nav>
          <ForgeLayout.Header>
            <ForgeLayout.Controls>
              <ForgeLayout.NavToggle accessibilityLabel="Toggle menu" />
            </ForgeLayout.Controls>
          </ForgeLayout.Header>
          <ForgeLayout.Content>Content</ForgeLayout.Content>
        </ForgeLayout>,
      );
      expect(
        screen.getByRole("button", { name: "Toggle menu" }),
      ).toBeInTheDocument();
    });
  });
});

function createForgeLayout(
  props: {
    mode?: Mode;
    navState?: NavState;
    defaultNavState?: NavState;
    content?: ReactNode;
    selectedHref?: string;
    renderLogo?: ForgeLayoutNavProps["renderLogo"];
    onMenuAction1?: () => void;
    onMenuAction2?: () => void;
    onBackButton?: () => void;
    onModeChange?: () => void;
    onNavStateChange?: (navState: NavState) => void;
  } = {},
) {
  const {
    mode = "production",
    navState,
    defaultNavState = "expanded",
    content = <div>Content</div>,
    selectedHref = "/1",
    renderLogo,
    onMenuAction1 = vi.fn(),
    onMenuAction2 = vi.fn(),
    onBackButton = vi.fn(),
    onModeChange = vi.fn(),
    onNavStateChange = vi.fn(),
  } = props;
  return (
    <ForgeLayout
      mode={mode}
      navState={navState}
      defaultNavState={defaultNavState}
      onNavStateChange={onNavStateChange}
    >
      <ForgeLayout.Nav selectedHref={selectedHref} renderLogo={renderLogo}>
        <ForgeLayout.NavLink href="/1" iconSymbol={Icon}>
          Nav Link 1
        </ForgeLayout.NavLink>
        <ForgeLayout.NavSection title={<>Nav Section Title</>}>
          <ForgeLayout.NavLink
            href="/2"
            iconSymbol={Icon}
            renderBadge={({ navState }) => (
              <span data-testid="nav-link-2-badge">{navState}</span>
            )}
          >
            Nav Link 2
          </ForgeLayout.NavLink>
          {/* Children that aren't plain text, so the rail tooltip has to come
              from `label`. */}
          <ForgeLayout.NavLink href="/3" iconSymbol={Icon} label="Nav Link 3">
            <span>Nav Link 3</span>
          </ForgeLayout.NavLink>
          {/* Neither plain text children nor a `label`, so there is nothing for
              a tooltip to show. */}
          <ForgeLayout.NavLink href="/5" iconSymbol={Icon}>
            <span>Nav Link 5</span>
          </ForgeLayout.NavLink>
        </ForgeLayout.NavSection>
      </ForgeLayout.Nav>
      <ForgeLayout.Header>
        <ForgeLayout.Controls visibleWhenNavStateIs="collapsed">
          <ForgeLayout.BreadcrumbsNavigation>
            <ForgeLayout.BackButton onPress={onBackButton}>
              Back
            </ForgeLayout.BackButton>
            <ForgeLayout.Breadcrumbs>
              <ForgeLayout.Breadcrumb>Breadcrumb One</ForgeLayout.Breadcrumb>
              <ForgeLayout.Breadcrumb>Breadcrumb Two</ForgeLayout.Breadcrumb>
              <ForgeLayout.Breadcrumb>Breadcrumb Three</ForgeLayout.Breadcrumb>
            </ForgeLayout.Breadcrumbs>
          </ForgeLayout.BreadcrumbsNavigation>
        </ForgeLayout.Controls>
        <ForgeLayout.Controls visibleWhenNavStateIs="expanded">
          <ForgeLayout.NavToggle />
          <ForgeLayout.ModeSwitcher onModeChange={onModeChange} />
          <ForgeLayout.Search />
        </ForgeLayout.Controls>
        <ForgeLayout.Actions>
          <ForgeLayout.MenuAction
            accessibilityLabel="Menu Action 1"
            iconSymbol={Icon}
            renderBadge={() => <ForgeLayout.ActionBadge />}
          >
            <Menu.Overlay onAction={onMenuAction1}>
              <Menu.Item>Menu Action 1:1</Menu.Item>
              <Menu.Item>Menu Action 1:2</Menu.Item>
            </Menu.Overlay>
          </ForgeLayout.MenuAction>
          <ForgeLayout.MenuAction
            accessibilityLabel="Menu Action 2"
            iconSymbol={Icon}
          >
            <Menu.Overlay onAction={onMenuAction2}>
              <Menu.Item>Menu Action 2:1</Menu.Item>
              <Menu.Item>Menu Action 2:2</Menu.Item>
            </Menu.Overlay>
          </ForgeLayout.MenuAction>
          <ForgeLayout.LinkAction
            href="/4"
            accessibilityLabel="Action 3"
            iconSymbol={Icon}
          />
          <ForgeLayout.ButtonAction
            accessibilityLabel="Action 4"
            iconSymbol={Icon}
            onPress={() => {}}
          />
        </ForgeLayout.Actions>
      </ForgeLayout.Header>
      <ForgeLayout.Content>{content}</ForgeLayout.Content>
    </ForgeLayout>
  );
}

/**
 * A layout pared down to a single nav link, so the link is the only tabbable
 * element and its props can be asserted in isolation.
 */
function createNavLinkLayout(props: {
  navState: NavState;
  onFocus: () => void;
}) {
  const { navState, onFocus } = props;
  return (
    <ForgeLayout navState={navState}>
      <ForgeLayout.Nav selectedHref="/1">
        <ForgeLayout.NavLink
          href="/1"
          target="_blank"
          iconSymbol={Icon}
          onFocus={onFocus}
        >
          Nav Link
        </ForgeLayout.NavLink>
      </ForgeLayout.Nav>
      <ForgeLayout.Content>Content</ForgeLayout.Content>
    </ForgeLayout>
  );
}

function Icon() {
  return (
    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
  );
}
