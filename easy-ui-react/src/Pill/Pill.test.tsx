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
    render(<Pill label="foobar" />);
    expect(screen.getByText(/foobar/i)).toBeInTheDocument();
  });

  it("should render a pill with an icon", () => {
    render(<Pill label="foobar" icon={CheckCircleIcon} />);
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should render a pill with a button", () => {
    const handleDismissal = vi.fn();
    render(<Pill label="foobar" onDismiss={handleDismissal} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("supports calling onDismiss callback function", async () => {
    const handleDismissal = vi.fn();
    const { user } = render(
      <Pill label="foobar" onDismiss={handleDismissal} />,
    );
    await userClick(user, screen.getByRole("button"));
    expect(handleDismissal).toHaveBeenCalled();
  });
});
