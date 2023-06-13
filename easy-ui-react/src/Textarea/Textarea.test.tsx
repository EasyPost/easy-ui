import { render, screen } from "@testing-library/react";
import React from "react";
import { Textarea } from "./Textarea";

describe("<Textarea />", () => {
  it("should render a standard textarea", () => {
    render(<Textarea label="label" />);
    expect(
      screen.getByLabelText("label", { selector: "textarea" }),
    ).toBeInTheDocument();
  });

  it("should render a textarea with placeholder text", () => {
    render(<Textarea label="label" placeholder="enter description" />);
    expect(
      screen.getByPlaceholderText("enter description"),
    ).toBeInTheDocument();
  });

  it("should render a disabled textarea", () => {
    render(<Textarea label="label" isDisabled />);
    expect(
      screen.getByLabelText("label", { selector: "textarea" }),
    ).toBeDisabled();
  });

  it("should render a textarea with helperText", () => {
    render(<Textarea label="label" helperText="Optional helper text" />);
    expect(screen.getByText("Optional helper text")).toBeInTheDocument();
  });

  it("should render a textarea with errorText", () => {
    render(
      <Textarea
        label="label"
        errorText="Optional error text"
        validationState="invalid"
      />,
    );
    expect(screen.getByText("Optional error text")).toBeInTheDocument();
  });

  it("should render a textarea that displays a label with emphasis", () => {
    render(<Textarea label="label" isLabelEmphasized />);
    expect(screen.getByText("label")).toBeInTheDocument();
    expect(screen.getByText("label").tagName).toBe("STRONG");
  });
});
