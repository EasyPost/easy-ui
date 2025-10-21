import { Meta, StoryObj } from "@storybook/react-vite";
import CalendarMonthIcon from "@easypost/easy-ui-icons/CalendarMonth";
import React from "react";
import { Key } from "react-aria";
import { InputDecorator } from "../utilities/storybook";
import { Select, SelectProps } from "./Select";

type Story = StoryObj<typeof Select>;

const Template = (args: SelectProps<object, Key>) => {
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
  args: {
    label: "Label",
    placeholder: "Placeholder text",
    helperText: "Helper text",
  },
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
    isLabelEmphasized: true,
  },
};

export const Error: Story = {
  render: Template.bind({}),
  args: {
    errorText: "Something went wrong",
    validationState: "invalid",
  },
};

export const VisuallyHiddenLabel: Story = {
  render: Template.bind({}),
  args: {
    label: null,
    "aria-label": "Label",
  },
};

export const WithSeparator: Story = {
  render: () => (
    <Select
      label="Label"
      placeholder="Placeholder text"
      helperText="Helper text"
    >
      <Select.Section aria-label="Primary options">
        <Select.Option key="Option 1">Option 1</Select.Option>
        <Select.Option key="Option 2">Option 2</Select.Option>
        <Select.Option key="Option 3">Option 3</Select.Option>
      </Select.Section>
      <Select.Section aria-label="Secondary options">
        <Select.Option key="Option 4">Option 4</Select.Option>
        <Select.Option key="Option 5">Option 5</Select.Option>
        <Select.Option key="Option 6">Option 6</Select.Option>
      </Select.Section>
    </Select>
  ),
};

export const ControlledSelection: Story = {
  render: () => {
    const [option, setOption] = React.useState<Key>("Option 1");
    return (
      <>
        <span>Selected option : {option}</span>
        <Select
          label="Label"
          placeholder="Placeholder text"
          helperText="Helper text"
          selectedKey={option}
          onSelectionChange={(selected) => setOption(selected)}
        >
          <Select.Option key="Option 1">Option 1</Select.Option>
          <Select.Option key="Option 2">Option 2</Select.Option>
          <Select.Option key="Option 3">Option 3</Select.Option>
        </Select>
      </>
    );
  },
};

export const DisabledOptions: Story = {
  render: Template.bind({}),
  args: {
    label: "Label",
    placeholder: "Placeholder text",
    helperText: "Helper text",
    disabledKeys: ["Option 1"],
  },
};

export const DisabledSelect: Story = {
  render: Template.bind({}),
  args: {
    label: "Label",
    placeholder: "Placeholder text",
    helperText: "Helper text",
    isDisabled: true,
  },
};
