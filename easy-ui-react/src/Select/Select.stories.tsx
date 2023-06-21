import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CalendarMonthIcon from "@easypost/easy-ui-icons/CalendarMonth";
import { Select } from "./Select";

type Story = StoryObj<typeof Select>;

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
};

export default meta;

export const SimpleSelect: Story = {
  render: () => {
    return (
      <Select
        label="Label"
        helperText="Helper text"
        iconAtStart={CalendarMonthIcon}
        placeholder="Placeholder text"
      >
        <Select.Option key="copy">Copy</Select.Option>
        <Select.Option key="cut">Cut</Select.Option>
        <Select.Option key="paste">Paste</Select.Option>
      </Select>
    );
  },
};
