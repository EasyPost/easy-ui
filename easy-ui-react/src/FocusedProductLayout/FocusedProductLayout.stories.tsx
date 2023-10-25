import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Menu } from "../Menu";
import { Stepper } from "../Stepper";
import { EasyPostFullLogo, PlaceholderBox } from "../utilities/storybook";
import { FocusedProductLayout } from "./FocusedProductLayout";

type Story = StoryObj<typeof FocusedProductLayout>;

const meta: Meta<typeof FocusedProductLayout> = {
  title: "Components/ProductLayout/FocusedProductLayout",
  component: FocusedProductLayout,
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
  render: () => (
    <FocusedProductLayout>
      <FocusedProductLayout.Header
        helpMenuItems={[
          <Menu.Item key="1" href="https://easypost.com" target="_blank">
            Documentation
          </Menu.Item>,
        ]}
        renderBackArrow={(props) => {
          return (
            <button
              {...props}
              onClick={() => {
                window.alert("test");
              }}
            />
          );
        }}
        renderLogo={() => <EasyPostFullLogo />}
        title="H3"
      />
      <FocusedProductLayout.Content>
        <div style={{ padding: "24px 0" }}>
          <PlaceholderBox width="100%">Space for content</PlaceholderBox>
        </div>
      </FocusedProductLayout.Content>
    </FocusedProductLayout>
  ),
};

export const WithSidePanel: Story = {
  render: () => (
    <FocusedProductLayout
      renderSidePanel={() => (
        <FocusedProductLayout.SidePanel>
          <div style={{ padding: "24px 44px" }}>
            <PlaceholderBox width="100%">Space for content</PlaceholderBox>
          </div>
        </FocusedProductLayout.SidePanel>
      )}
    >
      <FocusedProductLayout.Header
        helpMenuItems={[
          <Menu.Item key="1" href="https://easypost.com" target="_blank">
            Documentation
          </Menu.Item>,
        ]}
        renderBackArrow={(props) => {
          return <button {...props} />;
        }}
        renderLogo={() => <EasyPostFullLogo />}
        title="H3"
      />
      <FocusedProductLayout.Content>
        <div style={{ padding: "24px 0" }}>
          <PlaceholderBox width="100%">Space for content</PlaceholderBox>
        </div>
      </FocusedProductLayout.Content>
    </FocusedProductLayout>
  ),
};

export const Wizard: Story = {
  render: () => (
    <FocusedProductLayout>
      <FocusedProductLayout.Header
        helpMenuItems={[
          <Menu.Item key="1" href="https://easypost.com" target="_blank">
            Documentation
          </Menu.Item>,
        ]}
        renderBackArrow={(props) => {
          return <button {...props} />;
        }}
        renderLogo={() => <EasyPostFullLogo />}
        title="H3"
      />
      <FocusedProductLayout.WizardContent
        stepper={
          <Stepper activeStepIndex={0}>
            {["Step 1", "Step 2", "Step 3", "Step 4"].map((step, index) => (
              <Stepper.Step
                key={step}
                stepIndex={index}
                onPress={() => {}}
                isComplete={false}
                isAccessible={false}
              >
                {step}
              </Stepper.Step>
            ))}
          </Stepper>
        }
        previousAction={{
          content: "Back",
          onAction: () => {
            window.alert("test");
          },
        }}
        nextAction={{
          content: "Next",
          onAction: () => {
            window.alert("next");
          },
        }}
      >
        <div style={{ padding: "24px 0" }}>
          <PlaceholderBox width="100%">Space for content</PlaceholderBox>
        </div>
      </FocusedProductLayout.WizardContent>
    </FocusedProductLayout>
  ),
};
