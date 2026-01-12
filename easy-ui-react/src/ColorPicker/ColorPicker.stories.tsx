import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Button } from "../Button";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import { ColorPicker, useColorPickerState } from "./ColorPicker";

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
      <VerticalStack inlineAlign="start" gap="2">
        <SelectedColorText />
        <ColorPicker.Trigger>
          <Button>Pick a color</Button>
        </ColorPicker.Trigger>
      </VerticalStack>
    </ColorPicker>
  ),
  args: {
    defaultValue: "#00ff00",
  },
};

function SelectedColorText() {
  const { color } = useColorPickerState();
  return (
    <Text variant="subtitle1">
      Selected Color: {color ? color.toString("css") : "None"}
    </Text>
  );
}
