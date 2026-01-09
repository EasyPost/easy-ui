import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { ThemeProvider } from ".";
import { Button } from "../Button";

type Story = StoryObj<typeof ThemeProvider>;

const meta: Meta<typeof ThemeProvider> = {
  title: "Components/Theme",
  component: ThemeProvider,
};

export default meta;

export const Default: Story = {
  render: () => (
    <GreenBrand>
      <Button color="primary">Primary Button</Button>
    </GreenBrand>
  ),
  args: {},
};

export const DarkOrLightMode: Story = {
  render: () => (
    <DarkOrLightGreenBrand>
      <Button color="primary">Primary Button</Button>
    </DarkOrLightGreenBrand>
  ),
  args: {},
};

function GreenBrand({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      theme={() => ({
        "color.primary.900": "hsl(150, 50%, 0%)",
        "color.primary.800": "hsl(150, 50%, 10%)",
        "color.primary.700": "hsl(150, 50%, 20%)",
        "color.primary.600": "hsl(150, 50%, 30%)",
        "color.primary.500": "hsl(150, 50%, 40%)",
        "color.primary.400": "hsl(150, 50%, 50%)",
        "color.primary.300": "hsl(150, 50%, 60%)",
        "color.primary.200": "hsl(150, 50%, 70%)",
        "color.primary.100": "hsl(150, 50%, 80%)",
        "color.primary.050": "hsl(150, 50%, 90%)",
        "color.primary.025": "hsl(150, 50%, 95%)",
      })}
    >
      {children}
    </ThemeProvider>
  );
}

function DarkOrLightGreenBrand({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      theme={({ colorScheme }) => ({
        "color.primary.900": `hsl(150, 50%, ${colorScheme === "light" ? "0" : "95"}%)`,
        "color.primary.800": `hsl(150, 50%, ${colorScheme === "light" ? "10" : "90"}%)`,
        "color.primary.700": `hsl(150, 50%, ${colorScheme === "light" ? "20" : "80"}%)`,
        "color.primary.600": `hsl(150, 50%, ${colorScheme === "light" ? "30" : "70"}%)`,
        "color.primary.500": `hsl(150, 50%, ${colorScheme === "light" ? "40" : "60"}%)`,
        "color.primary.400": `hsl(150, 50%, ${colorScheme === "light" ? "50" : "50"}%)`,
        "color.primary.300": `hsl(150, 50%, ${colorScheme === "light" ? "60" : "40"}%)`,
        "color.primary.200": `hsl(150, 50%, ${colorScheme === "light" ? "70" : "30"}%)`,
        "color.primary.100": `hsl(150, 50%, ${colorScheme === "light" ? "80" : "20"}%)`,
        "color.primary.050": `hsl(150, 50%, ${colorScheme === "light" ? "90" : "10"}%)`,
        "color.primary.025": `hsl(150, 50%, ${colorScheme === "light" ? "95" : "5"}%)`,
      })}
    >
      {children}
    </ThemeProvider>
  );
}
