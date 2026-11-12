import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { render, selectCheckbox } from "../utilities/test";
import { Text } from "../Text";
import { SplitToggleCard } from "./SplitToggleCard";

describe("<SplitToggleCard />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("should render a toggle with related content", () => {
    render(
      <SplitToggleCard aria-label="Split Toggle">
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    expect(screen.getByRole("switch")).toBeInTheDocument();
    expect(screen.getByRole("switch")).not.toBeChecked();
    expect(screen.getByText(/toggle label/i)).toBeInTheDocument();
  });

  it("should support uncontrolled", async () => {
    const { user } = render(
      <SplitToggleCard defaultSelected={true} aria-label="Split Toggle">
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    expect(screen.getByRole("switch")).toBeChecked();
    await selectCheckbox(user, screen.getByRole("switch"));
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("should support controlled", async () => {
    const handleChange = vi.fn();
    const { user, rerender } = render(
      <SplitToggleCard
        isSelected={false}
        onChange={handleChange}
        aria-label="Split Toggle"
      >
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    await selectCheckbox(user, screen.getByRole("switch"));
    expect(handleChange).toBeCalled();
    expect(screen.getByRole("switch")).not.toBeChecked();
    rerender(
      <SplitToggleCard
        isSelected={true}
        onChange={handleChange}
        aria-label="Split Toggle"
      >
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("should support isDisabled", () => {
    render(
      <SplitToggleCard isDisabled aria-label="Split Toggle">
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("should support isReadOnly", async () => {
    render(
      <SplitToggleCard isReadOnly aria-label="Split Toggle">
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    expect(screen.getByRole("switch")).not.toBeChecked();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-readonly", "true");
  });

  it("should show the status label for the current state", async () => {
    const { user } = render(
      <SplitToggleCard
        aria-label="Split Toggle"
        statusLabels={{ on: "Enrolled", off: "Not enrolled" }}
      >
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    const on = screen.getByText("Enrolled").parentElement;
    const off = screen.getByText("Not enrolled").parentElement;
    expect(on?.className).toMatch(/hidden/);
    expect(off?.className).not.toMatch(/hidden/);
    await selectCheckbox(user, screen.getByRole("switch"));
    expect(on?.className).not.toMatch(/hidden/);
    expect(off?.className).toMatch(/hidden/);
  });

  it("should show the status label for a controlled state", () => {
    render(
      <SplitToggleCard
        aria-label="Split Toggle"
        isSelected
        statusLabels={{ on: "Enrolled", off: "Not enrolled" }}
      >
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    expect(screen.getByText("Enrolled").parentElement?.className).not.toMatch(
      /hidden/,
    );
    expect(screen.getByText("Not enrolled").parentElement?.className).toMatch(
      /hidden/,
    );
  });

  it("should name the switch from aria-labelledby, not the status labels", () => {
    render(
      <SplitToggleCard
        aria-labelledby="title"
        statusLabels={{ on: "Enrolled", off: "Not enrolled" }}
      >
        <Text id="title">Shipping Insurance</Text>
      </SplitToggleCard>,
    );
    expect(
      screen.getByRole("switch", { name: "Shipping Insurance" }),
    ).toBeInTheDocument();
  });

  it("should render outlined by default", () => {
    const { container } = render(
      <SplitToggleCard aria-label="Split Toggle">
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toMatch(/variantOutlined/);
  });

  it("should render the solid variant without a border", () => {
    const { container } = render(
      <SplitToggleCard aria-label="Split Toggle" cardVariant="solid">
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).not.toMatch(/variantOutlined/);
  });
});
