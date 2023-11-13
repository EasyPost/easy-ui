import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import MenuBookIcon from "@easypost/easy-ui-icons/MenuBook";
import AwardStarIcon from "@easypost/easy-ui-icons/AwardStar";
import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import uniq from "lodash/uniq";
import React, { Key, ReactNode, useCallback, useState } from "react";
import {
  EasyPostFullLogo as EPLogo,
  FakeClientSideRouterLink as FakeLink,
} from "../utilities/storybook";
import { ExpandableVerticalNav, VerticalNav } from "./VerticalNav";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { Menu } from "../Menu";
import { UnstyledButton } from "../UnstyledButton";

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

export const Banner: Story = {
  render: () => (
    <FakePage>
      {({ page, setPage }) => (
        <VerticalNav
          aria-label="Sidebar"
          renderLogo={() => <EPLogo />}
          renderBanner={() => <FakeBanner />}
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

export const SupplementaryAction: Story = {
  render: () => (
    <FakePage>
      {({ page, setPage }) => (
        <VerticalNav
          aria-label="Sidebar"
          renderLogo={() => <EPLogo />}
          supplementaryAction={
            <Menu>
              <Menu.Trigger>
                <VerticalNav.SupplementaryAction as={UnstyledButton}>
                  Optional Bottom
                </VerticalNav.SupplementaryAction>
              </Menu.Trigger>
              <Menu.Overlay
                onAction={action("Selected")}
                placement="left bottom"
              >
                <Menu.Item key="copy">Copy</Menu.Item>
                <Menu.Item key="cut">Cut</Menu.Item>
                <Menu.Item key="paste">Paste</Menu.Item>
              </Menu.Overlay>
            </Menu>
          }
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
    <div
      className="full-screen-story product-layout-story"
      style={{ display: "flex", flexDirection: "row" }}
    >
      <div style={{ width: 215, height: "100svh", background: "#fff" }}>
        {children(childrenArgs)}
      </div>
      <div style={{ padding: 48 }}>
        {page ? <>Selected item: {page}</> : null}
      </div>
    </div>
  );
}

function FakeBanner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: 48,
        background: "hsl(274, 84%, 58%)",
        color: "white",
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
      }}
    >
      <Icon symbol={AwardStarIcon} />
      <Text variant="subtitle1">Pro Trial</Text>
    </div>
  );
}
