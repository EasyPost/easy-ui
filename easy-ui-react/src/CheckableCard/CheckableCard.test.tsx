import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { hoverOverTooltipTrigger } from "../Tooltip/Tooltip.test";
import { render, selectCheckbox } from "../utilities/test";
import { CheckableCard } from "./CheckableCard";

describe("<CheckableCard />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a CheckableCard", () => {
    render(<CheckableCard header="Header">Content</CheckableCard>);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("should support uncontrolled", async () => {
    const { user } = render(
      <CheckableCard header="Header" defaultSelected={true}>
        Checkbox item
      </CheckableCard>,
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
    await selectCheckbox(user, screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("should support controlled", async () => {
    const handleChange = vi.fn();
    const { user, rerender } = render(
      <CheckableCard header="Header" isSelected={false} onChange={handleChange}>
        Checkbox item
      </CheckableCard>,
    );
    await selectCheckbox(user, screen.getByRole("checkbox"));
    expect(handleChange).toBeCalled();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    rerender(
      <CheckableCard header="Header" isSelected={true} onChange={handleChange}>
        Checkbox item
      </CheckableCard>,
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("should support isDisabled", () => {
    render(
      <CheckableCard header="Header" isDisabled>
        Checkbox item
      </CheckableCard>,
    );
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("should support isReadOnly", async () => {
    const { user } = render(
      <CheckableCard header="Header" isReadOnly>
        Checkbox item
      </CheckableCard>,
    );
    await selectCheckbox(user, screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("should support isIndeterminate", () => {
    render(
      <CheckableCard header="Header" isIndeterminate>
        Checkbox item
      </CheckableCard>,
    );
    expect(
      (screen.getByRole("checkbox") as HTMLInputElement).indeterminate,
    ).toBeTruthy();
  });

  it("should support errors", async () => {
    const { user } = render(
      <CheckableCard
        header="Header"
        validationState="invalid"
        errorText="This field is required"
      >
        Checkbox item
      </CheckableCard>,
    );
    await hoverOverTooltipTrigger(user, screen.getByText("Error"));
    expect(screen.getByRole("checkbox")).toBeInvalid();
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });
});
