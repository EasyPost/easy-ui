import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { Button } from "../Button";
import { render, userClick, userKeyboard, userTab } from "../utilities/test";
import { ColorPicker, useColorPickerState } from "./ColorPicker";

describe("<ColorPicker />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render", () => {
    render(
      <ColorPicker>
        <ColorPicker.Trigger>
          <Button>Pick a color</Button>
        </ColorPicker.Trigger>
      </ColorPicker>,
    );
    expect(screen.getByText("Pick a color")).toBeInTheDocument();
  });

  it("should open", async () => {
    const { user } = render(
      <ColorPicker>
        <ColorPicker.Trigger>
          <Button>Pick a color</Button>
        </ColorPicker.Trigger>
      </ColorPicker>,
    );
    await userClick(user, screen.getByText("Pick a color"));
    expect(screen.getAllByLabelText("Color picker").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Hue slider")).toBeInTheDocument();
  });

  it("should select a color", async () => {
    const handleChange = vi.fn();
    const { user } = render(
      <ColorPicker defaultValue="#ff0000" onChange={handleChange}>
        <ColorPicker.Trigger>
          <Button>Pick a color</Button>
        </ColorPicker.Trigger>
      </ColorPicker>,
    );
    await userClick(user, screen.getByText("Pick a color"));
    expect(screen.getAllByLabelText("Color picker").length).toBeGreaterThan(0);
    await userTab(user);
    await userKeyboard(user, "{ArrowRight}{ArrowUp}{ArrowLeft}{ArrowDown}");
    expect(handleChange).toHaveBeenCalled();
  });

  it("should support context hook", async () => {
    function SelectedColor() {
      const { color } = useColorPickerState();
      return <span>{color ? color.toString("css") : "None"}</span>;
    }

    const handleChange = vi.fn();
    const { user } = render(
      <ColorPicker defaultValue="#ff0000" onChange={handleChange}>
        <SelectedColor />
        <ColorPicker.Trigger>
          <Button>Pick a color</Button>
        </ColorPicker.Trigger>
      </ColorPicker>,
    );

    await userClick(user, screen.getByText("Pick a color"));
    expect(screen.getAllByLabelText("Color picker").length).toBeGreaterThan(0);
    await userTab(user);
    await userKeyboard(user, "{ArrowRight}{ArrowUp}{ArrowLeft}{ArrowDown}");
    expect(screen.getByText("hsla(0, 100%, 49.5%, 1)")).toBeInTheDocument();
  });
});
