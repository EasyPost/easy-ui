import Anchor from "@easypost/easy-ui-icons/Anchor";
import { screen } from "@testing-library/react";
import React from "react";
import { render } from "../utilities/test";
import { Badge } from "./Badge";
import { SpyInstance, vi } from "vitest";
import noop from "lodash/noop";

describe("<Badge />", () => {
  let consoleWarnSpy: SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(noop);
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it("should render simple text", () => {
    render(<Badge>Badge text</Badge>);
    expect(screen.getByText("Badge text")).toBeInTheDocument();
  });

  it("should render simple icon", () => {
    render(<Badge accessibilityLabel="Intent of badge" icon={Anchor} />);
    expect(screen.getByLabelText(/intent of badge/i)).toBeInTheDocument();
  });

  it("should render detailed icon", () => {
    render(<Badge icon={Anchor}>Badge text</Badge>);
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
    expect(screen.getByText("Badge text")).toBeInTheDocument();
  });

  it("should render detailed text", () => {
    render(<Badge secondaryLabel="Secondary text">Badge text</Badge>);
    expect(screen.getByText("Badge text")).toBeInTheDocument();
    expect(screen.getByText("Secondary text")).toBeInTheDocument();
  });

  it("should support passing variants", () => {
    render(<Badge variant="secondary">Badge text</Badge>);
    expect(screen.getByTestId("root")).toHaveAttribute(
      "class",
      expect.stringContaining("variantSecondary"),
    );
  });

  it("should warn on missing children or icon", () => {
    render(<Badge secondaryLabel="Secondary text" />);
    expect(consoleWarnSpy).toBeCalledWith(
      expect.stringMatching(/requires one of children or icon/),
    );
  });

  it("should warn with no accessibility label on icon", () => {
    render(<Badge icon={Anchor} />);
    expect(consoleWarnSpy).toBeCalledWith(
      expect.stringMatching(/must have accessibilityLabel/),
    );
  });

  it("should warn on secondaryLabel with icon", () => {
    render(
      <Badge
        accessibilityLabel="Intent of badge"
        secondaryLabel="Secondary text"
        icon={Anchor}
      />,
    );
    expect(consoleWarnSpy).toBeCalledWith(
      expect.stringMatching(/secondaryLabel is not supported/),
    );
  });
});
