import { screen, within } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { render } from "../utilities/test";
import { Stepper } from "./Stepper";

describe("<Stepper />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a stepper", () => {
    render(getStepper({ stepperProps: { color: "primary" } }));
    expect(screen.getByTestId("root")).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toBe(4);
  });

  it("should render a stepper with appropriate orientation styles", () => {
    const { rerender } = render(
      getStepper({ stepperProps: { orientation: "vertical" } }),
    );
    expect(screen.getByTestId("root")).toHaveAttribute(
      "class",
      expect.stringContaining("VerticalStack"),
    );
    rerender(getStepper({ stepperProps: { orientation: "horizontal" } }));
    expect(screen.getByTestId("root")).toHaveAttribute(
      "class",
      expect.stringContaining("HorizontalStack"),
    );
  });

  it("should render steps with inverted color styles", () => {
    render(getStepper({ stepperProps: { color: "inverse" } }));
    expect(screen.getAllByRole("button")[0]).toHaveAttribute(
      "class",
      expect.stringContaining("colorInverse"),
    );
  });

  it("should render steps in appropriate states", () => {
    render(getStepper({}));
    expect(screen.getAllByRole("button")[1]).toHaveAttribute(
      "class",
      expect.stringContaining("statusComplete"),
    );
    expect(screen.getAllByRole("button")[2]).toHaveAttribute(
      "class",
      expect.stringContaining("statusActive"),
    );
  });

  it("should render completed steps with appropriate icon", () => {
    render(getStepper({}));
    const completedStep = screen.getAllByRole("button")[0];
    expect(
      within(completedStep).getByRole("img", { hidden: true }),
    ).toBeInTheDocument();
  });

  it("should render a disabled step", () => {
    render(getStepper({}));
    expect(screen.getAllByRole("button")[3]).toBeDisabled();
  });
});

function getStepper({ stepperProps = {} }) {
  return (
    <Stepper activeStepIndex={2} {...stepperProps}>
      <Stepper.Step stepIndex={0} isComplete isAccessible>
        Step 1
      </Stepper.Step>
      <Stepper.Step stepIndex={1} isComplete isAccessible>
        Step 2
      </Stepper.Step>
      <Stepper.Step stepIndex={2} isComplete={false} isAccessible>
        Step 3
      </Stepper.Step>
      <Stepper.Step stepIndex={3} isComplete={false} isAccessible={false}>
        Step 4
      </Stepper.Step>
    </Stepper>
  );
}
