import { render, screen } from "@testing-library/react";
import SearchIcon from "@easypost/easy-ui-icons/Search";
import React from "react";
import { TextField } from "./TextField";

describe("<TextField />", () => {
  it("should render a standard textfield", () => {
    render(<TextField label="label" />);
    expect(
      screen.getByLabelText("label", { selector: "input" }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("label", { selector: "input" }),
    ).toHaveAttribute("type", "text");
  });

  it("should render a standard textfield with correct type", () => {
    render(<TextField label="label" />);
    expect(
      screen.getByLabelText("label", { selector: "input" }),
    ).toHaveAttribute("type", "text");
  });

  it("should render a password textfield", () => {
    render(<TextField type="password" label="password" />);
    expect(
      screen.getByLabelText("password", { selector: "input" }),
    ).toHaveAttribute("type", "password");
  });

  it("should render a password textfield with visibility button", () => {
    render(<TextField type="password" label="password" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should render a textfield with placeholder text", () => {
    render(<TextField label="label" placeholder="enter email" />);
    expect(screen.getByPlaceholderText("enter email")).toBeInTheDocument();
  });

  it("should render a disabled textfield", () => {
    render(<TextField label="label" isDisabled />);
    expect(
      screen.getByLabelText("label", { selector: "input" }),
    ).toBeDisabled();
  });

  it("should render a textfield with an icon", () => {
    render(<TextField label="search" iconAtStart={SearchIcon} />);
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should render a textfield with helperText", () => {
    render(<TextField label="label" helperText="Optional helper text" />);
    expect(screen.getByText("Optional helper text")).toBeInTheDocument();
  });

  it("should render a textfield with errorText", () => {
    render(
      <TextField
        label="label"
        errorText="Optional error text"
        validationState="invalid"
      />,
    );
    expect(screen.getByText("Optional error text")).toBeInTheDocument();
  });

  it("should render a textfield with appropriate size styles applied on the input", () => {
    render(<TextField label="label" size="sm" />);
    expect(
      screen.getByLabelText("label", { selector: "input" }),
    ).toHaveAttribute("class", expect.stringContaining("inputSizeSm"));
  });

  it("should render a textfield with an emphasized label", () => {
    render(<TextField label="label" emphasizedLabel />);
    expect(screen.getByText("label")).toBeInTheDocument();
    expect(screen.getByText("label").tagName).toBe("STRONG");
  });
});
