import AwardStarIcon from "@easypost/easy-ui-icons/AwardStar";
import MenuBookIcon from "@easypost/easy-ui-icons/MenuBook";
import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import React, { ComponentType } from "react";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { Text } from "../Text";
import { UnstyledButton } from "../UnstyledButton";
import { EasyPostFullLogo } from "../utilities/storybook";
import { ListVerticalNavProps } from "./ListVerticalNav";
import { TreeVerticalNavProps } from "./TreeVerticalNav";
import { ExpandableVerticalNav, VerticalNav } from "./VerticalNav";

type ListStory = StoryObj<typeof VerticalNav>;
type TreeStory = StoryObj<typeof ExpandableVerticalNav>;

function ListTemplate(props: ListVerticalNavProps) {
  return <VerticalNav {...props} />;
}

function TreeTemplate(props: TreeVerticalNavProps) {
  return <ExpandableVerticalNav {...props} />;
}

const meta: Meta<typeof VerticalNav> = {
  title: "Components/VerticalNav",
  component: VerticalNav,
  args: {
    ["aria-label"]: "Sidebar",
    children: [
      <VerticalNav.Item key="1" icon={MenuBookIcon} label="Item 1" href="#" />,
      <VerticalNav.Item key="2" icon={MenuBookIcon} label="Item 2" href="#" />,
      <VerticalNav.Item key="3" icon={MenuBookIcon} label="Item 3" href="#" />,
      <VerticalNav.Item key="4" icon={MenuBookIcon} label="Item 4" href="#" />,
      <VerticalNav.Item key="5" icon={MenuBookIcon} label="Item 5" href="#" />,
    ],
    renderLogo: () => <EasyPostFullLogo />,
    selectedKey: "1",
  },
  parameters: {
    controls: {
      exclude: [
        "children",
        "expandedKeys",
        "renderBanner",
        "renderLogo",
        "supplementaryAction",
      ],
    },
  },
};

export default meta;

export const Simple: ListStory = {
  render: ListTemplate.bind({}),
  decorators: [FakeSidebarDecorator],
};

export const Dense: ListStory = {
  render: ListTemplate.bind({}),
  decorators: [FakeSidebarDecorator],
  args: {
    children: [
      <VerticalNav.Item key="1" icon={MenuBookIcon} label="Item 1" href="#" />,
      <VerticalNav.Item key="2" icon={MenuBookIcon} label="Item 2" href="#">
        <VerticalNav.Subnav selectedKey="1">
          <VerticalNav.Item key="1" label="Item 1" href="#" />
          <VerticalNav.Item key="2" label="Item 2" href="#" />
          <VerticalNav.Item key="3" label="Item 3" href="#" />
        </VerticalNav.Subnav>
      </VerticalNav.Item>,
      <VerticalNav.Item key="3" icon={MenuBookIcon} label="Item 3" href="#" />,
      <VerticalNav.Item key="4" icon={MenuBookIcon} label="Item 4" href="#" />,
      <VerticalNav.Item key="5" icon={MenuBookIcon} label="Item 5" href="#" />,
    ],
    selectedKey: "2",
  },
};

export const Expandable: TreeStory = {
  render: TreeTemplate.bind({}),
  decorators: [FakeSidebarDecorator],
  args: {
    children: getExpandableChildren(),
    expandedKeys: ["2"],
    selectedKey: "2",
  },
};

export const WithSupplementaryAction: ListStory = {
  render: ListTemplate.bind({}),
  decorators: [FakeSidebarDecorator],
  args: {
    supplementaryAction: (
      <Menu>
        <Menu.Trigger>
          <VerticalNav.SupplementaryAction as={UnstyledButton}>
            Optional Action
          </VerticalNav.SupplementaryAction>
        </Menu.Trigger>
        <Menu.Overlay onAction={action("Selected")} placement="left bottom">
          <Menu.Item key="copy">Copy</Menu.Item>
          <Menu.Item key="cut">Cut</Menu.Item>
          <Menu.Item key="paste">Paste</Menu.Item>
        </Menu.Overlay>
      </Menu>
    ),
  },
};

export const WithBanner: ListStory = {
  render: ListTemplate.bind({}),
  decorators: [FakeSidebarDecorator],
  args: {
    renderBanner: () => <FakeBanner />,
  },
};

export const WithinACard: TreeStory = {
  render: TreeTemplate.bind({}),
  args: {
    children: getExpandableChildren(),
    expandedKeys: ["2"],
    renderLogo: undefined,
    selectedKey: "2",
    supplementaryAction: (
      <div
        style={{ borderTop: "1px solid hsla(221, 30%, 74%, 1)", paddingTop: 8 }}
      >
        <VerticalNav.SupplementaryAction as={UnstyledButton}>
          Optional Action
        </VerticalNav.SupplementaryAction>
      </div>
    ),
  },
  decorators: [FakeCardDecorator],
};

function getExpandableChildren() {
  return [
    <VerticalNav.Item key="1" icon={MenuBookIcon} label="Item 1" href="#" />,
    <VerticalNav.Item key="2" icon={MenuBookIcon} label="Item 2" href="#">
      <VerticalNav.Subnav selectedKey="2">
        <VerticalNav.Item key="1" label="Item 1" href="#" />
        <VerticalNav.Item key="2" label="Item 2" href="#">
          <VerticalNav.Subnav selectedKey="1">
            <VerticalNav.Item key="1" label="Item 1" href="#" />
            <VerticalNav.Item key="2" label="Item 2" href="#" />
            <VerticalNav.Item key="3" label="Item 3" href="#" />
          </VerticalNav.Subnav>
        </VerticalNav.Item>
        <VerticalNav.Item key="3" label="Item 3" href="#" />
      </VerticalNav.Subnav>
    </VerticalNav.Item>,
    <VerticalNav.Item key="3" icon={MenuBookIcon} label="Item 3" href="#" />,
    <VerticalNav.Item key="4" icon={MenuBookIcon} label="Item 4" href="#" />,
    <VerticalNav.Item key="5" icon={MenuBookIcon} label="Item 5" href="#" />,
  ];
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

function FakeSidebarDecorator(Story: ComponentType) {
  return (
    <div className="full-screen-story product-layout-story">
      <div
        style={{
          flex: "0 0 auto",
          width: 215,
          height: "100svh",
          background: "#fff",
        }}
      >
        <Story />
      </div>
    </div>
  );
}

function FakeCardDecorator(Story: ComponentType) {
  return (
    <div className="full-screen-story product-layout-story">
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 24,
          flex: "0 0 auto",
          width: 340,
          background: "#fff",
          borderRadius: 4,
          border: "1px solid hsla(221, 30%, 74%, 1)",
          boxShadow: "0px 4px 8px 0px hsla(220, 30%, 65%, 0.25)",
        }}
      >
        <Story />
      </div>
    </div>
  );
}
