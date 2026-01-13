import Anchor from "@easypost/easy-ui-icons/Anchor";
import { screen } from "@testing-library/react";
import React from "react";
import { render } from "../utilities/test";
import { AlertBadge } from "./AlertBadge";
import { MockInstance, vi } from "vitest";
import noop from "lodash/noop";
import { getResponsiveDesignToken } from "../utilities/css";

describe("<AlertBadge />", () => {
  let consoleWarnSpy: MockInstance;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(noop);
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it("should render only content when not showing", () => {
    render(<AlertBadge show={false}>AlertBadge text</AlertBadge>);
    expect(screen.getByText("AlertBadge text")).toBeInTheDocument();
    expect(screen.queryByTestId("root")).toBeNull();
  });

  it("should render when showing", () => {
    render(<AlertBadge show>AlertBadge text</AlertBadge>);
    expect(screen.getByText("AlertBadge text")).toBeInTheDocument();
    expect(screen.getByTestId("root")).toBeInTheDocument();
  });

  it("should render icon", () => {
    render(
      <AlertBadge show accessibilityLabel="Intent of AlertBadge" icon={Anchor}>
        Hello
      </AlertBadge>,
    );
    expect(screen.getByText(/intent of AlertBadge/i)).toBeInTheDocument();
    expect(screen.getByTestId("root")).toBeInTheDocument();
    const $svg = screen.getByRole("img", { hidden: true });
    expect($svg.closest("span")).toHaveStyle(
      getResponsiveDesignToken("icon", "size", "size.icon", "2xs"),
    );
  });

  it("should support passing variants", () => {
    render(
      <AlertBadge show variant="secondary">
        AlertBadge text
      </AlertBadge>,
    );
    expect(screen.getByTestId("root")).toHaveAttribute(
      "class",
      expect.stringContaining("variantSecondary"),
    );
  });

  it("should support passing placement", () => {
    render(
      <AlertBadge show placement="bottom right">
        AlertBadge text
      </AlertBadge>,
    );
    expect(screen.getByTestId("root")).toHaveAttribute(
      "class",
      expect.stringContaining("bottom"),
    );
    expect(screen.getByTestId("root")).toHaveAttribute(
      "class",
      expect.stringContaining("right"),
    );
  });
});
