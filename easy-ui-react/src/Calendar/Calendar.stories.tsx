import React from "react";
import { useLocale } from "react-aria";
import { DateValue } from "@react-types/calendar";
import { Meta, StoryObj } from "@storybook/react";
import { InlineStoryDecorator } from "../utilities/storybook";
import {
  today,
  getLocalTimeZone,
  CalendarDate,
  isWeekend,
} from "@internationalized/date";

import { Calendar, CalendarProps } from "./Calendar";

type Story = StoryObj<typeof Calendar>;

const Template = (args: CalendarProps) => <Calendar {...args} />;

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  args: {
    isDisabled: false,
    isReadOnly: false,
    showDaysOutsideCurrentMonth: false,
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
      defaultValue={new CalendarDate(2024, 7, 25)}
      minValue={new CalendarDate(2024, 7, 24)}
      maxValue={new CalendarDate(2024, 8, 5)}
    />
  ),
};

export const DatesAvailability: Story = {
  render: () => (
    // Date before today is unavailable
    <Calendar
      showDaysOutsideCurrentMonth
      isDateUnavailable={(date: DateValue) =>
        today(getLocalTimeZone()).compare(date) > 0
      }
    />
  ),
};

export const showDaysOutsideCurrentMonth: Story = {
  render: Template.bind({}),
  args: {
    showDaysOutsideCurrentMonth: true,
  },
};

export const ControlledSelection: Story = {
  render: () => {
    const [date, setDate] = React.useState<DateValue>(
      today(getLocalTimeZone()),
    );
    const handleChange = (v: DateValue) => {
      setDate(v);
    };

    return <Calendar value={date} onChange={handleChange} />;
  },
};

export const InvalidSelection: Story = {
  render: () => {
    const [date, setDate] = React.useState<DateValue>(
      today(getLocalTimeZone()),
    );
    const { locale } = useLocale();
    const handleChange = (v: DateValue) => {
      setDate(v);
    };
    const isInvalid = isWeekend(date, locale);

    return (
      <Calendar
        value={date}
        onChange={handleChange}
        isInvalid={isInvalid}
        errorMessage={isInvalid && "Weekend is not available"}
      />
    );
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
