import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Item } from "react-stately";
import { TabPanels } from "./TabPanels";

type Story = StoryObj<typeof TabPanels>;

const meta: Meta<typeof TabPanels> = {
  title: "Components/Tabs/TabPanels",
  component: TabPanels,
};

export default meta;

export const Default: Story = {
  render: () => {
    return (
      <TabPanels aria-label="History of Ancient Rome">
        <div style={{ border: "1px solid red" }}>
          <div style={{ border: "1px solid blue" }}>
            <TabPanels.Tabs>
              <Item key="FoR">Founding of Rome</Item>
              <Item key="MaR">Monarchy and Republic</Item>
              <Item key="Emp">Empire</Item>
            </TabPanels.Tabs>
          </div>
          <div style={{ border: "1px solid green" }}>
            <TabPanels.Panels>
              <Item key="FoR">
                Arma virumque cano, Troiae qui primus ab oris.
              </Item>
              <Item key="MaR">Senatus Populusque Romanus.</Item>
              <Item key="Emp">Alea jacta est.</Item>
            </TabPanels.Panels>
          </div>
        </div>
      </TabPanels>
    );
  },
};
