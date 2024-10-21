import { screen } from "@testing-library/react";
import React, { ReactNode } from "react";
import { vi } from "vitest";
import { Menu } from "../Menu";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  mockMatchMedia,
  render,
  userClick,
} from "../utilities/test";
import { NexusLayout } from "./NexusLayout";

describe("<NexusLayout />", () => {
  let restoreGetComputedStyle: () => void;
  let restoreIntersectionObserver: () => void;
  let restoreMatchMedia: () => void;

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

  it("should render a nexus layout", async () => {
    restoreMatchMedia = mockMatchMedia({ getMatches: () => false });

    const handleMenuAction1 = vi.fn();

    const { user } = render(
      createNexusLayout({
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

    restoreMatchMedia();
  });

  it("should render a multipage nexus layout", async () => {
    restoreMatchMedia = mockMatchMedia({ getMatches: () => false });

    const handleMenuAction1 = vi.fn();

    const { user } = render(
      createNexusLayout({
        selectedHref: "/1",
        onMenuAction1: handleMenuAction1,
        content: (
          <NexusLayout.MultipageContainer>
            <NexusLayout.MultipageSidebar>
              <NexusLayout.MultipageSidebarNav
                selectedHref="/1"
                title={<>Multipage Nav</>}
              >
                <NexusLayout.MultipageSidebarNavSection
                  title={<>Multipage Nav Subsection</>}
                >
                  <NexusLayout.MultipageSidebarNavLink
                    href="/1"
                    iconSymbol={Icon}
                  >
                    Multipage Nav Link 1
                  </NexusLayout.MultipageSidebarNavLink>
                  <NexusLayout.MultipageSidebarNavLink
                    href="/2"
                    iconSymbol={Icon}
                  >
                    Multipage Nav Link 2
                  </NexusLayout.MultipageSidebarNavLink>
                </NexusLayout.MultipageSidebarNavSection>
              </NexusLayout.MultipageSidebarNav>
            </NexusLayout.MultipageSidebar>
            <NexusLayout.MultipageContent>
              <NexusLayout.MultipageHeader>
                <NexusLayout.MultipageTitle>
                  Multipage Title
                </NexusLayout.MultipageTitle>
              </NexusLayout.MultipageHeader>
              <div>Content</div>
            </NexusLayout.MultipageContent>
          </NexusLayout.MultipageContainer>
        ),
      }),
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getAllByRole("banner").length).toBe(2);
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Multipage Nav" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Nav Link 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Action 3" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Multipage Nav Link 1" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("heading", { name: "Multipage Title" }),
    ).toBeInTheDocument();

    await userClick(
      user,
      screen.getByRole("button", { name: "Menu Action 1" }),
    );
    await userClick(
      user,
      screen.getByRole("menuitem", { name: "Menu Action 1:1" }),
    );

    expect(handleMenuAction1).toBeCalled();

    restoreMatchMedia();
  });
});

function createNexusLayout(
  props: {
    content?: ReactNode;
    selectedHref?: string;
    onMenuAction1?: () => void;
    onMenuAction2?: () => void;
  } = {},
) {
  const {
    content = <div>Content</div>,
    selectedHref = "/1",
    onMenuAction1 = vi.fn(),
    onMenuAction2 = vi.fn(),
  } = props;
  return (
    <NexusLayout>
      <NexusLayout.Header>
        <NexusLayout.Nav selectedHref={selectedHref}>
          <NexusLayout.NavLink href="/1" iconSymbol={Icon}>
            Nav Link 1
          </NexusLayout.NavLink>
          <NexusLayout.NavLink href="/2" iconSymbol={Icon}>
            Nav Link 2
          </NexusLayout.NavLink>
        </NexusLayout.Nav>
        <NexusLayout.Actions>
          <NexusLayout.MenuAction
            accessibilityLabel="Menu Action 1"
            iconSymbol={Icon}
            renderBadge={() => <div />}
          >
            <Menu.Overlay onAction={onMenuAction1}>
              <Menu.Item>Menu Action 1:1</Menu.Item>
              <Menu.Item>Menu Action 1:2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
          <NexusLayout.MenuAction
            accessibilityLabel="Menu Action 2"
            iconSymbol={Icon}
          >
            <Menu.Overlay onAction={onMenuAction2}>
              <Menu.Item>Menu Action 2:1</Menu.Item>
              <Menu.Item>Menu Action 2:2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
          <NexusLayout.LinkAction
            href="/1"
            accessibilityLabel="Action 3"
            iconSymbol={Icon}
          />
        </NexusLayout.Actions>
      </NexusLayout.Header>
      <NexusLayout.Content>{content}</NexusLayout.Content>
    </NexusLayout>
  );
}

function Icon() {
  return (
    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
  );
}
