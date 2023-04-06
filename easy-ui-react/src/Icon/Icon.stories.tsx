import React from "react";
import {
  createLabelledOptionsControl,
  createColorTokensControl,
} from "../utilities/storybook";
import { Icon, IconProps } from "./Icon";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import InfoIcon from "@easypost/easy-ui-icons/Info";
import WarningIcon from "@easypost/easy-ui-icons/Warning";
import ErrorIcon from "@easypost/easy-ui-icons/Error";

const Template = (args: IconProps) => <Icon {...args} />;

export default {
  title: "Components/Icon",
  argTypes: {
    // TODO: Figure out how to include all icons from our icons project
    symbol: createLabelledOptionsControl({
      CheckCircle: CheckCircleIcon,
      Info: InfoIcon,
      Warning: WarningIcon,
      Error: ErrorIcon,
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
    color: createColorTokensControl(),
    accessibilityLabel: {
      control: "text",
    },
  },
  component: Icon,
};

export const Controls = {
  render: Template.bind({}),
  args: {
    symbol: CheckCircleIcon,
  },
};
