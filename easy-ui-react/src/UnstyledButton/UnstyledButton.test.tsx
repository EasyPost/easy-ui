import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { Icon } from "../Icon";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import { UnstyledButton } from "./UnstyledButton";

describe("<UnstyledButton />", () => {
  it("should render an unstyled button", () => {
    render(<UnstyledButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should render an unstyled button with text", () => {
    render(<UnstyledButton>Testing</UnstyledButton>);
    expect(screen.getByText(/testing/i)).toBeInTheDocument();
  });

  it("should render an anchor tag", () => {
    render(
      <UnstyledButton href="https://www.easypost.com/">Testing</UnstyledButton>,
    );
    expect(screen.getByText(/testing/i).closest("a")).toHaveAttribute(
      "href",
      "https://www.easypost.com/",
    );
  });

  it("should render an unstyled button with an icon", () => {
    render(
      <UnstyledButton>
        <Icon symbol={CheckCircleIcon} />
      </UnstyledButton>,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should apply the supplied class", () => {
    render(
      <UnstyledButton className="colorPrimary_123">Button</UnstyledButton>,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("colorPrimary"),
    );
  });

  it("should render a disabled button", () => {
    render(<UnstyledButton isDisabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should render a disabled anchor tag without an href", () => {
    render(
      <UnstyledButton href="https://www.easypost.com/" isDisabled>
        Testing
      </UnstyledButton>,
    );
    expect(screen.getByText(/testing/i).closest("a")).not.toHaveAttribute(
      "href",
    );
  });

  it("should call onClick once per click", async () => {
    const handleClick = vi.fn();
    render(<UnstyledButton onClick={handleClick}>Testing</UnstyledButton>);
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should call onClick once per click on an anchor tag", async () => {
    const handleClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(
      <UnstyledButton href="/somewhere" onClick={handleClick}>
        Testing
      </UnstyledButton>,
    );
    await userEvent.click(screen.getByText(/testing/i));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // `onClick` reaches a button and an anchor by different routes, so each
  // element type needs its own keyboard coverage
  describe.each([
    ["a button", undefined],
    ["an anchor tag", "/somewhere"],
  ])("on %s", (_, href) => {
    it.each(["{Enter}", " "])(
      "should call onClick once per %s press",
      async (key) => {
        const handleClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
        render(
          <UnstyledButton href={href} onClick={handleClick}>
            Testing
          </UnstyledButton>,
        );
        await userEvent.tab();
        await userEvent.keyboard(key);
        expect(handleClick).toHaveBeenCalledTimes(1);
      },
    );
  });

  // a call count alone can't tell a handler that ran against the real click
  // apart from one that ran against an event React Aria synthesized, so this
  // asserts what `preventDefault()` was supposed to accomplish
  describe.each(["submit", "reset"] as const)("on a %s button", (type) => {
    it.each(["{Enter}", " "])(
      "should let onClick prevent the default on %s",
      async (key) => {
        const handleDefault = vi.fn((e: React.FormEvent) => e.preventDefault());
        const handleClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
        render(
          <form onSubmit={handleDefault} onReset={handleDefault}>
            <UnstyledButton type={type} onClick={handleClick}>
              Testing
            </UnstyledButton>
          </form>,
        );
        await userEvent.tab();
        await userEvent.keyboard(key);
        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleDefault).not.toHaveBeenCalled();
      },
    );
  });

  it("should apply the default class", () => {
    render(
      <UnstyledButton className="colorPrimary_123">Button</UnstyledButton>,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("UnstyledButton"),
    );
  });
});
