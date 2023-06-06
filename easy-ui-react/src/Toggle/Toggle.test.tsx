import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { selectCheckbox } from "../Checkbox/Checkbox.test";
import { render } from "../utilities/test";
import { Toggle } from "./Toggle";

describe("<Toggle />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a toggle", () => {
    render(<Toggle>Toggle item</Toggle>);
    expect(screen.getByRole("switch")).toBeInTheDocument();
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("should support uncontrolled", async () => {
    const { user } = render(
      <Toggle defaultSelected={true}>Toggle item</Toggle>,
    );
    expect(screen.getByRole("switch")).toBeChecked();
    await selectCheckbox(user, screen.getByRole("switch"));
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("should support controlled", async () => {
    const handleChange = vi.fn();
    const { user, rerender } = render(
      <Toggle isSelected={false} onChange={handleChange}>
        Toggle item
      </Toggle>,
    );
    await selectCheckbox(user, screen.getByRole("switch"));
    expect(handleChange).toBeCalled();
    expect(screen.getByRole("switch")).not.toBeChecked();
    rerender(
      <Toggle isSelected={true} onChange={handleChange}>
        Toggle item
      </Toggle>,
    );
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("should support isDisabled", () => {
    render(<Toggle isDisabled>Toggle item</Toggle>);
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("should support isReadOnly", async () => {
    const { user } = render(<Toggle isReadOnly>Toggle item</Toggle>);
    await selectCheckbox(user, screen.getByRole("switch"));
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("should support standalone", async () => {
    const { user } = render(<Toggle aria-label="Toggle item" />);
    await selectCheckbox(user, screen.getByRole("switch"));
    expect(screen.getByRole("switch")).toBeChecked();
  });
});
