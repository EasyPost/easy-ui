import { act, screen } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import React from "react";
import { vi } from "vitest";
import { hoverOverTooltipTrigger } from "../Tooltip/Tooltip.test";
import { render } from "../utilities/test";
import { Checkbox } from "./Checkbox";

describe("<Checkbox />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a checkbox", () => {
    render(<Checkbox>Checkbox item</Checkbox>);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("should support uncontrolled", async () => {
    const { user } = render(
      <Checkbox defaultSelected={true}>Checkbox item</Checkbox>,
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
    await selectCheckbox(user, screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("should support controlled", async () => {
    const handleChange = vi.fn();
    const { user, rerender } = render(
      <Checkbox isSelected={false} onChange={handleChange}>
        Checkbox item
      </Checkbox>,
    );
    await selectCheckbox(user, screen.getByRole("checkbox"));
    expect(handleChange).toBeCalled();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    rerender(
      <Checkbox isSelected={true} onChange={handleChange}>
        Checkbox item
      </Checkbox>,
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("should support isDisabled", () => {
    render(<Checkbox isDisabled>Checkbox item</Checkbox>);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("should support isReadOnly", async () => {
    const { user } = render(<Checkbox isReadOnly>Checkbox item</Checkbox>);
    await selectCheckbox(user, screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("should support isIndeterminate", () => {
    render(<Checkbox isIndeterminate>Checkbox item</Checkbox>);
    expect(
      (screen.getByRole("checkbox") as HTMLInputElement).indeterminate,
    ).toBeTruthy();
  });

  it("should support errors", async () => {
    const { user } = render(
      <Checkbox validationState="invalid" errorText="This field is required">
        Checkbox item
      </Checkbox>,
    );
    await hoverOverTooltipTrigger(user, screen.getByText("Error"));
    expect(screen.getByRole("checkbox")).toBeInvalid();
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("should support nesting", async () => {
    render(<Checkbox isNested>Checkbox item</Checkbox>);
    expect(screen.getByTestId("root")).toHaveAttribute(
      "class",
      expect.stringContaining("nested"),
    );
  });

  it("should support large size", async () => {
    render(<Checkbox size="lg">Checkbox item</Checkbox>);
    expect(screen.getByTestId("root")).toHaveAttribute(
      "class",
      expect.stringContaining("sizeLg"),
    );
  });
});

export async function selectCheckbox(user: UserEvent, el: HTMLElement) {
  await act(async () => {
    await user.click(el);
    vi.runAllTimers();
  });
}
