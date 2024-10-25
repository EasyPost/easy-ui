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
      <SplitToggleCard>
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    expect(screen.getByRole("switch")).toBeInTheDocument();
    expect(screen.getByRole("switch")).not.toBeChecked();
    expect(screen.getByText(/toggle label/i)).toBeInTheDocument();
  });

  it("should support uncontrolled", async () => {
    const { user } = render(
      <SplitToggleCard defaultSelected={true}>
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
      <SplitToggleCard isSelected={false} onChange={handleChange}>
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    await selectCheckbox(user, screen.getByRole("switch"));
    expect(handleChange).toBeCalled();
    expect(screen.getByRole("switch")).not.toBeChecked();
    rerender(
      <SplitToggleCard isSelected={true} onChange={handleChange}>
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("should support isDisabled", () => {
    render(
      <SplitToggleCard isDisabled>
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("should support isReadOnly", async () => {
    render(
      <SplitToggleCard isReadOnly>
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    expect(screen.getByRole("switch")).not.toBeChecked();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-readonly", "true");
  });
});
