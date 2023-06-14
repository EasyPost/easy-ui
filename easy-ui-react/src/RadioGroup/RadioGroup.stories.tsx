import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { VerticalStack } from "../VerticalStack";
import { PlaceholderBox } from "../utilities/storybook";
import {
  RadioGroup,
  RadioGroupProps,
  RadioGroupItemProps,
  useRadioGroupContext,
} from "./RadioGroup";

type Story = StoryObj<typeof RadioGroup>;
type ItemStory = StoryObj<typeof RadioGroup.Item>;

const Template = (args: RadioGroupProps) => {
  return (
    <RadioGroup {...args}>
      <RadioGroup.Item value="first">First item</RadioGroup.Item>
      <RadioGroup.Item value="second">Second item</RadioGroup.Item>
      <RadioGroup.Item value="third">Third item</RadioGroup.Item>
    </RadioGroup>
  );
};

const ItemTemplate = (args: RadioGroupItemProps) => {
  return (
    <RadioGroup label="Select an option:">
      <RadioGroup.Item {...args} value="first" />
      <RadioGroup.Item value="second">Second item</RadioGroup.Item>
      <RadioGroup.Item value="third">Third item</RadioGroup.Item>
    </RadioGroup>
  );
};

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  args: {
    label: "Select an option:",
    name: "radio-name",
  },
  parameters: {
    controls: {
      exclude: ["children", "onChange"],
    },
  },
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
};

export const Value: Story = {
  render: Template.bind({}),
  args: {
    value: "first",
  },
};

export const DefaultValue: Story = {
  render: Template.bind({}),
  args: {
    defaultValue: "first",
  },
};

export const Disabled: Story = {
  render: Template.bind({}),
  args: {
    isDisabled: true,
  },
};

export const ReadOnly: Story = {
  render: Template.bind({}),
  args: {
    isReadOnly: true,
    defaultValue: "second",
  },
};

export const Standalone: Story = {
  render: Template.bind({}),
  args: {
    "aria-label": "Options",
    label: undefined,
  },
};

export const InvalidItem: ItemStory = {
  render: ItemTemplate.bind({}),
  args: {
    children: "First item",
    validationState: "invalid",
    errorText: "This field is required",
  },
  parameters: {
    controls: {
      include: ["validationState", "errorText"],
    },
  },
};

export const DisabledItem: ItemStory = {
  render: ItemTemplate.bind({}),
  args: {
    children: "First item",
    isDisabled: true,
  },
  parameters: {
    controls: {
      include: ["isDisabled"],
    },
  },
};

export const Multiline: ItemStory = {
  render: (args) => (
    <span
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 200,
      }}
    >
      <ItemTemplate {...args} />
    </span>
  ),
  args: {
    children:
      "Multi line option for mobile use. Note how the radio is at the top not centered",
  },
  parameters: {
    controls: {
      exclude: ["onChange"],
      include: ["children"],
    },
  },
};

export const Composition: Story = {
  render: (args) => (
    <div style={{ display: "flex" }}>
      <div style={{ display: "inline-flex" }}>
        <RadioGroup.Container {...args} defaultValue="first">
          <VerticalStack gap="1">
            <CustomRadioGroupItem value="first">
              First item
            </CustomRadioGroupItem>
            <CustomRadioGroupItem value="second">
              Second item
            </CustomRadioGroupItem>
            <CustomRadioGroupItem value="third">
              Third item
            </CustomRadioGroupItem>
          </VerticalStack>
        </RadioGroup.Container>
      </div>
    </div>
  ),
};

function CustomRadioGroupItem({ value, ...restProps }: RadioGroupItemProps) {
  const state = useRadioGroupContext();
  const isSelected = value === state.selectedValue;
  return (
    <VerticalStack inline gap="1">
      <RadioGroup.Item value={value} {...restProps} />
      {isSelected && (
        <div style={{ paddingLeft: 24 }}>
          <PlaceholderBox height={100} />
        </div>
      )}
    </VerticalStack>
  );
}
