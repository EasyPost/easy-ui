import { screen } from "@testing-library/react";
import React, { ReactNode } from "react";
import { vi } from "vitest";
import { Menu } from "../Menu";
import { TabNav } from "../TabNav";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  mockMatchMedia,
  render,
  userClick,
} from "../utilities/test";
import { ProductLayout } from "./ProductLayout";

describe("<ProductLayout />", () => {
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

  it("should render a product layout", async () => {
    restoreMatchMedia = mockMatchMedia({ getMatches: () => false });

    const handlePrimaryAction = vi.fn();
    const handleSecondaryAction = vi.fn();
    const handleHelpMenuAction = vi.fn();

    const { user } = render(
      createProductLayout({
        onHelpMenuAction: handleHelpMenuAction,
        onPrimaryAction: handlePrimaryAction,
        onSecondaryAction: handleSecondaryAction,
      }),
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Account Settings" }),
    ).toBeInTheDocument();

    await userClick(user, screen.getByRole("button", { name: "CTA 1" }));

    expect(handlePrimaryAction).toBeCalled();

    restoreMatchMedia();
  });

  it("should render a tabbed product layout", async () => {
    restoreMatchMedia = mockMatchMedia({ getMatches: () => false });

    const handleTab1Click = vi.fn();
    const handleTab2Click = vi.fn();

    const { user } = render(
      createProductLayout({
        content: (
          <ProductLayout.TabbedContent
            aria-label="Settings"
            tabs={[
              <TabNav.Item
                key="1"
                as="button"
                isCurrentPage
                onClick={handleTab1Click}
              >
                Tab 1
              </TabNav.Item>,
              <TabNav.Item key="2" as="button" onClick={handleTab2Click}>
                Tab 2
              </TabNav.Item>,
            ]}
          >
            Tabbed Content
          </ProductLayout.TabbedContent>
        ),
      }),
    );

    expect(screen.getByText("Tabbed Content")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Account Settings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Settings" }),
    ).toBeInTheDocument();

    await userClick(user, screen.getByRole("button", { name: "Tab 2" }));

    expect(handleTab2Click).toBeCalled();

    restoreMatchMedia();
  });
});

function createProductLayout(
  props: {
    content?: ReactNode;
    onHelpMenuAction?: () => void;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
  } = {},
) {
  const {
    content = (
      <ProductLayout.Content>
        <div>Content</div>
      </ProductLayout.Content>
    ),
    onHelpMenuAction = vi.fn(),
    onPrimaryAction = vi.fn(),
    onSecondaryAction = vi.fn(),
  } = props;
  return (
    <ProductLayout
      sidebar={
        <ProductLayout.Sidebar>
          <div />
        </ProductLayout.Sidebar>
      }
      header={
        <ProductLayout.Header
          title={<>Account Settings</>}
          helpMenuItems={[<Menu.Item key="1">Documentation</Menu.Item>]}
          onHelpMenuAction={onHelpMenuAction}
          primaryAction={{
            content: "CTA 1",
            onAction: onPrimaryAction,
          }}
          secondaryAction={{
            content: "CTA 2",
            onAction: onSecondaryAction,
          }}
          renderSmallScreenLogo={() => <div data-logo-mark />}
        />
      }
      content={content}
    />
  );
}
