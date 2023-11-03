import MenuBookIcon from "@easypost/easy-ui-icons/MenuBook";
import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  EasyPostFullLogo,
  FakeClientSideRouterLink,
} from "../utilities/storybook";
import { ExpandedVerticalNav } from "./ExpandedVerticalNav";

type Story = StoryObj<typeof ExpandedVerticalNav>;

const meta: Meta<typeof ExpandedVerticalNav> = {
  title: "Components/VerticalNav/Expanded",
  component: ExpandedVerticalNav,
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
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [page, setPage] = useState("1/a");
    return (
      <ExpandedVerticalNav
        renderLogo={() => <EasyPostFullLogo />}
        selectedKeys={[page.indexOf("/") !== -1 ? page.split("/")[0] : page]}
        defaultExpandedKeys={["1"]}
      >
        <ExpandedVerticalNav.NavItem
          key="1"
          iconSymbol={MenuBookIcon}
          label="Item 1"
          as={FakeClientSideRouterLink}
          onClick={() => setPage("1/a")}
        >
          <ExpandedVerticalNav.Subnav
            selectedKeys={page.indexOf("1/") !== -1 ? [page.split("/")[1]] : []}
          >
            <ExpandedVerticalNav.SubnavItem
              key="a"
              label="Subitem a"
              as={FakeClientSideRouterLink}
              onClick={() => setPage("1/a")}
            />
            <ExpandedVerticalNav.SubnavItem
              key="b"
              label="Subitem b"
              as={FakeClientSideRouterLink}
              onClick={() => {
                setPage("1/b");
              }}
            />
          </ExpandedVerticalNav.Subnav>
        </ExpandedVerticalNav.NavItem>
        <ExpandedVerticalNav.NavItem
          key="2"
          iconSymbol={LocalShippingIcon}
          label="Item 2"
          as={FakeClientSideRouterLink}
          onClick={() => setPage("2/a")}
        >
          <ExpandedVerticalNav.Subnav
            selectedKeys={page.indexOf("2/") !== -1 ? [page.split("/")[1]] : []}
          >
            <ExpandedVerticalNav.SubnavItem
              key="a"
              label="Subitem a"
              as={FakeClientSideRouterLink}
              onClick={() => setPage("2/a")}
            />
            <ExpandedVerticalNav.SubnavItem
              key="b"
              label="Subitem b"
              as={FakeClientSideRouterLink}
              onClick={() => setPage("2/b")}
            />
          </ExpandedVerticalNav.Subnav>
        </ExpandedVerticalNav.NavItem>
        <ExpandedVerticalNav.NavItem
          key="3"
          iconSymbol={MenuBookIcon}
          label="Item 3"
          as={FakeClientSideRouterLink}
          onClick={() => setPage("3")}
        />
        <ExpandedVerticalNav.NavItem
          key="4"
          iconSymbol={LocalShippingIcon}
          label="Item 4"
          as={FakeClientSideRouterLink}
          onClick={() => setPage("4")}
        />
      </ExpandedVerticalNav>
    );
  },
};
