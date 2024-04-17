import { screen } from "@testing-library/react";
import React, { ComponentProps } from "react";
import { vi } from "vitest";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
  userClick,
} from "../utilities/test";
import { TabNav } from "./TabNav";

describe("<TabNav />", () => {
  let restoreGetComputedStyle: () => void;
  let restoreIntersectionObserver: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    restoreGetComputedStyle = mockGetComputedStyle();
    restoreIntersectionObserver = mockIntersectionObserver();
  });

  afterEach(() => {
    restoreIntersectionObserver();
    restoreGetComputedStyle();
    vi.useRealTimers();
  });

  it("should render an accessible TabNav", () => {
    render(
      <TabNav aria-label="Test">
        <TabNav.Item href="#tab-1" isCurrentPage>
          Tab 1
        </TabNav.Item>
        <TabNav.Item href="#tab-2">Tab 2</TabNav.Item>
      </TabNav>,
    );
    expect(
      screen.getByRole("navigation", { name: "Test" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tab 1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tab 1" })).toHaveAttribute(
      "href",
      "#tab-1",
    );
    expect(screen.getByRole("link", { name: "Tab 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Tab 2" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("should render custom links", async () => {
    const onClick = vi.fn();
    const { user } = render(
      <TabNav aria-label="Test">
        <TabNav.Item as={ButtonLink} isCurrentPage onClick={onClick}>
          Tab 1
        </TabNav.Item>
        <TabNav.Item as={ButtonLink} onClick={onClick}>
          Tab 2
        </TabNav.Item>
      </TabNav>,
    );
    expect(screen.getByRole("button", { name: "Tab 1" })).toBeInTheDocument();
    await userClick(user, screen.getByRole("button", { name: "Tab 1" }));
    expect(onClick).toBeCalled();
  });
});

function ButtonLink(props: ComponentProps<"button">) {
  return <button {...props} />;
}
