import React from "react";
import {
  createFontStyleTokensControl,
  createColorTokensControl,
} from "../utilities/storybook";
import { Text, TextProps } from "./Text";

const Template = (args: TextProps) => <Text {...args} />;

export default {
  title: "Components/Text",
  argTypes: {
    variant: createFontStyleTokensControl(),
    color: createColorTokensControl(),
  },
  component: Text,
};

export const Controls = {
  render: Template.bind({}),
  args: {
    children: "Here is some text",
  },
};

export const Truncate = {
  render: Template.bind({}),
  args: {
    as: "p",
    variant: "body1",
    truncate: true,
    children: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt
        vel lorem nec pretium. Vestibulum ante ipsum primis in faucibus orci
        luctus et ultrices posuere cubilia curae; Morbi sollicitudin ex nec
        imperdiet pellentesque. Etiam dapibus ipsum non ligula molestie rhoncus.
        Vivamus eget iaculis lectus. Sed porttitor leo at nulla mollis
        malesuada. Vestibulum ante ipsum primis in faucibus orci luctus et
        ultrices posuere cubilia curae; Vestibulum vestibulum porttitor mollis.
        Nam dictum ante sed lobortis commodo. Ut luctus ut metus vel bibendum.
      </>
    ),
  },
};
