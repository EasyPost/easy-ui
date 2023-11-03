import MenuBookIcon from "@easypost/easy-ui-icons/MenuBook";
import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  EasyPostFullLogo,
  FakeClientSideRouterLink,
} from "../utilities/storybook";
import { SimpleVerticalNav } from "./SimpleVerticalNav";

type Story = StoryObj<typeof SimpleVerticalNav>;

const meta: Meta<typeof SimpleVerticalNav> = {
  title: "Components/VerticalNav/Simple",
  component: SimpleVerticalNav,
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

export const Simple: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [page, setPage] = useState("1");
    return (
      <SimpleVerticalNav
        renderLogo={() => <EasyPostFullLogo />}
        selectedKeys={[page]}
      >
        <SimpleVerticalNav.Item
          key="1"
          iconSymbol={MenuBookIcon}
          label="Item 1"
          as={FakeClientSideRouterLink}
          onClick={() => setPage("1")}
        />
        <SimpleVerticalNav.Item
          key="2"
          iconSymbol={LocalShippingIcon}
          label="Item 2"
          as={FakeClientSideRouterLink}
          onClick={() => setPage("2")}
        />
        <SimpleVerticalNav.Item
          key="3"
          iconSymbol={MenuBookIcon}
          label="Item 3"
          as={FakeClientSideRouterLink}
          onClick={() => setPage("3")}
        />
        <SimpleVerticalNav.Item
          key="4"
          iconSymbol={LocalShippingIcon}
          label="Item 4"
          as={FakeClientSideRouterLink}
          onClick={() => setPage("4")}
        />
      </SimpleVerticalNav>
    );
  },
};
