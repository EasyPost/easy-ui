import MenuBookIcon from "@easypost/easy-ui-icons/MenuBook";
import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  EasyPostFullLogo,
  FakeClientSideRouterLink,
} from "../utilities/storybook";
import { DenseVerticalNav } from "./DenseVerticalNav";

type Story = StoryObj<typeof DenseVerticalNav>;

const meta: Meta<typeof DenseVerticalNav> = {
  title: "Components/VerticalNav/Dense",
  component: DenseVerticalNav,
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
      <DenseVerticalNav
        renderLogo={() => <EasyPostFullLogo />}
        selectedKeys={[page.indexOf("/") !== -1 ? page.split("/")[0] : page]}
      >
        <DenseVerticalNav.NavItem
          key="1"
          iconSymbol={MenuBookIcon}
          label="Item 1"
          as={FakeClientSideRouterLink}
          onClick={() => setPage("1/a")}
        >
          <DenseVerticalNav.Subnav
            selectedKeys={page.indexOf("1/") !== -1 ? [page.split("/")[1]] : []}
          >
            <DenseVerticalNav.SubnavItem
              key="a"
              label="Subitem a"
              as={FakeClientSideRouterLink}
              onClick={() => setPage("1/a")}
            />
            <DenseVerticalNav.SubnavItem
              key="b"
              label="Subitem b"
              as={FakeClientSideRouterLink}
              onClick={() => {
                setPage("1/b");
              }}
            />
          </DenseVerticalNav.Subnav>
        </DenseVerticalNav.NavItem>
        <DenseVerticalNav.NavItem
          key="2"
          iconSymbol={LocalShippingIcon}
          label="Item 2"
          as={FakeClientSideRouterLink}
          onClick={() => setPage("2/a")}
        >
          <DenseVerticalNav.Subnav
            selectedKeys={page.indexOf("2/") !== -1 ? [page.split("/")[1]] : []}
          >
            <DenseVerticalNav.SubnavItem
              key="a"
              label="Subitem a"
              as={FakeClientSideRouterLink}
              onClick={() => setPage("2/a")}
            />
            <DenseVerticalNav.SubnavItem
              key="b"
              label="Subitem b"
              as={FakeClientSideRouterLink}
              onClick={() => setPage("2/b")}
            />
          </DenseVerticalNav.Subnav>
        </DenseVerticalNav.NavItem>
        <DenseVerticalNav.NavItem
          key="3"
          iconSymbol={MenuBookIcon}
          label="Item 3"
          as={FakeClientSideRouterLink}
          onClick={() => setPage("3")}
        />
        <DenseVerticalNav.NavItem
          key="4"
          iconSymbol={LocalShippingIcon}
          label="Item 4"
          as={FakeClientSideRouterLink}
          onClick={() => setPage("4")}
        />
      </DenseVerticalNav>
    );
  },
};
