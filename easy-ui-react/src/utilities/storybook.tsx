import React from "react";
import tokens from "@easypost/easy-ui-tokens/js/tokens";
import { getThemeTokenAliases } from "../Theme";
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
  return getDesignTokensControl("font.style.{alias}.family");
}

export function createColorTokensControl() {
  return getThemeTokensControl("color.text.{alias}");
}

export function getDesignTokensControl(pattern: string) {
  return getTokensControl(getTokenAliases(tokens, pattern));
}

export function getThemeTokensControl(pattern: string) {
  return getTokensControl(getThemeTokenAliases(pattern));
}

function getTokensControl(tokenAliases: string[]) {
  return createLabelledOptionsControl(
    tokenAliases.reduce((o, alias) => ({ ...o, [alias]: alias }), {}),
  );
}

const inlineStoryStyles = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
} as React.CSSProperties;

const inlineStoryOnDarkBackgroundStyles = {
  backgroundColor: "var(--ezui-color-blue-800)",
  padding: "12px",
};

export const InlineStoryDecorator: Decorator = (Story) => (
  <div style={inlineStoryStyles}>
    <Story />
  </div>
);

export const InlineStoryOnDarkBackgroundDecorator: Decorator = (Story) => (
  <div style={{ ...inlineStoryOnDarkBackgroundStyles, ...inlineStoryStyles }}>
    <Story />
  </div>
);
