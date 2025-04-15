import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  mockMatchMedia,
  render,
} from "../utilities/test";
import { MultipageSection } from "./MultipageSection";

describe("<MultipageSection />", () => {
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

  it("should render a multipage section", async () => {
    restoreMatchMedia = mockMatchMedia({ getMatches: () => false });

    render(
      createMultipageSection({
        selectedHref: "/1",
      }),
    );

    expect(screen.getByText("MultipageSection Content")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Brand Title" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Link 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Link 2" })).toBeInTheDocument();

    restoreMatchMedia();
  });
});

function createMultipageSection(
  props: {
    selectedHref?: string;
  } = {},
) {
  const { selectedHref = "/1" } = props;
  return (
    <MultipageSection>
      <MultipageSection.Container>
        <MultipageSection.BrandHeader>
          <MultipageSection.BrandHeaderLogo>
            Logo
          </MultipageSection.BrandHeaderLogo>
          <MultipageSection.BrandHeaderTitle>
            Brand Title
          </MultipageSection.BrandHeaderTitle>
        </MultipageSection.BrandHeader>
        <MultipageSection.SplitContainer>
          <MultipageSection.Sidebar>
            <MultipageSection.SidebarNav selectedHref={selectedHref}>
              <MultipageSection.SidebarNavLink href="/1" iconSymbol={Icon}>
                Link 1
              </MultipageSection.SidebarNavLink>
              <MultipageSection.SidebarNavLink href="/2" iconSymbol={Icon}>
                Link 2
              </MultipageSection.SidebarNavLink>
            </MultipageSection.SidebarNav>
          </MultipageSection.Sidebar>
          <MultipageSection.Content>
            <MultipageSection.ContentHeader>
              <MultipageSection.ContentTitle titleIcon={Icon}>
                Content Title
              </MultipageSection.ContentTitle>
            </MultipageSection.ContentHeader>
            <div>MultipageSection Content</div>
          </MultipageSection.Content>
        </MultipageSection.SplitContainer>
      </MultipageSection.Container>
    </MultipageSection>
  );
}

function Icon() {
  return (
    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
  );
}
