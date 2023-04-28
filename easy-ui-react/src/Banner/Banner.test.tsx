import { render, screen } from "@testing-library/react";
import React from "react";
// import { getComponentThemeToken } from "../utilities/css";
import { Banner } from "./Banner";

describe("<Banner />", () => {
  it("should render a banner with text", () => {
    render(<Banner>Banner text</Banner>);
    expect(screen.getByText("Banner text")).toBeInTheDocument();
  });

  it("should render a banner that has text with emphasis", () => {
    render(<Banner emphasis="Text with emphasis">Banner text</Banner>);
    expect(screen.getByText("Text with emphasis")).toBeInTheDocument();
  });

  it("should apply primary variant class", () => {
    render(<Banner variant="primary">Banner text</Banner>);
    expect(screen.getByText("Banner text").closest("div")).toHaveAttribute(
      "class",
      expect.stringContaining("variantPrimary"),
    );
  });

  it("should render a banner with appropriate text variants", () => {
    render(<Banner emphasis="Text with emphasis">Banner text</Banner>);
    expect(screen.getByText("Text with emphasis")).toHaveAttribute(
      "class",
      expect.stringContaining("subtitle1"),
    );
    expect(screen.getByText("Banner text")).toHaveAttribute(
      "class",
      expect.stringContaining("body1"),
    );
  });
});
