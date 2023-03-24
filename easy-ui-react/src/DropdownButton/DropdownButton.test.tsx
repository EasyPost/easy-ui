import React from "react";
import { render, screen } from "@testing-library/react";
import { DropdownButton } from "./DropdownButton";

describe("<DropdownButton />", () => {
  it("should render a button with icon", () => {
    render(<DropdownButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should render a button with text", () => {
    render(<DropdownButton>Testing</DropdownButton>);
    expect(screen.getByText(/testing/i)).toBeInTheDocument();
  });

  it("should apply the primary color class", () => {
    render(<DropdownButton />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("colorPrimary"),
    );
  });

  it("should apply the secondary color class", () => {
    render(<DropdownButton color="secondary" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("colorSecondary"),
    );
  });

  it("should apply the outlined variant class", () => {
    render(<DropdownButton variant="outlined" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("variantOutlined"),
    );
  });

  it("should apply the disabled attribute", () => {
    render(<DropdownButton isDisabled />);
    expect(screen.getByRole("button")).toHaveAttribute("disabled");
  });
});
