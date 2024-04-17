import SearchIcon from "@easypost/easy-ui-icons/Search";
import { screen } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import React from "react";
import { vi } from "vitest";
import { render, userType } from "../utilities/test";
import { InputField } from "./InputField";

describe("<InputField />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render an inputfield", () => {
    render(<InputField label="label" />);
    expect(
      screen.getByLabelText("label", { selector: "input" }),
    ).toBeInTheDocument();
  });

  it("should render an inputfield with correct type", () => {
    render(<InputField label="label" />);
    expect(
      screen.getByLabelText("label", { selector: "input" }),
    ).toHaveAttribute("type", "text");
  });

  it("should render a password inputfield", () => {
    render(<InputField type="password" label="password" />);
    expect(
      screen.getByLabelText("password", { selector: "input" }),
    ).toHaveAttribute("type", "password");
  });

  it("should render a password inputfield with visibility button", () => {
    render(<InputField type="password" label="password" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should render an inputfield with placeholder text", () => {
    render(<InputField label="label" placeholder="enter email" />);
    expect(screen.getByPlaceholderText("enter email")).toBeInTheDocument();
  });

  it("should render a disabled inputfield", () => {
    render(<InputField label="label" isDisabled />);
    expect(
      screen.getByLabelText("label", { selector: "input" }),
    ).toBeDisabled();
  });

  it("should render an inputfield with an icon", () => {
    render(<InputField label="search" iconAtStart={SearchIcon} />);
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should render an inputfield with helperText", () => {
    render(<InputField label="label" helperText="Optional helper text" />);
    expect(screen.getByText("Optional helper text")).toBeInTheDocument();
  });

  it("should render an inputfield with errorText", () => {
    render(
      <InputField
        label="label"
        errorText="Optional error text"
        validationState="invalid"
      />,
    );
    expect(screen.getByText("Optional error text")).toBeInTheDocument();
  });

  it("should render an inputfield with appropriate size styles applied on the input", () => {
    render(<InputField label="label" size="sm" />);
    expect(
      screen.getByLabelText("label", { selector: "input" }),
    ).toHaveAttribute("class", expect.stringContaining("inputSizeSm"));
  });

  it("should render an inputfield that displays a label with emphasis", () => {
    render(<InputField label="label" isLabelEmphasized />);
    expect(screen.getByText("label")).toBeInTheDocument();
    expect(screen.getByText("label").tagName).toBe("STRONG");
  });

  it("should render an inputfield with a default value (uncontrolled)", () => {
    render(<InputField label="label" defaultValue="default" />);
    expect(screen.getByDisplayValue("default")).toBeInTheDocument();
  });

  it("should render an inputfield that supports a change handler (controlled)", async () => {
    const onChange = vi.fn();
    const { user, rerender } = render(
      <InputField label="label" onChange={onChange} />,
    );
    await type(user, screen.getByLabelText("label"), "text");
    expect(onChange).toBeCalled();
    rerender(<InputField label="label" onChange={onChange} />);
    expect(screen.getByDisplayValue("text")).toBeInTheDocument();
  });
});

export async function type(user: UserEvent, el: HTMLElement, phrase: string) {
  await userType(user, el, phrase);
}
