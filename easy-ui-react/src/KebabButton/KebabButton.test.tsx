import React from "react";
import { render, screen } from "@testing-library/react";
import { KebabButton } from "./KebabButton";

describe("<KebabButton />", () => {
  it("should render a button with icon", () => {
    render(<KebabButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });
});
