import tokens from "@easypost/easy-ui-tokens/js/tokens";
import { Decorator } from "@storybook/react";
import React from "react";
import type { Placement as AriaPlacement } from "react-aria";
import { getThemeTokenAliases } from "../Theme";
import { getTokenAliases } from "./tokens";

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

// TODO: Is there a way to use better styling for this?
export const FullScreenStoryPreviewStyle = () => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `html,body,#storybook-root {
          height: 100%;
        }`,
      }}
    />
  );
};

/**
 * Centers trigger elements within the storybook frame with a user-specified
 * amount of space around the triggers to allow for an overlay to show within
 * the story window.
 *
 * @param Story
 * @param options.parameters.overlayLayout.framePaddingX Horizontal breathing room for overlays around story frame
 * @param options.parameters.overlayLayout.framePaddingY Vertical breathing room for overlays around story frame
 * @param options.parameters.overlayLayout.triggerSpacingX Horizontal breathing room between triggers
 * @param options.parameters.overlayLayout.triggerSpacingY Vertical breathing room between triggers
 * @returns React element representing decorator
 */
export const OverlayLayoutDecorator: Decorator = (Story, options) => {
  const { parameters } = options;
  const { overlayLayout = {} } = parameters;
  const {
    framePaddingX = 0,
    framePaddingY = 0,
    triggerSpacingX = 0,
    triggerSpacingY = 0,
  } = overlayLayout;
  return (
    <>
      <FullScreenStoryPreviewStyle />
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <div
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            justifyContent: "center",
            margin: "auto",
            rowGap: triggerSpacingY,
            columnGap: triggerSpacingX,
            paddingLeft: framePaddingX,
            paddingRight: framePaddingX,
            paddingTop: framePaddingY,
            paddingBottom: framePaddingY,
          }}
        >
          <Story />
        </div>
      </div>
    </>
  );
};

export const overlayPlacements = [
  "top",
  "bottom",
  "left",
  "right",
  "top left",
  "top right",
  "bottom left",
  "bottom right",
  "left top",
  "left bottom",
  "right top",
  "right bottom",
] as AriaPlacement[];

export const InputDecorator: Decorator = (Story) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      maxWidth: "425px",
      gap: "12px",
    }}
  >
    <Story />
  </div>
);
