import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import MenuBookIcon from "@easypost/easy-ui-icons/MenuBook";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { EasyPostFullLogo } from "../utilities/storybook";
import { VerticalNav } from "./VerticalNav";

type Story = StoryObj<typeof VerticalNav>;

const meta: Meta<typeof VerticalNav> = {
  title: "Components/VerticalNav/Legacy",
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
      <VerticalNav.Nav selectedKeys={["1"]}>
        <VerticalNav.NavItem key="1" iconSymbol={MenuBookIcon} label="Item 1">
          <VerticalNav.Subnav selectedKeys={["2"]}>
            <VerticalNav.SubnavItem key="1" label="Subitem 1" />
            <VerticalNav.SubnavItem key="2" label="Subitem 2">
              <VerticalNav.Subnav selectedKeys={["2"]}>
                <VerticalNav.SubnavItem key="1" label="Subitem 1" />
                <VerticalNav.SubnavItem key="2" label="Subitem 2" />
              </VerticalNav.Subnav>
            </VerticalNav.SubnavItem>
            <VerticalNav.SubnavItem key="3" label="Subitem 3" />
          </VerticalNav.Subnav>
        </VerticalNav.NavItem>
        <VerticalNav.NavItem
          key="2"
          iconSymbol={LocalShippingIcon}
          label="Item 2"
        >
          <VerticalNav.Subnav>
            <VerticalNav.SubnavItem label="Subitem 1" />
            <VerticalNav.SubnavItem label="Subitem 2" />
          </VerticalNav.Subnav>
        </VerticalNav.NavItem>
      </VerticalNav.Nav>
    </VerticalNav>
  ),
};
