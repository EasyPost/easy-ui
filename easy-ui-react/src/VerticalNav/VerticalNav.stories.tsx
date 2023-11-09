import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import MenuBookIcon from "@easypost/easy-ui-icons/MenuBook";
import { Meta, StoryObj } from "@storybook/react";
import uniq from "lodash/uniq";
import React, { Key, useCallback, useState } from "react";
import {
  EasyPostFullLogo,
  FakeClientSideRouterLink,
} from "../utilities/storybook";
import { ExpandableVerticalNav, VerticalNav } from "./VerticalNav";

type Story = StoryObj<typeof ExpandableVerticalNav>;

const meta: Meta<typeof ExpandableVerticalNav> = {
  title: "Components/VerticalNav",
  component: ExpandableVerticalNav,
};

export default meta;

export const Default: Story = {
  render: () => {
    /* eslint-disable react-hooks/rules-of-hooks */
    const [page, setPage] = useState("1");
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
    const commitPage = useCallback((newPage: string) => {
      setPage(newPage);
      setExpandedKeys((prev) => uniq([...prev, newPage.substring(0, 1)]));
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
          <ExpandableVerticalNav
            renderLogo={() => <EasyPostFullLogo />}
            selectedKeys={[page.substring(0, 1)]}
            expandedKeys={expandedKeys}
            onExpandedChange={(keys) => {
              setExpandedKeys([...keys]);
            }}
          >
            <VerticalNav.Item
              key="1"
              iconSymbol={MenuBookIcon}
              label="Item 1"
              as={FakeClientSideRouterLink}
              onClick={() => commitPage("1")}
            />
            <VerticalNav.Item
              key="2"
              iconSymbol={MenuBookIcon}
              label="Item 2"
              as={FakeClientSideRouterLink}
              onClick={() => commitPage("2")}
            >
              <VerticalNav.Subnav selectedKeys={[page.substring(0, 3)]}>
                <VerticalNav.Item
                  key="2/a"
                  label="Subitem a"
                  as={FakeClientSideRouterLink}
                  onClick={() => commitPage("2/a")}
                />
                <VerticalNav.Item
                  key="2/b"
                  label="Subitem b"
                  as={FakeClientSideRouterLink}
                  onClick={() => commitPage("2/b")}
                >
                  <VerticalNav.Subnav selectedKeys={[page.substring(0, 5)]}>
                    <VerticalNav.Item
                      key="2/b/1"
                      label="Grandsubitem 1"
                      as={FakeClientSideRouterLink}
                      onClick={() => commitPage("2/b/1")}
                    />
                    <VerticalNav.Item
                      key="2/b/2"
                      label="Grandsubitem 2"
                      as={FakeClientSideRouterLink}
                      onClick={() => commitPage("2/b/2")}
                    />
                  </VerticalNav.Subnav>
                </VerticalNav.Item>
              </VerticalNav.Subnav>
            </VerticalNav.Item>
            <VerticalNav.Item
              key="3"
              iconSymbol={LocalShippingIcon}
              label="Item 3"
              as={FakeClientSideRouterLink}
              onClick={() => commitPage("3")}
            >
              <VerticalNav.Subnav selectedKeys={[page]}>
                <VerticalNav.Item
                  key="3/a"
                  label="Subitem a"
                  as={FakeClientSideRouterLink}
                  onClick={() => commitPage("3/a")}
                />
                <VerticalNav.Item
                  key="3/b"
                  label="Subitem b"
                  as={FakeClientSideRouterLink}
                  onClick={() => commitPage("3/b")}
                />
              </VerticalNav.Subnav>
            </VerticalNav.Item>
            <VerticalNav.Item
              key="4"
              iconSymbol={MenuBookIcon}
              label="Item 4"
              as={FakeClientSideRouterLink}
              onClick={() => commitPage("4")}
            />
            <VerticalNav.Item
              key="5"
              iconSymbol={LocalShippingIcon}
              label="Item 5"
              as={FakeClientSideRouterLink}
              onClick={() => commitPage("5")}
            />
          </ExpandableVerticalNav>
        </div>
        <div style={{ padding: 48 }}>{page ? <>Page {page}</> : null}</div>
      </div>
    );
  },
};
