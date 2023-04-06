import { create } from "@storybook/theming";
import tokens from "../easy-ui-tokens/dist/js/tokens";

export const gridCellSize = 8;

export const backgrounds = {
  dark: tokens["color.gray.800"],
  light: tokens["color.gray.000"],
};

const colors = {
  background: backgrounds.light,
  primary: tokens["color.blue.500"],
  secondary: tokens["color.blue.500"],
  border: tokens["color.gray.200"],
  surface: tokens["color.white"],
  text: tokens["color.gray.700"],
  textMuted: tokens["color.gray.400"],
};

export const theme = create({
  base: "light",
  gridCellSize,

  brandTitle: "EasyPost Easy UI Storybook",
  brandUrl: "/",
  brandImage: "/easypost-logo.svg?v=20230308",
  brandTarget: "_self",

  appBg: colors.background,
  appContentBg: colors.background,
  appBorderColor: colors.border,
  appBorderRadius: tokens["shape.border_radius.base"],

  // Main colors
  colorPrimary: colors.primary,
  colorSecondary: colors.secondary,

  // Typography
  textColor: colors.text,
  textInverseColor: colors.surface,
  textMutedColor: colors.textMuted,
  fontBase: 'Poppins, "Poppins Fallback"',

  // Toolbar default and active colors
  barTextColor: colors.text,
  barSelectedColor: colors.primary,
  barBg: colors.background,

  // Form colors
  inputBg: colors.background,
  inputBorder: colors.border,
  inputTextColor: colors.text,
  inputBorderRadius: tokens["shape.border_radius.base"],
});
