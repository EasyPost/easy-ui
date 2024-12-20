import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { DateRange } from "@react-types/calendar";
import { InputDecorator } from "../utilities/storybook";
import { DateRangePicker, DateRangePickerProps } from "./DateRangePicker";

type Story = StoryObj<typeof DateRangePicker>;

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/DatePicker/DateRangePicker",
  component: DateRangePicker,
  args: { "aria-label": "Range date picker" },
  decorators: [InputDecorator],
};

export default meta;

const Template = (args: DateRangePickerProps) => <DateRangePicker {...args} />;

export const Standalone: Story = {
  render: Template.bind({}),
};

export const DefaultValue: Story = {
  render: Template.bind({}),
  args: {
    defaultValue: {
      start: today(getLocalTimeZone()).subtract({ days: 7 }),
      end: today(getLocalTimeZone()),
    },
  },
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
    return (
      <DateRangePicker
        value={date}
        onChange={setDate}
        aria-label="Range date picker"
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
        aria-label="Range date picker"
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
