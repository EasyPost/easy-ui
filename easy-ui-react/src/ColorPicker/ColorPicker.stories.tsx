import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { ColorPicker, ColorPickerTrigger } from "./ColorPicker";
import { VerticalStack } from "../VerticalStack";
import { Button } from "../Button";
import { Text } from "../Text";

type Story = StoryObj<typeof ColorPicker>;

const meta: Meta<typeof ColorPicker> = {
  title: "Components/ColorPicker/ColorPicker",
  component: ColorPicker,
  args: {},
  parameters: {
    controls: {
      exclude: ["children"],
    },
  },
};

export default meta;

export const Default: Story = {
  render: (args) => (
    <ColorPicker {...args}>
      {({ color }) => (
        <VerticalStack inlineAlign="start" gap="2">
          <Text variant="subtitle1">
            Selected Color: {color ? color.toString("css") : "None"}
          </Text>
          <ColorPickerTrigger>
            <Button>Pick a color</Button>
          </ColorPickerTrigger>
        </VerticalStack>
      )}
    </ColorPicker>
  ),
  args: {
    defaultValue: "#00ff00",
  },
};
