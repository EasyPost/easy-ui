import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { mockGetComputedStyle, render, userClick } from "../utilities/test";
import { SelectButton } from "./SelectButton";

describe("<SelectButton />", () => {
  let restoreGetComputedStyle: () => void;

  beforeEach(() => {
    restoreGetComputedStyle = mockGetComputedStyle();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    restoreGetComputedStyle();
  });

  it("should render a button", () => {
    render(<SelectButton>Add Packaging</SelectButton>);
    expect(
      screen.getByRole("button", { name: "Add Packaging" }),
    ).toBeInTheDocument();
  });

  it("should show an expand icon by default", () => {
    render(<SelectButton>Add Packaging</SelectButton>);
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should support an icon at the start", () => {
    render(
      <SelectButton iconAtStart={CheckCircleIcon}>Add Packaging</SelectButton>,
    );
    expect(screen.getAllByRole("img", { hidden: true })).toHaveLength(2);
  });

  it("should support a description", () => {
    render(
      <SelectButton description="2 lb, 3 oz">Custom Package</SelectButton>,
    );
    expect(screen.getByText("Custom Package")).toBeInTheDocument();
    expect(screen.getByText("2 lb, 3 oz")).toBeInTheDocument();
  });

  it("should support being pressed", async () => {
    const handlePress = vi.fn();
    const { user } = render(
      <SelectButton onPress={handlePress}>Add Packaging</SelectButton>,
    );
    await userClick(user, screen.getByRole("button"));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it("should support being disabled", async () => {
    const handlePress = vi.fn();
    const { user } = render(
      <SelectButton isDisabled onPress={handlePress}>
        Add Packaging
      </SelectButton>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    await userClick(user, button);
    expect(handlePress).not.toHaveBeenCalled();
  });

  it("should forward its ref to the button", () => {
    // A callback ref, because Easy UI's buttons all type their ref as `null`.
    let forwarded: unknown = null;
    render(
      <SelectButton
        ref={(el) => {
          forwarded = el;
        }}
      >
        Add Packaging
      </SelectButton>,
    );
    // The wrapper `div` only positions the icons, so a trigger that clones this
    // component has to land its ref on the real `button`.
    expect(forwarded).toBe(screen.getByRole("button"));
  });

  it("should pass through the props a trigger clones onto it", async () => {
    render(
      <SelectButton aria-expanded aria-controls="overlay-id">
        Add Packaging
      </SelectButton>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("aria-controls", "overlay-id");
  });
});
