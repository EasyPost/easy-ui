import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { ColorPickerField, ColorPickerFieldProps } from "./ColorPickerField";

type Story = StoryObj<typeof ColorPickerField>;

const Template = (props: ColorPickerFieldProps) => {
  return <ColorPickerField {...props} />;
};

const meta: Meta<typeof ColorPickerField> = {
  title: "Components/ColorPickerField",
  component: ColorPickerField,
  args: {},
  parameters: {
    controls: {
      exclude: ["children"],
    },
  },
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
  args: {
    defaultValue: "#ff0000",
  },
};
