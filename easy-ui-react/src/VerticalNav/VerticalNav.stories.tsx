import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import MenuBookIcon from "@easypost/easy-ui-icons/MenuBook";
import AwardStarIcon from "@easypost/easy-ui-icons/AwardStar";
import MenuIcon from "@easypost/easy-ui-icons/Menu";
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
    <FakeSidebarPage>
      {({ page, setPage }) => (
        <VerticalNav
          aria-label="Sidebar"
          renderLogo={() => <EPLogo />}
          selectedKey={page.substring(0, 1)}
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
    </FakeSidebarPage>
  ),
};

export const Dense: Story = {
  render: () => (
    <FakeSidebarPage>
      {({ page, setPage }) => (
        <VerticalNav
          renderLogo={() => <EPLogo />}
          selectedKey={page.substring(0, 1)}
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
            <VerticalNav.Subnav selectedKey={page.substring(0, 3)}>
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
            <VerticalNav.Subnav selectedKey={page}>
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
    </FakeSidebarPage>
  ),
};

export const Expandable: Story = {
  render: () => (
    <FakeSidebarPage>
      {({ page, setPage, expandedKeys, setExpandedKeys }) => (
        <ExpandableVerticalNav
          selectedKey={page.substring(0, 1)}
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
            <VerticalNav.Subnav selectedKey={page.substring(0, 3)}>
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
                <VerticalNav.Subnav selectedKey={page}>
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
            <VerticalNav.Subnav selectedKey={page}>
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
    </FakeSidebarPage>
  ),
};

export const Banner: Story = {
  render: () => (
    <FakeSidebarPage>
      {({ page, setPage }) => (
        <VerticalNav
          aria-label="Sidebar"
          renderLogo={() => <EPLogo />}
          renderBanner={() => <FakeBanner />}
          selectedKey={page.substring(0, 1)}
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
    </FakeSidebarPage>
  ),
};

export const SupplementaryAction: Story = {
  render: () => (
    <FakeSidebarPage>
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
          selectedKey={page.substring(0, 1)}
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
    </FakeSidebarPage>
  ),
};

export const InsideCard: Story = {
  render: () => (
    <FakeMenuPage>
      {({ page, setPage, expandedKeys, setExpandedKeys }) => (
        <ExpandableVerticalNav
          selectedKey={page.substring(0, 1)}
          expandedKeys={expandedKeys}
          onExpandedChange={(keys) => {
            setExpandedKeys([...keys]);
          }}
          supplementaryAction={<CustomSupplementaryAction />}
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
            <VerticalNav.Subnav selectedKey={page.substring(0, 3)}>
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
                <VerticalNav.Subnav selectedKey={page}>
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
            <VerticalNav.Subnav selectedKey={page}>
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
    </FakeMenuPage>
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
      style={{ display: "flex", flexDirection: "column" }}
    >
      {children(childrenArgs)}
    </div>
  );
}

function FakeSidebarPage({
  children,
}: {
  children: (args: FakePageChildrenArgs) => ReactNode;
}) {
  return (
    <FakePage>
      {(childrenArgs) => (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            style={{
              flex: "0 0 auto",
              width: 215,
              height: "100svh",
              background: "#fff",
            }}
          >
            {children(childrenArgs)}
          </div>
          <div style={{ padding: 48 }}>
            {childrenArgs.page ? <>Selected item: {childrenArgs.page}</> : null}
          </div>
        </div>
      )}
    </FakePage>
  );
}

function FakeMenuPage({
  children,
}: {
  children: (args: FakePageChildrenArgs) => ReactNode;
}) {
  return (
    <FakePage>
      {(childrenArgs) => (
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: "0 0 auto",
              background: "#fff",
              borderBottom: "1px solid #ddd",
              padding: "16px 12px",
            }}
          >
            <Icon symbol={MenuIcon} />
          </div>
          <div
            style={{
              padding: 48,
              height: "calc(100svh - 60px)",
              textAlign: "right",
            }}
          >
            {childrenArgs.page ? <>Selected item: {childrenArgs.page}</> : null}
          </div>
          <div
            style={{
              position: "absolute",
              top: 66,
              left: 12,
              width: "100%",
              maxWidth: 340,
              background: "white",
              borderRadius: 4,
              border: "1px solid hsla(221, 30%, 74%, 1)",
              boxShadow: "0px 4px 8px 0px hsla(220, 30%, 65%, 0.25)",
            }}
          >
            {children(childrenArgs)}
          </div>
        </div>
      )}
    </FakePage>
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

function CustomSupplementaryAction() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        borderTop: "1px solid hsla(221, 30%, 74%, 1)",
        paddingTop: 8,
      }}
    >
      <UnstyledButton>
        <span style={{ cursor: "pointer" }}>
          <Text variant="subtitle2">Optional Bottom</Text>
        </span>
      </UnstyledButton>
    </div>
  );
}
