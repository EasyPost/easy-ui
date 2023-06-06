import { render, screen } from "@testing-library/react";
import React from "react";
import { TextArea } from "./TextArea";

describe("<TextArea />", () => {
  it("should render a standard textarea", () => {
    render(<TextArea label="label" />);
    expect(
      screen.getByLabelText("label", { selector: "textarea" }),
    ).toBeInTheDocument();
  });

  it("should render a textarea with placeholder text", () => {
    render(<TextArea label="label" placeholder="enter description" />);
    expect(
      screen.getByPlaceholderText("enter description"),
    ).toBeInTheDocument();
  });

  it("should render a disabled textarea", () => {
    render(<TextArea label="label" isDisabled />);
    expect(
      screen.getByLabelText("label", { selector: "textarea" }),
    ).toBeDisabled();
  });

  it("should render a textarea with helperText", () => {
    render(<TextArea label="label" helperText="Optional helper text" />);
    expect(screen.getByText("Optional helper text")).toBeInTheDocument();
  });

  it("should render a textarea with errorText", () => {
    render(
      <TextArea
        label="label"
        errorText="Optional error text"
        validationState="invalid"
      />,
    );
    expect(screen.getByText("Optional error text")).toBeInTheDocument();
  });

  it("should render a textarea with an emphasized label", () => {
    render(<TextArea label="label" emphasizedLabel />);
    expect(screen.getByText("label")).toBeInTheDocument();
    expect(screen.getByText("label").tagName).toBe("STRONG");
  });
});
