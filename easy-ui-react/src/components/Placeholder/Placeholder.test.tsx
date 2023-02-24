import React from "react";
import { render, screen } from "@testing-library/react";
import { Placeholder } from "./Placeholder";

describe("Placeholder", async () => {
  it("should render the placeholder message", () => {
    render(<Placeholder status="success" message={<p>Test message</p>} />);
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });
});
