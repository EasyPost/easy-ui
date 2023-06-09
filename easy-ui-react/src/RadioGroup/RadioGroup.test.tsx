import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { selectCheckbox } from "../Checkbox/Checkbox.test";
import { hoverOverTooltipTrigger } from "../Tooltip/Tooltip.test";
import { render } from "../utilities/test";
import { RadioGroup } from "./RadioGroup";

describe("<RadioGroup />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a radio group", () => {
    render(
      <RadioGroup label="Options" name="radio-group">
        <RadioGroup.Item value="first">First item</RadioGroup.Item>
        <RadioGroup.Item value="second">Second item</RadioGroup.Item>
      </RadioGroup>,
    );
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getAllByRole("radio").length).toBe(2);
    expect(screen.getAllByRole("radio")[0]).toHaveAttribute(
      "name",
      "radio-group",
    );
  });

  it("should support uncontrolled", async () => {
    const { user } = render(
      <RadioGroup label="Options" defaultValue="first">
        <RadioGroup.Item value="first">First item</RadioGroup.Item>
        <RadioGroup.Item value="second">Second item</RadioGroup.Item>
      </RadioGroup>,
    );
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toBeChecked();

    await selectCheckbox(user, radios[1]);
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
  });

  it("should support controlled", async () => {
    const handleChange = vi.fn();
    const { user, rerender } = render(
      <RadioGroup label="Options" value="" onChange={handleChange}>
        <RadioGroup.Item value="first">First item</RadioGroup.Item>
        <RadioGroup.Item value="second">Second item</RadioGroup.Item>
      </RadioGroup>,
    );

    const radios = screen.getAllByRole("radio");
    await selectCheckbox(user, radios[0]);
    expect(handleChange).toBeCalled();
    expect(radios[0]).not.toBeChecked();

    rerender(
      <RadioGroup label="Options" value="second">
        <RadioGroup.Item value="first">First item</RadioGroup.Item>
        <RadioGroup.Item value="second">Second item</RadioGroup.Item>
      </RadioGroup>,
    );

    expect(screen.getAllByRole("radio")[1]).toBeChecked();
  });

  it("should support isDisabled group", () => {
    render(
      <RadioGroup label="Options" isDisabled>
        <RadioGroup.Item value="first">First item</RadioGroup.Item>
        <RadioGroup.Item value="second">Second item</RadioGroup.Item>
      </RadioGroup>,
    );
    expect(screen.getAllByRole("radio")[0]).toBeDisabled();
  });

  it("should support isDisabled item", () => {
    render(
      <RadioGroup label="Options">
        <RadioGroup.Item value="first">First item</RadioGroup.Item>
        <RadioGroup.Item value="second" isDisabled>
          Second item
        </RadioGroup.Item>
      </RadioGroup>,
    );
    expect(screen.getAllByRole("radio")[1]).toBeDisabled();
  });

  it("should support isReadOnly", async () => {
    const { user } = render(
      <RadioGroup label="Options" isReadOnly>
        <RadioGroup.Item value="first">First item</RadioGroup.Item>
        <RadioGroup.Item value="second">Second item</RadioGroup.Item>
      </RadioGroup>,
    );
    await selectCheckbox(user, screen.getAllByRole("radio")[0]);
    expect(screen.getAllByRole("radio")[0]).not.toBeChecked();
  });

  it("should support errors", async () => {
    const { user } = render(
      <RadioGroup label="Options">
        <RadioGroup.Item
          value="first"
          validationState="invalid"
          errorText="This field is required"
        >
          First item
        </RadioGroup.Item>
        <RadioGroup.Item value="second">Second item</RadioGroup.Item>
      </RadioGroup>,
    );
    await hoverOverTooltipTrigger(user, screen.getByLabelText("Error"));
    expect(screen.getAllByRole("radio")[0]).toBeInvalid();
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });
});
