import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import ErrorIcon from "@easypost/easy-ui-icons/Error";
import InfoIcon from "@easypost/easy-ui-icons/Info";
import WarningIcon from "@easypost/easy-ui-icons/Warning";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  createColorTokensControl,
  createLabelledOptionsControl,
  FedExLogoImg,
} from "../utilities/storybook";
import { Icon, IconProps } from "./Icon";

type Story = StoryObj<typeof Icon>;

const Template = (args: IconProps) => <Icon {...args} />;

const meta: Meta<typeof Icon> = {
  title: "Primitives/Icon",
  argTypes: {
    // TODO: Figure out how to include all icons from our icons project
    symbol: createLabelledOptionsControl({
      CheckCircle: CheckCircleIcon,
      Info: InfoIcon,
      Warning: WarningIcon,
      Error: ErrorIcon,
      FedExLogoImg: FedExLogoImg,
    }),
    size: createLabelledOptionsControl({
      md: "md",
      lg: "lg",
      "Responsive -- xs-sm md-md lg-lg": {
        xs: "sm",
        md: "md",
        lg: "lg",
      },
    }),
    color: {
      ...createColorTokensControl(),
      table: {
        type: { summary: null },
      },
    },
    accessibilityLabel: {
      control: "text",
    },
  },
  component: Icon,
};

export default meta;

export const Controls: Story = {
  render: Template.bind({}),
  args: {
    symbol: CheckCircleIcon,
  },
};
