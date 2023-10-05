import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { TabPanels, TabPanelsProps } from "./TabPanels";
import { action } from "@storybook/addon-actions";

type Story = StoryObj<typeof TabPanels>;

function Template(args: TabPanelsProps) {
  return <TabPanels {...args} />;
}

const meta: Meta<typeof TabPanels> = {
  title: "Components/Tabs/TabPanels",
  component: TabPanels,
  args: {
    children: (
      <>
        <TabPanels.Tabs>
          <TabPanels.Item key="for">Founding of Rome</TabPanels.Item>
          <TabPanels.Item key="mar">Monarchy and Republic</TabPanels.Item>
          <TabPanels.Item key="emp">Empire</TabPanels.Item>
        </TabPanels.Tabs>
        <div style={{ padding: 16 }}>
          <TabPanels.Panels>
            <TabPanels.Item key="for">
              Arma virumque cano, Troiae qui primus ab oris.
            </TabPanels.Item>
            <TabPanels.Item key="mar">
              Senatus Populusque Romanus.
            </TabPanels.Item>
            <TabPanels.Item key="emp">Alea jacta est.</TabPanels.Item>
          </TabPanels.Panels>
        </div>
      </>
    ),
    "aria-label": "History of Ancient Rome",
    keyboardActivation: "automatic",
    isDisabled: false,
  },
  argTypes: {
    defaultSelectedKey: {
      control: { type: "text" },
    },
    selectedKey: {
      control: { type: "text" },
    },
  },
  parameters: {
    controls: {
      exclude: ["children", "onSelectionChange", "disabledKeys"],
    },
  },
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
};

export const Controlled: Story = {
  render: Template.bind({}),
  args: {
    selectedKey: "mar",
    onSelectionChange: action("selection change"),
  },
  parameters: {
    controls: {
      include: ["selectedKey"],
    },
  },
};

export const DefaultSelectedKey: Story = {
  render: Template.bind({}),
  args: {
    defaultSelectedKey: "mar",
  },
  parameters: {
    controls: {
      include: ["defaultSelectedKey"],
    },
  },
};

export const DisabledList: Story = {
  render: Template.bind({}),
  args: {
    isDisabled: true,
  },
  parameters: {
    controls: {
      include: ["isDisabled"],
    },
  },
};

export const DisabledItems: Story = {
  render: Template.bind({}),
  args: {
    disabledKeys: ["mar"],
  },
  parameters: {
    controls: {
      include: [],
    },
  },
};

export const ManualKeyboardActivation: Story = {
  render: Template.bind({}),
  args: {
    keyboardActivation: "manual",
  },
  parameters: {
    controls: {
      include: ["keyboardActivation"],
    },
  },
};

export const Responsive: Story = {
  render: Template.bind({}),
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export const CustomLayout: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <div style={{ border: "1px solid red", padding: 8 }}>
        <div style={{ border: "1px solid orange", padding: 8 }}>
          <TabPanels.Tabs>
            <TabPanels.Item key="for">Founding of Rome</TabPanels.Item>
            <TabPanels.Item key="mar">Monarchy and Republic</TabPanels.Item>
            <TabPanels.Item key="emp">Empire</TabPanels.Item>
          </TabPanels.Tabs>
        </div>
        <div style={{ marginTop: 8, border: "1px solid green", padding: 24 }}>
          <TabPanels.Panels>
            <TabPanels.Item key="for">
              <div style={{ border: "1px solid purple", padding: 8 }}>
                Arma virumque cano, Troiae qui primus ab oris.
              </div>
            </TabPanels.Item>
            <TabPanels.Item key="mar">
              Senatus Populusque Romanus.
            </TabPanels.Item>
            <TabPanels.Item key="emp">Alea jacta est.</TabPanels.Item>
          </TabPanels.Panels>
        </div>
      </div>
    ),
  },
};
