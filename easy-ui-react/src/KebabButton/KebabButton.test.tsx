import React from "react";
import { render, screen } from "@testing-library/react";
import { KebabButton } from "./KebabButton";

describe("<KebabButton />", () => {
  it("should render a button with icon", () => {
    render(<KebabButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should label the button 'Actions' by default", () => {
    render(<KebabButton />);
    expect(screen.getByRole("button", { name: "Actions" })).toBeInTheDocument();
  });

  it("should render a ghost xs support icon button", () => {
    render(<KebabButton accessibilityLabel="Row actions" />);
    const button = screen.getByRole("button", { name: "Row actions" });
    expect(button).toHaveAttribute(
      "class",
      expect.stringContaining("variantGhost"),
    );
    expect(button).toHaveAttribute("class", expect.stringContaining("sizeXs"));
    expect(button).toHaveAttribute(
      "class",
      expect.stringContaining("colorSupport"),
    );
  });
});
