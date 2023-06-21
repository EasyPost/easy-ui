import { Meta, StoryObj } from "@storybook/react";
import CalendarMonthIcon from "@easypost/easy-ui-icons/CalendarMonth";
import React from "react";
import { InputDecorator } from "../utilities/storybook";
import { Select, SelectProps } from "./Select";

type Story = StoryObj<typeof Select>;

const Template = (args: SelectProps<object>) => {
  return (
    <Select {...args}>
      <Select.Option key="Option 1">Option 1</Select.Option>
      <Select.Option key="Option 2">Option 2</Select.Option>
      <Select.Option key="Option 3">Option 3</Select.Option>
    </Select>
  );
};

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  decorators: [InputDecorator],
};

export default meta;

export const Standard: Story = {
  render: Template.bind({}),
  args: {
    label: "Label",
    placeholder: "Placeholder text",
    helperText: "Helper text",
  },
};

export const Icon: Story = {
  render: Template.bind({}),
  args: {
    label: "Label",
    placeholder: "Placeholder text",
    helperText: "Helper text",
    iconAtStart: CalendarMonthIcon,
  },
};

export const SmallSelect: Story = {
  render: () => (
    <>
      <Select
        label="Label"
        placeholder="Placeholder text"
        helperText="Helper text"
        size="sm"
      >
        <Select.Option key="Option 1">Option 1</Select.Option>
        <Select.Option key="Option 2">Option 2</Select.Option>
        <Select.Option key="Option 3">Option 3</Select.Option>
      </Select>
      <Select
        label="Label"
        placeholder="Placeholder text"
        helperText="Helper text"
        size="sm"
        iconAtStart={CalendarMonthIcon}
      >
        <Select.Option key="Option 1">Option 1</Select.Option>
        <Select.Option key="Option 2">Option 2</Select.Option>
        <Select.Option key="Option 3">Option 3</Select.Option>
      </Select>
    </>
  ),
};

export const LargeSelect: Story = {
  render: () => (
    <>
      <Select
        label="Label"
        placeholder="Placeholder text"
        helperText="Helper text"
        size="lg"
      >
        <Select.Option key="Option 1">Option 1</Select.Option>
        <Select.Option key="Option 2">Option 2</Select.Option>
        <Select.Option key="Option 3">Option 3</Select.Option>
      </Select>
      <Select
        label="Label"
        placeholder="Placeholder text"
        helperText="Helper text"
        size="lg"
        iconAtStart={CalendarMonthIcon}
      >
        <Select.Option key="Option 1">Option 1</Select.Option>
        <Select.Option key="Option 2">Option 2</Select.Option>
        <Select.Option key="Option 3">Option 3</Select.Option>
      </Select>
    </>
  ),
};

export const LabelWithEmphasis: Story = {
  render: Template.bind({}),
  args: {
    label: "Label",
    placeholder: "Placeholder text",
    helperText: "Helper text",
    isLabelEmphasized: true,
  },
};
