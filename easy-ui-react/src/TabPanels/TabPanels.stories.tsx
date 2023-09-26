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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TabPanels.Tabs>
            <Item key="FoR">Founding of Rome</Item>
            <Item key="MaR">Monarchy and Republic</Item>
            <Item key="Emp">Empire</Item>
          </TabPanels.Tabs>
          <div style={{ padding: 24 }}>
            <TabPanels.Panels>
              <Item key="FoR">
                <div className="test">
                  Arma virumque cano, Troiae qui primus ab oris.
                </div>
              </Item>
              <Item key="MaR">Senatus Populusque Romanus.</Item>
              <Item key="Emp">
                <>
                  <div>Alea jacta est.</div>
                  <div>blah</div>
                </>
              </Item>
            </TabPanels.Panels>
          </div>
        </div>
      </TabPanels>
    );
  },
};
