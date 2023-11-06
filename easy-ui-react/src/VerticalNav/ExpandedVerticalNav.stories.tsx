import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import MenuBookIcon from "@easypost/easy-ui-icons/MenuBook";
import { Meta, StoryObj } from "@storybook/react";
import React, { Key, useCallback, useState } from "react";
import {
  EasyPostFullLogo,
  FakeClientSideRouterLink,
} from "../utilities/storybook";
import { ExpandedVerticalNav } from "./ExpandedVerticalNav";

type Story = StoryObj<typeof ExpandedVerticalNav>;

const meta: Meta<typeof ExpandedVerticalNav> = {
  title: "Components/VerticalNav/Expanded",
  component: ExpandedVerticalNav,
};

export default meta;

export const Default: Story = {
  render: () => {
    /* eslint-disable react-hooks/rules-of-hooks */
    const [page, setPage] = useState("");
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
    const commitPage = useCallback((newPage: string) => {
      setPage(newPage);
      // setExpandedKeys((prev) => uniq([...prev, newPage.substring(0, 1)]));
    }, []);
    /* eslint-enable react-hooks/rules-of-hooks */
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            width: 215,
            height: "calc(100svh - 2rem)",
            background: "#f1f1f1",
          }}
        >
          <ExpandedVerticalNav
            renderLogo={() => <EasyPostFullLogo />}
            selectedKeys={[page.substring(0, 1)]}
            expandedKeys={[...expandedKeys, page.substring(0, 1)]}
            onExpandedChange={(keys) => {
              console.log("on expanded change", keys);
              setExpandedKeys([...keys]);
            }}
          >
            <ExpandedVerticalNav.NavItem
              key="1"
              iconSymbol={MenuBookIcon}
              label="Item 1"
              as={FakeClientSideRouterLink}
              onClick={() => commitPage("1")}
            >
              <ExpandedVerticalNav.Subnav selectedKeys={[page.substring(0, 3)]}>
                <ExpandedVerticalNav.SubnavItem
                  key="1/a"
                  label="Subitem a"
                  as={FakeClientSideRouterLink}
                  onClick={() => commitPage("1/a")}
                />
                <ExpandedVerticalNav.SubnavItem
                  key="1/b"
                  label="Subitem b"
                  as={FakeClientSideRouterLink}
                  onClick={() => commitPage("1/b")}
                >
                  <ExpandedVerticalNav.Subnav
                    selectedKeys={[page.substring(0, 5)]}
                  >
                    <ExpandedVerticalNav.SubnavItem
                      key="1/b/1"
                      label="Grandsubitem 1"
                      as={FakeClientSideRouterLink}
                      onClick={() => commitPage("1/b/1")}
                    />
                    <ExpandedVerticalNav.SubnavItem
                      key="1/b/2"
                      label="Grandsubitem 2"
                      as={FakeClientSideRouterLink}
                      onClick={() => commitPage("1/b/2")}
                    />
                  </ExpandedVerticalNav.Subnav>
                </ExpandedVerticalNav.SubnavItem>
              </ExpandedVerticalNav.Subnav>
            </ExpandedVerticalNav.NavItem>
            <ExpandedVerticalNav.NavItem
              key="2"
              iconSymbol={LocalShippingIcon}
              label="Item 2"
              as={FakeClientSideRouterLink}
              onClick={() => commitPage("2")}
            >
              <ExpandedVerticalNav.Subnav selectedKeys={[page]}>
                <ExpandedVerticalNav.SubnavItem
                  key="2/a"
                  label="Subitem a"
                  as={FakeClientSideRouterLink}
                  onClick={() => commitPage("2/a")}
                />
                <ExpandedVerticalNav.SubnavItem
                  key="2/b"
                  label="Subitem b"
                  as={FakeClientSideRouterLink}
                  onClick={() => commitPage("2/b")}
                />
              </ExpandedVerticalNav.Subnav>
            </ExpandedVerticalNav.NavItem>
            <ExpandedVerticalNav.NavItem
              key="3"
              iconSymbol={MenuBookIcon}
              label="Item 3"
              as={FakeClientSideRouterLink}
              onClick={() => commitPage("3")}
            />
            <ExpandedVerticalNav.NavItem
              key="4"
              iconSymbol={LocalShippingIcon}
              label="Item 4"
              as={FakeClientSideRouterLink}
              onClick={() => commitPage("4")}
            />
          </ExpandedVerticalNav>
        </div>
        <div style={{ padding: 48 }}>Page {page}</div>
      </div>
    );
  },
};
