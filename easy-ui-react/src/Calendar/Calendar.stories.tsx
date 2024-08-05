import React from "react";
import { DateValue } from "@react-types/calendar";
import { Meta, StoryObj } from "@storybook/react";
import { InlineStoryDecorator } from "../utilities/storybook";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";

import { Calendar, CalendarProps } from "./Calendar";

type Story = StoryObj<typeof Calendar>;

const Template = (args: CalendarProps) => <Calendar {...args} />;

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  args: {
    isDisabled: false,
    isReadOnly: false,
  },
  parameters: {
    controls: {
      exclude: [
        "onChange",
        "isDateUnavailable",
        "value",
        "defaultValue",
        "minValue",
        "maxValue",
      ],
    },
  },
  component: Calendar,
  decorators: [InlineStoryDecorator],
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
};

export const DefaultValue: Story = {
  render: () => <Calendar defaultValue={new CalendarDate(2024, 7, 4)} />,
};

export const LimitAvailableDates: Story = {
  render: () => (
    <Calendar
      minValue={today(getLocalTimeZone())}
      maxValue={today(getLocalTimeZone()).add({ days: 10 })}
    />
  ),
};

export const DatesAvailability: Story = {
  render: () => (
    // Date before today is unavailable
    <Calendar
      isDateUnavailable={(date: DateValue) =>
        today(getLocalTimeZone()).compare(date) > 0
      }
    />
  ),
};

export const ControlledSelection: Story = {
  render: () => {
    const [date, setDate] = React.useState<DateValue | null>(null);
    const handleChange = (v: DateValue) => {
      setDate(v);
    };

    return <Calendar value={date} onChange={handleChange} />;
  },
};

export const DisabledCalendar: Story = {
  render: Template.bind({}),
  args: {
    isDisabled: true,
  },
};

export const ReadonlyCalendar: Story = {
  render: Template.bind({}),
  args: {
    isReadOnly: true,
  },
};
