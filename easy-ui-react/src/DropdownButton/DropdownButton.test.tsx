import React from "react";
import { render, screen } from "@testing-library/react";
import { DropdownButton } from "./DropdownButton";

describe("<Button />", () => {
  it("should render a button with icon", () => {
    render(<DropdownButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should render a button with text", () => {
    render(<DropdownButton>Testing</DropdownButton>);
    expect(screen.getByText(/testing/i)).toBeInTheDocument();
  });
});
