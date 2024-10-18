import React from "react";
import { screen } from "@testing-library/react";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import { Pill } from "./Pill";
import { render, userClick } from "../utilities/test";

describe("<Pill />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a pill", () => {
    render(<Pill>foobar</Pill>);
    expect(screen.getByText(/foobar/i)).toBeInTheDocument();
  });

  it("supports rendering a pill with an icon", () => {
    render(<Pill icon={CheckCircleIcon}>foobar</Pill>);
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("supports onDismiss", async () => {
    const handleDismissal = vi.fn();
    const { user } = render(<Pill onDismiss={handleDismissal}>foobar</Pill>);
    await userClick(user, screen.getByRole("button"));
    expect(handleDismissal).toHaveBeenCalled();
  });
});
