import SearchIcon from "@easypost/easy-ui-icons/Search";
import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { render, userType } from "../utilities/test";
import { TextField } from "./TextField";

describe("<TextField />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a standard textfield", () => {
    render(<TextField label="label" />);
    expect(
      screen.getByLabelText("label", { selector: "input" }),
    ).toBeInTheDocument();
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

  it("should render a textfield that displays a label with emphasis", () => {
    render(<TextField label="label" isLabelEmphasized />);
    expect(screen.getByText("label")).toBeInTheDocument();
    expect(screen.getByText("label").tagName).toBe("STRONG");
  });

  it("should support passing through properties", async () => {
    const handleChange = vi.fn();
    const { user } = render(
      <TextField
        label="label"
        defaultValue="test"
        onChange={handleChange}
        data-custom-attribute="text"
      />,
    );
    expect(screen.getByLabelText("label")).toHaveValue("test");
    const textField = screen.getByLabelText("label");
    await userType(user, textField, "value");
    expect(handleChange).toBeCalled();
    expect(screen.getByLabelText("label")).toHaveAttribute(
      "data-custom-attribute",
    );
  });
});
