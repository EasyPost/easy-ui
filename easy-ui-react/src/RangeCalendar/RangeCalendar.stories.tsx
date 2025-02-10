import React from "react";
import { DateRange } from "@react-types/calendar";
import { Meta, StoryObj } from "@storybook/react";
import { InlineStoryDecorator } from "../utilities/storybook";
import { today, getLocalTimeZone } from "@internationalized/date";

import { RangeCalendar, RangeCalendarProps } from "./RangeCalendar";

type Story = StoryObj<typeof RangeCalendar>;

const Template = (args: RangeCalendarProps) => <RangeCalendar {...args} />;

const meta: Meta<typeof RangeCalendar> = {
  title: "Components/Calendar/RangeCalendar",
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
  component: RangeCalendar,
  decorators: [InlineStoryDecorator],
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
};

export const DefaultValue: Story = {
  render: Template.bind({}),
  args: {
    defaultValue: {
      start: today(getLocalTimeZone()).subtract({ days: 5 }),
      end: today(getLocalTimeZone()),
    },
  },
};

export const LimitAvailableDates: Story = {
  render: Template.bind({}),
  args: {
    defaultValue: {
      start: today(getLocalTimeZone()).subtract({ days: 5 }),
      end: today(getLocalTimeZone()),
    },
    minValue: today(getLocalTimeZone()).subtract({ days: 10 }),
    maxValue: today(getLocalTimeZone()),
  },
};

export const DatesAvailability: Story = {
  render: Template.bind({}),
  args: {
    showDaysOutsideCurrentMonth: true,
    isDateUnavailable: (date) => today(getLocalTimeZone()).compare(date) > 0,
  },
};

export const ShowDaysOutsideCurrentMonth: Story = {
  render: Template.bind({}),
  args: {
    showDaysOutsideCurrentMonth: true,
  },
};

export const ControlledSelection: Story = {
  render: () => {
    const [date, setDate] = React.useState<DateRange>({
      start: today(getLocalTimeZone()),
      end: today(getLocalTimeZone()).subtract({ days: 5 }),
    });

    return <RangeCalendar value={date} onChange={setDate} />;
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
      <RangeCalendar
        value={date}
        onChange={setDate}
        isInvalid={isInvalid}
        errorMessage={isInvalid && "Limit to max 7 days selection"}
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
