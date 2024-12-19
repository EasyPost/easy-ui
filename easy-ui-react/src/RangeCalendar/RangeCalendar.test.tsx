import React from "react";
import { vi } from "vitest";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { screen } from "@testing-library/react";
import { CalendarDate } from "@internationalized/date";
import { DateValue } from "@react-types/calendar";
import { render, userClick } from "../utilities/test";
import { RangeCalendar } from "./RangeCalendar";

const defaultValue = {
  start: new CalendarDate(2024, 7, 4),
  end: new CalendarDate(2024, 7, 10),
};

describe("<RangeCalendar />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render range calendar", () => {
    render(<RangeCalendar />);
    expect(screen.getByText("13")).toBeInTheDocument();
  });

  it("should have default selected values", () => {
    render(<RangeCalendar defaultValue={defaultValue} />);
    expect(
      screen.getByRole("heading", { name: /July 2024/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("gridcell", { selected: true })).toHaveLength(7);
  });

  it("should have minimum and maximun date that a user may select", () => {
    render(
      <RangeCalendar
        minValue={new CalendarDate(2024, 7, 4)}
        maxValue={new CalendarDate(2024, 7, 4).add({ days: 10 })}
      />,
    );
    expect(
      screen.getByRole("button", { name: /Thursday, July 25, 2024/i }),
    ).toHaveAttribute("aria-disabled");
    expect(
      screen.getByRole("button", { name: /Friday, July 5, 2024/i }),
    ).not.toHaveAttribute("aria-disabled");
  });

  it("should render past date unavailable", () => {
    const setDateUnavailable = (date: DateValue) =>
      new CalendarDate(2024, 7, 4).compare(date) > 0;
    render(
      <RangeCalendar
        isDateUnavailable={setDateUnavailable}
        defaultValue={defaultValue}
        showDaysOutsideCurrentMonth
      />,
    );
    expect(
      screen.getByRole("heading", { name: /July 2024/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sunday, June 30, 2024/i }),
    ).toHaveAttribute("aria-disabled");
    expect(
      screen.getByRole("button", { name: /Friday, July 5, 2024/i }),
    ).not.toHaveAttribute("aria-disabled");
  });

  it("should be disabled", () => {
    render(<RangeCalendar isDisabled />);
    expect(screen.getByRole("grid")).toHaveAttribute("aria-disabled");
  });

  it("should be read-only", () => {
    render(<RangeCalendar isReadOnly />);
    expect(screen.getByRole("grid")).toHaveAttribute("aria-readonly");
  });

  it("should navigate to next and previous month", async () => {
    const { user } = render(<RangeCalendar defaultValue={defaultValue} />);
    expect(
      screen.getByRole("heading", { name: "July 2024" }),
    ).toBeInTheDocument();
    await clickElement(user, screen.getByRole("button", { name: "Next" }));
    expect(
      screen.getByRole("heading", { name: "August 2024" }),
    ).toBeInTheDocument();
    await clickElement(user, screen.getByRole("button", { name: "Previous" }));
    expect(
      screen.getByRole("heading", { name: "July 2024" }),
    ).toBeInTheDocument();
  });

  it("should show error message when date is invalid", async () => {
    render(<RangeCalendar isInvalid errorMessage="This date is invalid" />);
    expect(screen.getByText("This date is invalid")).toBeInTheDocument();
  });

  it("should show dates outside current month", async () => {
    render(
      <RangeCalendar showDaysOutsideCurrentMonth defaultValue={defaultValue} />,
    );
    expect(
      screen.getByRole("button", { name: "Sunday, June 30, 2024" }),
    ).toBeInTheDocument();
  });
});

export async function clickElement(user: UserEvent, el: HTMLElement) {
  await userClick(user, el);
}
