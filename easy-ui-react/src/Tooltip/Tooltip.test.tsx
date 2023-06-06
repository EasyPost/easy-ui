import { act, fireEvent, screen } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import React from "react";
import { vi } from "vitest";
import { render } from "../utilities/test";
import { Tooltip } from "./Tooltip";

describe("<Tooltip />", () => {
  const props = {
    content: "This is a tooltip",
    children: <button>Click me</button>,
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should show on hover", async () => {
    const { user } = render(<Tooltip {...props} />);
    await hoverOverTooltipTrigger(user, screen.getByRole("button"));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("should show on focus", async () => {
    const { user } = render(<Tooltip {...props} />);
    await tabToTooltipTrigger(user);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("should show immediately with isImmediate", async () => {
    const { user } = render(<Tooltip {...props} isImmediate={true} />);
    await hoverOverTooltipTrigger(user, screen.getByRole("button"), {
      runTimers: false,
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("should show with defaultOpen", async () => {
    render(<Tooltip {...props} defaultOpen={true} />);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("should be able to be controlled", async () => {
    const handleOpenChange = vi.fn();
    const { user, rerender } = render(
      <Tooltip {...props} isOpen={false} onOpenChange={handleOpenChange} />,
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await hoverOverTooltipTrigger(user, screen.getByRole("button"));
    expect(handleOpenChange).toHaveBeenCalledTimes(1);

    rerender(
      <Tooltip {...props} isOpen={true} onOpenChange={handleOpenChange} />,
    );
    expect(screen.queryByRole("tooltip")).toBeInTheDocument();
  });

  it("should be able to be disabled", async () => {
    const { user } = render(<Tooltip {...props} isDisabled={true} />);
    await hoverOverTooltipTrigger(user, screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("should apply custom placement", async () => {
    const { user } = render(<Tooltip {...props} placement="left" />);
    await hoverOverTooltipTrigger(user, screen.getByRole("button"));
    expect(screen.getByRole("tooltip")).toHaveAttribute(
      "data-placement",
      "left",
    );
  });

  it("should support keyboard-only trigger", async () => {
    const { user } = render(<Tooltip {...props} trigger="focus" />);

    await hoverOverTooltipTrigger(user, screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await tabToTooltipTrigger(user);
    expect(screen.queryByRole("tooltip")).toBeInTheDocument();
  });
});

// Helpers for interacting with tooltip trigger
//
// TODO: Look into why hover() and tab() has to be wrapped in act() since this
//       shouldn't be necessary. Perhaps something being done in Aria

export async function hoverOverTooltipTrigger(
  user: UserEvent,
  el: HTMLElement,
  { runTimers = true } = {},
) {
  fireEvent.mouseMove(document.body);
  await act(async () => {
    await user.hover(el);
    if (runTimers) {
      vi.runAllTimers();
    }
  });
}

async function tabToTooltipTrigger(user: UserEvent, { runTimers = true } = {}) {
  await act(async () => {
    await user.tab();
    if (runTimers) {
      vi.runAllTimers();
    }
  });
}
