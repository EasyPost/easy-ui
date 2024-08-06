import React from "react";
import { vi } from "vitest";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { screen, fireEvent } from "@testing-library/react";
import { CalendarDate } from "@internationalized/date";
import { DateValue } from "@react-types/calendar";
import { render, userClick } from "../utilities/test";
import { Calendar } from "./Calendar";

describe("<Calendar />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("should render calendar", () => {
    render(<Calendar />);
    expect(screen.getByText("13")).toBeInTheDocument();
  });

  it("should have default selected value", () => {
    render(<Calendar defaultValue={new CalendarDate(2024, 7, 4)} />);
    expect(
      screen.getByRole("heading", { name: "July 2024" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("gridcell", { selected: true })).toHaveTextContent(
      "4",
    );
  });

  it("should has minimum and maximun date that a user may select", () => {
    render(
      <Calendar
        minValue={new CalendarDate(2024, 7, 4)}
        maxValue={new CalendarDate(2024, 7, 4).add({ days: 10 })}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Thursday, July 25, 2024" }),
    ).toHaveAttribute("aria-disabled");
    expect(
      screen.getByRole("button", { name: "Friday, July 5, 2024" }),
    ).not.toHaveAttribute("aria-disabled");
  });

  it("should render past date unavailable", () => {
    const setDateUnavailable = (date: DateValue) =>
      new CalendarDate(2024, 7, 4).compare(date) > 0;
    render(
      <Calendar
        isDateUnavailable={setDateUnavailable}
        defaultValue={new CalendarDate(2024, 7, 4)}
        showOutsideDays
      />,
    );
    expect(
      screen.getByRole("heading", { name: "July 2024" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sunday, June 30, 2024" }),
    ).toHaveAttribute("aria-disabled");
    expect(
      screen.getByRole("button", { name: "Friday, July 5, 2024" }),
    ).not.toHaveAttribute("aria-disabled");
  });

  it("should be disabled", () => {
    render(<Calendar isDisabled />);
    expect(screen.getByRole("grid")).toHaveAttribute("aria-disabled");
  });

  it("should be read-only", () => {
    render(<Calendar isReadOnly />);
    expect(screen.getByRole("grid")).toHaveAttribute("aria-readonly");
  });

  it("should navigate to next and previous month", () => {
    render(<Calendar defaultValue={new CalendarDate(2024, 7, 4)} />);
    expect(
      screen.getByRole("heading", { name: "July 2024" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(
      screen.getByRole("heading", { name: "August 2024" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(
      screen.getByRole("heading", { name: "July 2024" }),
    ).toBeInTheDocument();
  });

  it("should select the tenth day of each month", async () => {
    const handleChange = vi.fn();
    const { user } = render(<Calendar onChange={handleChange} />);
    await clickElement(
      user,
      screen.getByRole("button", { name: "Saturday, August 10, 2024" }),
    );
    expect(handleChange).toHaveBeenCalled();
  });

  it("should show error message when date is invalid", async () => {
    render(<Calendar isInvalid errorMessage="This date is invalid" />);
    expect(screen.getByText("This date is invalid")).toBeInTheDocument();
  });

  it("should show dates outside current month", async () => {
    render(
      <Calendar showOutsideDays defaultValue={new CalendarDate(2024, 7, 4)} />,
    );
    expect(
      screen.getByRole("button", { name: "Sunday, June 30, 2024" }),
    ).toBeInTheDocument();
  });
});

async function clickElement(user: UserEvent, el: HTMLElement) {
  await userClick(user, el);
}
