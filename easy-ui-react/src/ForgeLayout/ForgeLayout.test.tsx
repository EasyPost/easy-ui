import { screen } from "@testing-library/react";
import React, { ReactNode } from "react";
import { vi } from "vitest";
import { Menu } from "../Menu";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
  userClick,
} from "../utilities/test";
import { ForgeLayout, Mode, NavState } from "./ForgeLayout";

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

    const { user } = render(
      createForgeLayout({
        selectedHref: "/1",
        onMenuAction1: handleMenuAction1,
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
  });

  it("should render collapsed state", async () => {
    render(
      createForgeLayout({
        navState: "collapsed",
        selectedHref: "/1",
      }),
    );
    expect(
      screen.queryByRole("navigation", { name: "Main" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Controls when expanded"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Controls when collapsed")).toBeInTheDocument();
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
});

function createForgeLayout(
  props: {
    mode?: Mode;
    navState?: NavState;
    content?: ReactNode;
    selectedHref?: string;
    onMenuAction1?: () => void;
    onMenuAction2?: () => void;
  } = {},
) {
  const {
    mode = "production",
    navState = "expanded",
    content = <div>Content</div>,
    selectedHref = "/1",
    onMenuAction1 = vi.fn(),
    onMenuAction2 = vi.fn(),
  } = props;
  return (
    <ForgeLayout mode={mode} navState={navState}>
      <ForgeLayout.Nav selectedHref={selectedHref}>
        <ForgeLayout.NavLink href="/1" iconSymbol={Icon}>
          Nav Link 1
        </ForgeLayout.NavLink>
        <ForgeLayout.NavSection title={<>Nav Section Title</>}>
          <ForgeLayout.NavLink href="/2" iconSymbol={Icon}>
            Nav Link 2
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/3" iconSymbol={Icon}>
            Nav Link 3
          </ForgeLayout.NavLink>
        </ForgeLayout.NavSection>
      </ForgeLayout.Nav>
      <ForgeLayout.Header>
        <ForgeLayout.Controls visibleWhenNavStateIs="collapsed">
          <div>Controls when collapsed</div>
        </ForgeLayout.Controls>
        <ForgeLayout.Controls visibleWhenNavStateIs="expanded">
          <div>Controls when expanded</div>
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

function Icon() {
  return (
    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
  );
}
