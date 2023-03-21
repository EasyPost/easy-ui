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
      expect.stringContaining("Primary"),
    );
  });

  it("should apply the secondary color class", () => {
    render(<DropdownButton color="secondary" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Secondary"),
    );
  });

  it("should apply the success color class", () => {
    render(<DropdownButton color="success" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Success"),
    );
  });

  it("should apply the warning color class", () => {
    render(<DropdownButton color="warning" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Warning"),
    );
  });

  it("should apply the neutral color class", () => {
    render(<DropdownButton color="neutral" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Neutral"),
    );
  });

  it("should apply the support color class", () => {
    render(<DropdownButton color="support" variant="outlined" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Support"),
    );
  });

  it("should apply the inverse color class", () => {
    render(<DropdownButton color="inverse" variant="outlined" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Inverse"),
    );
  });

  it("should apply the outlined variant class", () => {
    render(<DropdownButton variant="outlined" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Outlined"),
    );
  });

  it("should apply the disabled attribute", () => {
    render(<DropdownButton isDisabled />);
    expect(screen.getByRole("button")).toHaveAttribute("disabled");
  });
});
