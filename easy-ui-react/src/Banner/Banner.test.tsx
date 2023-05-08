import { render, screen } from "@testing-library/react";
import React from "react";
import { Banner } from "./Banner";

describe("<Banner />", () => {
  it("should render a banner with text", () => {
    render(<Banner>Banner text</Banner>);
    expect(screen.getByText("Banner text")).toBeInTheDocument();
  });

  it("should render a banner that has text with emphasis and importance", () => {
    render(<Banner emphasisText="Text with emphasis">Banner text</Banner>);
    expect(screen.getByText(/Text with emphasis/i)).toBeInTheDocument();
    expect(screen.getByText(/Text with emphasis/i).tagName).toBe("STRONG");
  });

  it("should render a banner that automatically applies a delimeter", () => {
    render(<Banner emphasisText="Text with emphasis">Banner text</Banner>);
    expect(screen.getByText("Text with emphasis:")).toBeInTheDocument();
  });

  it("should apply the primary variant class", () => {
    render(<Banner variant="primary">Banner text</Banner>);
    expect(screen.getByText("Banner text").closest("div")).toHaveAttribute(
      "class",
      expect.stringContaining("variantPrimary"),
    );
  });

  it("should render a banner with appropriate text variant", () => {
    render(<Banner emphasisText="Text with emphasis">Banner text</Banner>);
    expect(
      screen.getByText(/Text with emphasis/i).closest("strong"),
    ).toHaveAttribute("class", expect.stringContaining("subtitle1"));
    expect(screen.getByText("Banner text")).toHaveAttribute(
      "class",
      expect.stringContaining("body1"),
    );
  });
});
