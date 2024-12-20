import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { useLocale } from "react-aria";
import {
  today,
  getLocalTimeZone,
  isWeekend,
  endOfWeek,
} from "@internationalized/date";
import { DateValue, MappedDateValue } from "@react-types/calendar";
import { InputDecorator } from "../utilities/storybook";
import { DatePicker, DatePickerProps } from "./DatePicker";

type Story = StoryObj<typeof DatePicker>;

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker/DatePicker",
  args: { "aria-label": "Date picker" },
  component: DatePicker,
  decorators: [InputDecorator],
};

export default meta;

const Template = (args: DatePickerProps) => <DatePicker {...args} />;

export const Standalone: Story = {
  render: Template.bind({}),
};

export const DefaultValue: Story = {
  render: Template.bind({}),
  args: {
    defaultValue: today(getLocalTimeZone()),
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
    const [date, setDate] = React.useState<MappedDateValue<DateValue> | null>(
      null,
    );
    return (
      <DatePicker value={date} onChange={setDate} aria-label="Date picker" />
    );
  },
};

export const InvalidSelection: Story = {
  render: () => {
    const { locale } = useLocale();
    const [date, setDate] = React.useState<MappedDateValue<DateValue> | null>(
      endOfWeek(today(getLocalTimeZone()), locale),
    );

    const isInvalid = date ? isWeekend(date, locale) : false;

    return (
      <DatePicker
        aria-label="Date picker"
        value={date}
        onChange={setDate}
        isInvalid={isInvalid}
        errorMessage={isInvalid && "Weekend is not available"}
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
