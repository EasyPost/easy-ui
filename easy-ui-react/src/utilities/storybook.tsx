import React from "react";
import tokens from "@easypost/easy-ui-tokens/js/tokens";
import { getTokenAliases } from "./tokens";
import { Decorator } from "@storybook/react";

export function createLabelledOptionsControl(
  opts: Record<string, unknown>,
  control = {},
) {
  return {
    options: Object.keys(opts),
    mapping: opts,
    control: {
      type: "select",
      labels: Object.keys(opts).reduce((o, key) => ({ ...o, [key]: key }), {}),
      ...control,
    },
  };
}

export function createFontStyleTokensControl() {
  return getTokensControl("font-style-{alias}-family");
}

export function createColorTokensControl() {
  return getTokensControl("color-{alias}");
}

export function getTokensControl(pattern: string) {
  return createLabelledOptionsControl(
    getTokenAliases(tokens, pattern).reduce(
      (o, alias) => ({ ...o, [alias]: alias }),
      {},
    ),
  );
}

const buttonStoryStyles = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
} as React.CSSProperties;

const buttonStoryOnDarkBackgroundStyles = {
  backgroundColor: "var(--ezui-color-blue-800)",
  padding: "12px",
};

export const ButtonStoryDecorator: Decorator = (Story) => (
  <div style={buttonStoryStyles}>
    <Story />
  </div>
);

export const ButtonStoryOnDarkBackgroundDecorator: Decorator = (Story) => (
  <div style={{ ...buttonStoryOnDarkBackgroundStyles, ...buttonStoryStyles }}>
    <Story />
  </div>
);
