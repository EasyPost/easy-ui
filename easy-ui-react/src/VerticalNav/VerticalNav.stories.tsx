import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Item } from "react-stately";
import { EasyPostFullLogo } from "../utilities/storybook";
import { VerticalNav } from "./VerticalNav";

type Story = StoryObj<typeof VerticalNav>;

const meta: Meta<typeof VerticalNav> = {
  title: "Components/VerticalNav",
  component: VerticalNav,
  decorators: [
    (Story) => (
      <div
        style={{
          width: 215,
          height: "calc(100svh - 2rem)",
          background: "#f1f1f1",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const Default: Story = {
  render: () => (
    <VerticalNav renderLogo={() => <EasyPostFullLogo />}>
      <VerticalNav.Nav>
        <VerticalNav.NavItem textValue="item 1" label="Item 1">
          <VerticalNav.Subnav>
            <Item textValue="subitem 1">
              <div>Subitem 1</div>
            </Item>
            <Item textValue="subitem 2">
              <div>Subitem 2</div>
            </Item>
            <Item textValue="subitem 3">
              <div>Subitem 3</div>
            </Item>
          </VerticalNav.Subnav>
        </VerticalNav.NavItem>
        <VerticalNav.NavItem textValue="item 2" label="item 2">
          <VerticalNav.Subnav>
            <Item textValue="L1-Test">
              <div style={{ color: "red" }}>test</div>
            </Item>
          </VerticalNav.Subnav>
        </VerticalNav.NavItem>
      </VerticalNav.Nav>
    </VerticalNav>
  ),
};
