import { action } from "storybook/actions";
import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Stepper } from "../Stepper";
import {
  EasyPostFullLogo,
  PlaceholderBox,
  helpMenuItems,
} from "../utilities/storybook";
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
    helpMenuItems: helpMenuItems(),
    renderBackArrow: (props) => (
      <button {...props} onClick={action("backArrow.onClick pressed")} />
    ),
    renderLogo: () => <EasyPostFullLogo />,
    title: "Page Title",
    content: (
      <FocusedProductLayout.Content>
        <div style={{ marginTop: 24 }}>
          <PlaceholderBox width="100%">Content</PlaceholderBox>
        </div>
      </FocusedProductLayout.Content>
    ),
  },
  parameters: {
    controls: {
      include: ["title"],
    },
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

export const EmptyContent: Story = {
  render: Template.bind({}),
};

export const WithSidePanel: Story = {
  render: Template.bind({}),
  args: {
    sidePanel: (
      <FocusedProductLayout.SidePanel>
        <PlaceholderBox width="250px">250px wide content</PlaceholderBox>
      </FocusedProductLayout.SidePanel>
    ),
  },
};

export const WithSidePanelAtStart: Story = {
  render: Template.bind({}),
  args: {
    sidePanel: (
      <FocusedProductLayout.SidePanel>
        <PlaceholderBox width="250px">250px wide content</PlaceholderBox>
      </FocusedProductLayout.SidePanel>
    ),
    sidePanelPosition: "start",
  },
  parameters: {
    controls: {
      include: ["title", "sidePanelPosition"],
    },
  },
};

export const WithSidePanelWidth: Story = {
  render: Template.bind({}),
  args: {
    sidePanel: (
      <FocusedProductLayout.SidePanel width="50%">
        <PlaceholderBox width="100%">50% wide content</PlaceholderBox>
      </FocusedProductLayout.SidePanel>
    ),
  },
};

export const WizardContent: Story = {
  render: Template.bind({}),
  args: {
    content: (
      <FocusedProductLayout.WizardContent
        activeStepIndex={1}
        steps={["Step 1", "Step 2", "Step 3", "Step 4"].map((step, index) => (
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

export const BackArrowAsLink: Story = {
  render: Template.bind({}),
  args: {
    renderBackArrow: (props) => (
      <a
        href="/?path=/story/components-productlayout-focusedproductlayout--default"
        {...props}
      />
    ),
  },
};
