import { create } from "@storybook/theming";

const colors = {
  primary: "#164dff",
  secondary: "#164dff",
  background: "#f8f9fc",
  border: "#c6cfe0",
  surface: "#ffffff",
  text: "#384359",
};

export const theme = create({
  base: "light",
  brandTitle: "EasyPost Easy UI Storybook",
  brandUrl: "/",
  brandImage: "/easypost-logo.svg?v=20230308",
  appBg: colors.background,
  appContentBg: colors.background,
  appBorderRadius: 4,

  // Main colors
  colorPrimary: colors.primary,
  colorSecondary: colors.secondary,

  // Typography
  textColor: colors.text,
  textInverseColor: colors.surface,
  fontBase: 'Poppins, "Poppins Fallback"',

  // Toolbar default and active colors
  barTextColor: colors.text,
  barSelectedColor: colors.primary,
  barBg: colors.background,

  // Form colors
  inputBg: colors.background,
  inputBorder: colors.border,
  inputTextColor: colors.text,
  inputBorderRadius: 4,
});
