import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { today, getLocalTimeZone, startOfYear } from "@internationalized/date";
import { DateRange } from "@react-types/calendar";
import { InputDecorator } from "../utilities/storybook";
import { DateRangePicker, DateRangePickerProps } from "./DateRangePicker";

type Story = StoryObj<typeof DateRangePicker>;

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/DatePicker/DateRangePicker",
  component: DateRangePicker,
  decorators: [InputDecorator],
};

export default meta;

const Template = (args: DateRangePickerProps) => <DateRangePicker {...args} />;

const QUICK_SELECTION_OPTIONS = [
  {
    label: "Today",
    dateRange: {
      start: today(getLocalTimeZone()),
      end: today(getLocalTimeZone()),
    },
  },
  {
    label: "Yesterday",
    dateRange: {
      start: today(getLocalTimeZone()).subtract({ days: 1 }),
      end: today(getLocalTimeZone()).subtract({ days: 1 }),
    },
  },
  {
    label: "Last 7 days",
    dateRange: {
      start: today(getLocalTimeZone()).subtract({ days: 6 }),
      end: today(getLocalTimeZone()),
    },
  },
  {
    label: "Last 30 days",
    dateRange: {
      start: today(getLocalTimeZone()).subtract({ days: 29 }),
      end: today(getLocalTimeZone()),
    },
  },
  {
    label: "Last 6 months",
    dateRange: {
      start: today(getLocalTimeZone()).subtract({ months: 6 }),
      end: today(getLocalTimeZone()),
    },
  },
  {
    label: "Last 12 months",
    dateRange: {
      start: today(getLocalTimeZone()).subtract({ months: 12 }),
      end: today(getLocalTimeZone()),
    },
  },
  {
    label: "Year to date",
    dateRange: {
      start: startOfYear(today(getLocalTimeZone())),
      end: today(getLocalTimeZone()),
    },
  },
];

export const Standard: Story = {
  render: Template.bind({}),
};

export const Sizes: Story = {
  render: Template.bind({}),
  args: {
    size: "sm",
  },
};

export const LimitAvailableDates: Story = {
  render: Template.bind({}),
  args: {
    minValue: today(getLocalTimeZone()).subtract({ days: 10 }),
    maxValue: today(getLocalTimeZone()),
  },
};

export const DatesAvailability: Story = {
  render: Template.bind({}),
  args: {
    isDateUnavailable: (date) => today(getLocalTimeZone()).compare(date) > 0,
  },
};

export const ControlledSelection: Story = {
  render: () => {
    const [date, setDate] = React.useState<DateRange>();
    return <DateRangePicker value={date} onChange={setDate} />;
  },
};

export const WithQuickSelection: Story = {
  render: () => {
    const [date, setDate] = React.useState<DateRange>();
    return (
      <DateRangePicker
        value={date}
        onChange={setDate}
        quickSelectOptions={QUICK_SELECTION_OPTIONS}
      />
    );
  },
};

export const InvalidSelection: Story = {
  render: () => {
    const [date, setDate] = React.useState<DateRange>({
      start: today(getLocalTimeZone()).subtract({ days: 7 }),
      end: today(getLocalTimeZone()),
    });

    const isInvalid = date ? date.end.compare(date.start) >= 7 : false;

    return (
      <DateRangePicker
        value={date}
        onChange={setDate}
        isInvalid={isInvalid}
        errorMessage={isInvalid && "Limit to max 7 days selection"}
      />
    );
  },
};

export const Disabled: Story = {
  render: Template.bind({}),
  args: {
    isDisabled: true,
  },
};
