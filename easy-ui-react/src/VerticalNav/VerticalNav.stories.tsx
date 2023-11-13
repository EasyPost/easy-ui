import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import MenuBookIcon from "@easypost/easy-ui-icons/MenuBook";
import { Meta, StoryObj } from "@storybook/react";
import uniq from "lodash/uniq";
import React, { Key, ReactNode, useCallback, useState } from "react";
import {
  EasyPostFullLogo as EPLogo,
  FakeClientSideRouterLink as FakeLink,
} from "../utilities/storybook";
import { ExpandableVerticalNav, VerticalNav } from "./VerticalNav";

type Story = StoryObj<typeof VerticalNav>;

const meta: Meta<typeof VerticalNav> = {
  title: "Components/VerticalNav",
  component: VerticalNav,
};

export default meta;

export const Simple: Story = {
  render: () => (
    <FakePage>
      {({ page, setPage }) => (
        <VerticalNav
          aria-label="Sidebar"
          renderLogo={() => <EPLogo />}
          selectedKeys={[page.substring(0, 1)]}
        >
          <VerticalNav.Item
            key="1"
            iconSymbol={MenuBookIcon}
            label="Item 1"
            as={FakeLink}
            onClick={() => setPage("1")}
          />
          <VerticalNav.Item
            key="2"
            iconSymbol={MenuBookIcon}
            label="Item 2"
            as={FakeLink}
            onClick={() => setPage("2")}
          />
          <VerticalNav.Item
            key="3"
            iconSymbol={LocalShippingIcon}
            label="Item 3"
            as={FakeLink}
            onClick={() => setPage("3")}
          />
          <VerticalNav.Item
            key="4"
            iconSymbol={MenuBookIcon}
            label="Item 4"
            as={FakeLink}
            onClick={() => setPage("4")}
          />
          <VerticalNav.Item
            key="5"
            iconSymbol={LocalShippingIcon}
            label="Item 5"
            as={FakeLink}
            onClick={() => setPage("5")}
          />
        </VerticalNav>
      )}
    </FakePage>
  ),
};

export const Dense: Story = {
  render: () => (
    <FakePage>
      {({ page, setPage }) => (
        <VerticalNav
          renderLogo={() => <EPLogo />}
          selectedKeys={[page.substring(0, 1)]}
        >
          <VerticalNav.Item
            key="1"
            iconSymbol={MenuBookIcon}
            label="Item 1"
            as={FakeLink}
            onClick={() => setPage("1")}
          />
          <VerticalNav.Item
            key="2"
            iconSymbol={MenuBookIcon}
            label="Item 2"
            as={FakeLink}
            onClick={() => setPage("2")}
          >
            <VerticalNav.Subnav selectedKeys={[page.substring(0, 3)]}>
              <VerticalNav.Item
                key="2/a"
                label="Subitem a"
                as={FakeLink}
                onClick={() => setPage("2/a")}
              />
              <VerticalNav.Item
                key="2/b"
                label="Subitem b"
                as={FakeLink}
                onClick={() => setPage("2/b")}
              />
            </VerticalNav.Subnav>
          </VerticalNav.Item>
          <VerticalNav.Item
            key="3"
            iconSymbol={LocalShippingIcon}
            label="Item 3"
            as={FakeLink}
            onClick={() => setPage("3")}
          >
            <VerticalNav.Subnav selectedKeys={[page]}>
              <VerticalNav.Item
                key="3/a"
                label="Subitem a"
                as={FakeLink}
                onClick={() => setPage("3/a")}
              />
              <VerticalNav.Item
                key="3/b"
                label="Subitem b"
                as={FakeLink}
                onClick={() => setPage("3/b")}
              />
            </VerticalNav.Subnav>
          </VerticalNav.Item>
          <VerticalNav.Item
            key="4"
            iconSymbol={MenuBookIcon}
            label="Item 4"
            as={FakeLink}
            onClick={() => setPage("4")}
          />
          <VerticalNav.Item
            key="5"
            iconSymbol={LocalShippingIcon}
            label="Item 5"
            as={FakeLink}
            onClick={() => setPage("5")}
          />
        </VerticalNav>
      )}
    </FakePage>
  ),
};

export const Expandable: Story = {
  render: () => (
    <FakePage>
      {({ page, setPage, expandedKeys, setExpandedKeys }) => (
        <ExpandableVerticalNav
          renderLogo={() => <EPLogo />}
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
            as={FakeLink}
            onClick={() => setPage("1")}
          />
          <VerticalNav.Item
            key="2"
            iconSymbol={MenuBookIcon}
            label="Item 2"
            as={FakeLink}
            onClick={() => setPage("2")}
          >
            <VerticalNav.Subnav selectedKeys={[page.substring(0, 3)]}>
              <VerticalNav.Item
                key="2/a"
                label="Subitem a"
                as={FakeLink}
                onClick={() => setPage("2/a")}
              />
              <VerticalNav.Item
                key="2/b"
                label="Subitem b"
                as={FakeLink}
                onClick={() => setPage("2/b")}
              >
                <VerticalNav.Subnav selectedKeys={[page.substring(0, 5)]}>
                  <VerticalNav.Item
                    key="2/b/1"
                    label="Grandsubitem 1"
                    as={FakeLink}
                    onClick={() => setPage("2/b/1")}
                  />
                  <VerticalNav.Item
                    key="2/b/2"
                    label="Grandsubitem 2"
                    as={FakeLink}
                    onClick={() => setPage("2/b/2")}
                  />
                </VerticalNav.Subnav>
              </VerticalNav.Item>
            </VerticalNav.Subnav>
          </VerticalNav.Item>
          <VerticalNav.Item
            key="3"
            iconSymbol={LocalShippingIcon}
            label="Item 3"
            as={FakeLink}
            onClick={() => setPage("3")}
          >
            <VerticalNav.Subnav selectedKeys={[page]}>
              <VerticalNav.Item
                key="3/a"
                label="Subitem a"
                as={FakeLink}
                onClick={() => setPage("3/a")}
              />
              <VerticalNav.Item
                key="3/b"
                label="Subitem b"
                as={FakeLink}
                onClick={() => setPage("3/b")}
              />
            </VerticalNav.Subnav>
          </VerticalNav.Item>
          <VerticalNav.Item
            key="4"
            iconSymbol={MenuBookIcon}
            label="Item 4"
            as={FakeLink}
            onClick={() => setPage("4")}
          />
          <VerticalNav.Item
            key="5"
            iconSymbol={LocalShippingIcon}
            label="Item 5"
            as={FakeLink}
            onClick={() => setPage("5")}
          />
        </ExpandableVerticalNav>
      )}
    </FakePage>
  ),
};

type FakePageProps = {
  children: (args: FakePageChildrenArgs) => ReactNode;
};

type FakePageChildrenArgs = {
  page: string;
  setPage: (page: string) => void;
  expandedKeys: Key[];
  setExpandedKeys: (keys: Key[]) => void;
};

function FakePage({ children }: FakePageProps) {
  const [page, _setPage] = useState("1");
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const setPage = useCallback((newPage: string) => {
    _setPage(newPage);
    setExpandedKeys((prev) => uniq([...prev, newPage.substring(0, 1)]));
  }, []);
  const childrenArgs = {
    page,
    setPage,
    expandedKeys,
    setExpandedKeys,
  } as FakePageChildrenArgs;
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div
        style={{
          width: 215,
          height: "calc(100svh - 2rem)",
          background: "#f1f1f1",
        }}
      >
        {children(childrenArgs)}
      </div>
      <div style={{ padding: 48 }}>{page ? <>Page {page}</> : null}</div>
    </div>
  );
}