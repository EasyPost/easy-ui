import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Menu } from "../Menu";
import { Stepper } from "../Stepper";
import { EasyPostFullLogo, PlaceholderBox } from "../utilities/storybook";
import {
  FocusedProductLayout,
  FocusedProductLayoutProps,
} from "./FocusedProductLayout";

type Story = StoryObj<typeof FocusedProductLayout>;

const Template = (args: FocusedProductLayoutProps) => (
  <FocusedProductLayout {...args} />
);

const meta: Meta<typeof FocusedProductLayout> = {
  title: "Components/ProductLayout/FocusedProductLayout",
  component: FocusedProductLayout,
  args: {
    helpMenuItems: [
      <Menu.Item key="1" href="https://easypost.com" target="_blank">
        Documentation
      </Menu.Item>,
    ],
    renderBackArrow: (props) => {
      return (
        <button
          {...props}
          onClick={() => {
            window.alert("test");
          }}
        />
      );
    },
    renderLogo: () => <EasyPostFullLogo />,
    title: "Page Title",
    content: (
      <FocusedProductLayout.Content>
        <div style={{ marginTop: 24 }}>
          <PlaceholderBox width="100%">Space for content</PlaceholderBox>
        </div>
      </FocusedProductLayout.Content>
    ),
  },
  decorators: [
    (Story) => (
      <div className="full-screen-story product-layout-story">
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
};

export const WithSidePanel: Story = {
  render: Template.bind({}),
  args: {
    sidePanel: (
      <FocusedProductLayout.SidePanel>
        <PlaceholderBox width="100%">Space for content</PlaceholderBox>
      </FocusedProductLayout.SidePanel>
    ),
  },
};

export const WithSidePanelAtStart: Story = {
  render: Template.bind({}),
  args: {
    sidePanel: (
      <FocusedProductLayout.SidePanel>
        <PlaceholderBox width="100%">Space for content</PlaceholderBox>
      </FocusedProductLayout.SidePanel>
    ),
    sidePanelPosition: "start",
  },
};

export const WithSidePanelWidth: Story = {
  render: Template.bind({}),
  args: {
    sidePanel: (
      <FocusedProductLayout.SidePanel width="50%">
        <PlaceholderBox width="100%">Space for content</PlaceholderBox>
      </FocusedProductLayout.SidePanel>
    ),
  },
};

export const Wizard: Story = {
  render: Template.bind({}),
  args: {
    content: (
      <FocusedProductLayout.WizardContent
        stepper={
          <Stepper activeStepIndex={1}>
            {["Step 1", "Step 2", "Step 3", "Step 4"].map((step, index) => (
              <Stepper.Step
                key={step}
                stepIndex={index}
                onPress={() => {}}
                isComplete={index < 1}
                isAccessible={false}
              >
                {step}
              </Stepper.Step>
            ))}
          </Stepper>
        }
        previousAction={{
          content: "Back",
          onAction: action("previousAction.onAction pressed"),
        }}
        nextAction={{
          content: "Next",
          onAction: action("nextAction.onAction pressed"),
        }}
      >
        <div style={{ marginTop: 24 }}>
          <PlaceholderBox width="100%">Space for content</PlaceholderBox>
        </div>
      </FocusedProductLayout.WizardContent>
    ),
  },
};
