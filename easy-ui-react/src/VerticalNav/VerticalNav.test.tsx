import { screen } from "@testing-library/react";
import React from "react";
import { render } from "../utilities/test";
import { ExpandableVerticalNav, VerticalNav } from "./VerticalNav";

describe("<VerticalNav />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a simple nav", () => {
    render(
      <VerticalNav
        aria-label="Sidebar"
        renderLogo={() => <div data-testid="logo" />}
        renderBanner={() => <div data-testid="banner" />}
        selectedKey={"1"}
      >
        <VerticalNav.Item key="1" label="Item 1" href="/1" />
        <VerticalNav.Item key="2" label="Item 2" href="/2" />
        <VerticalNav.Item key="3" label="Item 3" href="/3" />
        <VerticalNav.Item key="4" label="Item 4" href="/4" />
        <VerticalNav.Item key="5" label="Item 5" href="/5" />
      </VerticalNav>,
    );
    expect(screen.getByLabelText("Sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByTestId("banner")).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toBe(5);
    expect(screen.getByRole("link", { name: "Item 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("should support polymorphic items", async () => {
    const handleClick = vi.fn();
    const { user } = render(
      <VerticalNav aria-label="Sidebar">
        <VerticalNav.Item
          key="1"
          label="Item 1"
          as="button"
          onClick={handleClick}
        />
      </VerticalNav>,
    );
    expect(screen.getByLabelText("Sidebar")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
    await user.click(screen.getByRole("button"));
    expect(handleClick).toBeCalled();
  });

  it("should support a supplementary action", async () => {
    const handleClick = vi.fn();
    const { user } = render(
      <VerticalNav
        aria-label="Sidebar"
        supplementaryAction={
          <VerticalNav.SupplementaryAction as="button" onClick={handleClick}>
            Supplementary Action Button
          </VerticalNav.SupplementaryAction>
        }
      >
        <VerticalNav.Item key="1" label="Item 1" href="/1" />
      </VerticalNav>,
    );
    expect(screen.getByLabelText("Sidebar")).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Supplementary Action Button" }),
    );
    expect(handleClick).toBeCalled();
  });

  it("should render a dense nav", () => {
    render(
      <VerticalNav aria-label="Sidebar" selectedKey={"2"}>
        <VerticalNav.Item key="1" label="Item 1" href="/1" />
        <VerticalNav.Item key="2" label="Item 2" href="/2">
          <VerticalNav.Subnav selectedKey={"2/a"}>
            <VerticalNav.Item key="2/a" label="Item 2/a" href="/2/a" />
            <VerticalNav.Item key="2/b" label="Item 2/b" href="/2/b" />
            <VerticalNav.Item key="2/c" label="Item 2/c" href="/2/c" />
          </VerticalNav.Subnav>
        </VerticalNav.Item>
        <VerticalNav.Item key="3" label="Item 3" href="/3" />
        <VerticalNav.Item key="4" label="Item 4" href="/4" />
        <VerticalNav.Item key="5" label="Item 5" href="/5" />
      </VerticalNav>,
    );
    expect(screen.getByLabelText("Sidebar")).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toBe(8);
    expect(screen.getByRole("link", { name: "Item 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("link", { name: "Item 2/a" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("should render an expandable nav", async () => {
    const handleExpandedChange = vi.fn();
    const { user } = render(
      <ExpandableVerticalNav
        aria-label="Sidebar"
        selectedKey="2"
        expandedKeys={["2"]}
        onExpandedChange={handleExpandedChange}
      >
        <VerticalNav.Item key="1" label="Item 1" href="/1" />
        <VerticalNav.Item key="2" label="Item 2" href="/2">
          <VerticalNav.Subnav selectedKey={"2/b"}>
            <VerticalNav.Item key="2/a" label="Item 2/a" href="/2/a" />
            <VerticalNav.Item key="2/b" label="Item 2/b" href="/2/b">
              <VerticalNav.Subnav selectedKey={"2/b/1"}>
                <VerticalNav.Item
                  key="2/b/1"
                  label="Item 2/b/1"
                  href="/2/b/1"
                />
                <VerticalNav.Item
                  key="2/b/2"
                  label="Item 2/b/2"
                  href="/2/b/2"
                />
              </VerticalNav.Subnav>
            </VerticalNav.Item>
          </VerticalNav.Subnav>
        </VerticalNav.Item>
      </ExpandableVerticalNav>,
    );
    expect(screen.getByLabelText("Sidebar")).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toBe(6);
    expect(screen.getByRole("link", { name: "Item 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("link", { name: "Item 2" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("link", { name: "Item 2/b" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("link", { name: "Item 2/b/1" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await user.click(screen.getAllByRole("button", { name: "Expand" })[0]);
    expect(handleExpandedChange).toBeCalled();
  });
});
