import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import ErrorIcon from "@easypost/easy-ui-icons/Error";
import InfoIcon from "@easypost/easy-ui-icons/Info";
import WarningIcon from "@easypost/easy-ui-icons/Warning";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  createColorTokensControl,
  createLabelledOptionsControl,
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

function FedExLogoImg() {
  return (
    <img src="data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA3OS42IDM0LjYiIHZpZXdCb3g9IjAgMCA3OS42IDM0LjYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibS0xMy41LTdoOTl2NDguMmgtOTl6IiBmaWxsPSJub25lIi8+PGcgZmlsbD0iI2Y2MCI+PHBhdGggZD0ibTc5LjEgMjUuM2MwLTEuMi0uOS0yLjEtMi4xLTIuMXMtMi4xLjktMi4xIDIuMS45IDIuMSAyLjEgMi4xYzEuMyAwIDIuMS0uOSAyLjEtMi4xem0tMi42LjF2MS40aC0uNHYtMy4xaDEuMWMuNyAwIDEgLjMgMSAuOCAwIC4zLS4yLjYtLjUuNy4zIDAgLjQuMy40LjcgMCAuMy4xLjcuMi45aC0uNWMtLjEtLjMtLjEtLjctLjItMXMtLjItLjQtLjUtLjR6bS42LS40Yy40IDAgLjYtLjIuNi0uNHMtLjEtLjQtLjYtLjRoLS42di44em0tMi42LjNjMC0xLjUgMS4yLTIuNSAyLjYtMi41czIuNiAxIDIuNiAyLjUtMS4yIDIuNS0yLjYgMi41LTIuNi0xLTIuNi0yLjV6Ii8+PHBhdGggZD0ibTY1LjYgMjcuOC0yLjktMy4zLTIuOSAzLjNoLTYuMmw2LTYuNy02LTYuOGg2LjRsMi45IDMuMyAyLjktMy4zaDYuMWwtNiA2LjcgNi4xIDYuOHoiLz48cGF0aCBkPSJtNDEuOCAyNy44di0yMS4zaDExLjh2NC44aC02Ljh2M2g2Ljh2NC42aC02Ljh2NC4yaDYuOHY0Ljd6Ii8+PC9nPjxwYXRoIGQ9Im0zNi44IDYuNXY4LjdoLS4xYy0xLjEtMS4zLTIuNS0xLjctNC4xLTEuNy0zLjMgMC01LjcgMi4yLTYuNiA1LjItMS0zLjItMy41LTUuMi03LjMtNS4yLTMuMSAwLTUuNSAxLjQtNi44IDMuNnYtMi44aC02LjJ2LTNoNi45di00LjhoLTEyLjZ2MjEuM2g1Ljd2LTguOWg1LjZjLS4yLjYtLjMgMS4zLS4zIDIuMSAwIDQuNCAzLjQgNy42IDcuNyA3LjYgMy42IDAgNi0xLjcgNy4zLTQuOGgtNC44Yy0uNy45LTEuMiAxLjItMi41IDEuMi0xLjUgMC0yLjgtMS4zLTIuOC0yLjloOS45Yy40IDMuNSAzLjIgNi42IDYuOSA2LjYgMS42IDAgMy4xLS44IDQtMi4yaC4xdjEuNGg1di0yMS40em0tMjAuNyAxMi40Yy4zLTEuNCAxLjQtMi4yIDIuNy0yLjIgMS40IDAgMi40LjkgMi43IDIuMnptMTcuNyA1LjdjLTEuOCAwLTMtMS43LTMtMy41IDAtMS45IDEtMy43IDMtMy43IDIuMSAwIDIuOSAxLjggMi45IDMuNyAwIDEuOC0uOSAzLjUtMi45IDMuNXoiIGZpbGw9IiM0NjE0OGMiLz48L3N2Zz4=" />
  );
}
