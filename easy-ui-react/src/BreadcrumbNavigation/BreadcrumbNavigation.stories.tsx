import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  BreadcrumbsNavigation,
  BackButton,
  Breadcrumbs,
  Breadcrumb,
} from "./BreadcrumbNavigation";

type Story = StoryObj<typeof BreadcrumbsNavigation>;

const meta: Meta<typeof BreadcrumbsNavigation> = {
  title: "Components/BreadcrumbNavigation",
  component: BreadcrumbsNavigation,
};

export default meta;

export const Test: Story = {
  render: () => (
    <BreadcrumbsNavigation>
      <BackButton>Back</BackButton>
      <Breadcrumbs>
        <Breadcrumb>Branding</Breadcrumb>
        <Breadcrumb>Sub Account Name</Breadcrumb>
        <Breadcrumb>Something else</Breadcrumb>
      </Breadcrumbs>
    </BreadcrumbsNavigation>
  ),
};
