import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { render, selectCheckbox } from "../utilities/test";
import { RadioButtonGroup } from "./RadioButtonGroup";

describe("<RadioButtonGroup />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a radio group", () => {
    render(
      <RadioButtonGroup>
        <RadioButtonGroup.Button id="first">
          First Button
        </RadioButtonGroup.Button>
        <RadioButtonGroup.Button id="second">
          Second Button
        </RadioButtonGroup.Button>
      </RadioButtonGroup>,
    );
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getAllByRole("radio").length).toBe(2);
    expect(screen.getAllByRole("radio")[0]).toHaveAttribute("aria-checked");
  });

  it("should update when a button is clicked", async () => {
    const { user } = render(
      <RadioButtonGroup defaultSelectedKeys={["first"]}>
        <RadioButtonGroup.Button id="first">First item</RadioButtonGroup.Button>
        <RadioButtonGroup.Button id="second">
          Second item
        </RadioButtonGroup.Button>
      </RadioButtonGroup>,
    );
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toBeChecked();

    await selectCheckbox(user, radios[1]);
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
  });

  it("should support disabling the group", async () => {
    const { user } = render(
      <RadioButtonGroup defaultSelectedKeys={["first"]} isDisabled>
        <RadioButtonGroup.Button id="first">First item</RadioButtonGroup.Button>
        <RadioButtonGroup.Button id="second">
          Second item
        </RadioButtonGroup.Button>
      </RadioButtonGroup>,
    );
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toBeChecked();

    await selectCheckbox(user, radios[1]);
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
  });

  it("should support disabling individual buttons", async () => {
    const { user } = render(
      <RadioButtonGroup defaultSelectedKeys={["first"]} isDisabled>
        <RadioButtonGroup.Button id="first">First item</RadioButtonGroup.Button>
        <RadioButtonGroup.Button id="second" isDisabled>
          Second item
        </RadioButtonGroup.Button>
      </RadioButtonGroup>,
    );
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toBeChecked();

    await selectCheckbox(user, radios[1]);
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
  });

  it("should support controlled use", async () => {
    const handleChange = vi.fn();
    const { user, rerender } = render(
      <RadioButtonGroup
        selectedKeys={["second"]}
        onSelectionChange={handleChange}
      >
        <RadioButtonGroup.Button id="first">First item</RadioButtonGroup.Button>
        <RadioButtonGroup.Button id="second">
          Second item
        </RadioButtonGroup.Button>
      </RadioButtonGroup>,
    );

    const radios = screen.getAllByRole("radio");
    await selectCheckbox(user, radios[0]);
    expect(handleChange).toBeCalled();
    expect(screen.getAllByRole("radio")[0]).not.toBeChecked();

    rerender(
      <RadioButtonGroup selectedKeys={["second"]}>
        <RadioButtonGroup.Button id="first">First item</RadioButtonGroup.Button>
        <RadioButtonGroup.Button id="second">
          Second item
        </RadioButtonGroup.Button>
      </RadioButtonGroup>,
    );

    expect(screen.getAllByRole("radio")[1]).toBeChecked();
  });
});
