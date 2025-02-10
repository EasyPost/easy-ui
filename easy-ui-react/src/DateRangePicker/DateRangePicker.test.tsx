import React from "react";
import { vi } from "vitest";
import { screen } from "@testing-library/react";
import {
  CalendarDate,
  startOfMonth,
  today,
  getLocalTimeZone,
} from "@internationalized/date";
import { DateValue } from "@react-types/calendar";
import { render } from "../utilities/test";
import { DateRangePicker } from "./DateRangePicker";
import { clickElement } from "../RangeCalendar/RangeCalendar.test";

const month = 7;
const year = 2024;
const defaultValue = {
  start: new CalendarDate(year, month, 4),
  end: new CalendarDate(year, month, 10),
};

describe("<DateRangePicker />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a date range picker", () => {
    render(<DateRangePicker aria-label="Date range picker" />);
    expect(
      screen.getByRole("button", { name: /calendar/i }),
    ).toBeInTheDocument();
  });

  it("should open up a popover with calendar", async () => {
    const { user } = render(<DateRangePicker aria-label="Date range picker" />);
    await clickElement(user, screen.getByRole("button", { name: /calendar/i }));
    const dateObject = startOfMonth(today(getLocalTimeZone())).toDate(
      getLocalTimeZone(),
    );
    const name = dateObject.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    expect(screen.getByRole("heading", { name })).toBeInTheDocument();
  });

  it("should have default selected value", async () => {
    const { user } = render(
      <DateRangePicker
        aria-label="Date range picker"
        defaultValue={defaultValue}
      />,
    );
    // Dates display on the DateField
    expect(
      screen.getByRole("spinbutton", { name: /month, start date/i }),
    ).toHaveValue(month);
    expect(
      screen.getByRole("spinbutton", { name: /day, start date/i }),
    ).toHaveValue(4);
    expect(
      screen.getByRole("spinbutton", { name: /year, start date/i }),
    ).toHaveValue(year);
    expect(
      screen.getByRole("spinbutton", { name: /month, end date/i }),
    ).toHaveValue(month);
    expect(
      screen.getByRole("spinbutton", { name: /day, end date/i }),
    ).toHaveValue(10);
    expect(
      screen.getByRole("spinbutton", { name: /year, end date/i }),
    ).toHaveValue(year);
    // Open popover
    await clickElement(user, screen.getByRole("button", { name: /calendar/i }));
    // Dates selected in Calendar
    expect(screen.getAllByRole("gridcell", { selected: true })).toHaveLength(7);
  });

  it("should have minimum and maximun date that a user may select", async () => {
    const { user } = render(
      <DateRangePicker
        aria-label="Date range picker"
        minValue={defaultValue.start}
        maxValue={defaultValue.start.add({ days: 10 })}
      />,
    );
    await clickElement(user, screen.getByRole("button", { name: /calendar/i }));
    expect(
      screen.getByRole("button", { name: /Thursday, July 25, 2024/i }),
    ).toHaveAttribute("aria-disabled");
    expect(
      screen.getByRole("button", { name: /Friday, July 5, 2024/i }),
    ).not.toHaveAttribute("aria-disabled");
  });

  it("should render past date unavailable", async () => {
    const setDateUnavailable = (date: DateValue) =>
      defaultValue.start.compare(date) > 0;
    const { user } = render(
      <DateRangePicker
        aria-label="Date range picker"
        isDateUnavailable={setDateUnavailable}
        defaultValue={defaultValue}
      />,
    );
    await clickElement(user, screen.getByRole("button", { name: /calendar/i }));
    expect(
      screen.getByRole("heading", { name: /July 2024/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Wednesday, July 3, 2024/i }),
    ).toHaveAttribute("aria-disabled");
    expect(
      screen.getByRole("button", { name: /Friday, July 5, 2024/i }),
    ).not.toHaveAttribute("aria-disabled");
  });

  it("should be disabled", () => {
    render(<DateRangePicker aria-label="Date range picker" isDisabled />);
    expect(screen.getByRole("group")).toHaveAttribute("aria-disabled");
    const dateFields = screen.getAllByRole("spinbutton");
    dateFields.every((field) => expect(field).toHaveAttribute("aria-disabled"));
  });

  it("should show error message when date is invalid", async () => {
    render(
      <DateRangePicker
        aria-label="Date range picker"
        isInvalid
        errorMessage="This date is invalid"
      />,
    );
    expect(screen.getByText("This date is invalid")).toBeInTheDocument();
  });
});
