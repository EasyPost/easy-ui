import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import {
  mockGetComputedStyle,
  render,
  userClick,
  userKeyboard,
  userTab,
} from "../utilities/test";
import { ColorPickerInputField } from "./ColorPickerInputField";

describe("<ColorPickerInputField />", () => {
  let restoreGetComputedStyle: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    restoreGetComputedStyle = mockGetComputedStyle();
  });

  afterEach(() => {
    restoreGetComputedStyle();
    vi.useRealTimers();
  });

  it("should render", () => {
    render(
      <ColorPickerInputField
        defaultValue="#ff0000"
        label="Primary color"
        helperText="Select a primary color"
      />,
    );
    expect(screen.getByText("Primary color")).toBeInTheDocument();
  });

  it("should open", async () => {
    const { user } = render(
      <ColorPickerInputField
        defaultValue="#ff0000"
        label="Primary color"
        helperText="Select a primary color"
      />,
    );
    await userClick(user, screen.getByRole("button", { name: /red/ }));
    expect(screen.getAllByLabelText("Color picker").length).toBeGreaterThan(0);
  });

  it("should change value", async () => {
    const handleChange = vi.fn();
    const { user } = render(
      <ColorPickerInputField
        defaultValue="#ff0000"
        label="Primary color"
        helperText="Select a primary color"
        onChange={handleChange}
      />,
    );
    await userClick(user, screen.getByRole("button", { name: /red/ }));
    expect(screen.getAllByLabelText("Color picker").length).toBeGreaterThan(0);
    await userTab(user);
    await userKeyboard(user, "{ArrowRight}{ArrowUp}{ArrowLeft}{ArrowDown}");
    expect(handleChange).toHaveBeenCalled();
    expect(screen.getByLabelText("Primary color")).toHaveValue("#FC0000");
  });
});
