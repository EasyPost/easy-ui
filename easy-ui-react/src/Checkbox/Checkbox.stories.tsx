import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { VerticalStack } from "../VerticalStack";
import { Checkbox, CheckboxProps } from "./Checkbox";

type Story = StoryObj<typeof Checkbox>;

const Template = (args: CheckboxProps) => <Checkbox {...args} />;

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    children: "Checkbox item",
    isDisabled: false,
    isReadOnly: false,
    isIndeterminate: false,
    isNested: false,
    size: "md",
    validationState: "valid",
  },
  argTypes: {
    children: {
      control: "text",
    },
    errorText: {
      control: "text",
    },
  },
  parameters: {
    controls: {
      exclude: ["onChange"],
    },
  },
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
};

export const Selected: Story = {
  render: Template.bind({}),
  args: {
    isSelected: true,
  },
};

export const Disabled: Story = {
  render: Template.bind({}),
  args: {
    isDisabled: true,
  },
};

export const Indeterminate: Story = {
  render: Template.bind({}),
  args: {
    isIndeterminate: true,
  },
};

export const Error: Story = {
  render: Template.bind({}),
  args: {
    children: "Error item",
    validationState: "invalid",
    errorText: "This field is required",
  },
};

export const Nested: Story = {
  render: () => {
    // This is a naive implementation to showcase nesting. Use caution copying
    // any of this code in a production setting.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState<string[]>([]);
    const getArgs = (keys: string[]) => {
      const onChange = (isSelected: boolean) => {
        setSelected((prevSelected) => {
          return isSelected
            ? [...prevSelected, ...keys]
            : prevSelected.filter((s: string) => !keys.includes(s));
        });
      };
      const isSelected = keys.every((k) => selected.includes(k));
      const isMaybeIndeterminate = keys.some((k) => selected.includes(k));
      const isIndeterminate = isMaybeIndeterminate && !isSelected;
      return {
        children: "Checkbox item",
        isSelected,
        isIndeterminate,
        onChange,
      };
    };
    return (
      <VerticalStack gap="1">
        <Checkbox {...getArgs(["1-1-1", "1-1-2", "1-2"])} />
        <div style={{ marginLeft: 24 }}>
          <VerticalStack gap="1">
            <Checkbox {...getArgs(["1-1-1", "1-1-2"])} isNested />
            <div style={{ marginLeft: 24 }}>
              <VerticalStack gap="1">
                <Checkbox {...getArgs(["1-1-1"])} isNested />
                <Checkbox {...getArgs(["1-1-2"])} isNested />
              </VerticalStack>
            </div>
            <Checkbox {...getArgs(["1-2"])} isNested />
          </VerticalStack>
        </div>
      </VerticalStack>
    );
  },
};

export const Multiline: Story = {
  render: (args) => (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 200,
        gap: 48,
      }}
    >
      <Checkbox {...args} />
      <Checkbox {...args} isNested />
    </span>
  ),
  args: {
    children:
      "Multi line option for mobile use. Note how the box is at the top not centered",
  },
};

export const WithLink: Story = {
  render: (args) => (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 320,
        gap: 48,
      }}
    >
      <Checkbox {...args} />
    </span>
  ),
  args: {
    children: (
      <>
        I agree to the EasyPost{" "}
        <a
          href="https://www.easypost.com/legal/terms"
          target="_blank"
          rel="noreferrer"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="https://www.easypost.com/privacy"
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy
        </a>
      </>
    ),
  },
};
