import { Meta, StoryObj } from "@storybook/react-vite";
import React, { ComponentProps, useState } from "react";
import { FakeClientSideRouter } from "../utilities/storybook";
import { TabNav, TabNavProps } from "./TabNav";

type Story = StoryObj<typeof TabNav>;

const meta: Meta<typeof TabNav> = {
  title: "Components/Tabs/TabNav",
  component: TabNav,
};

export default meta;

export const Default: Story = {
  render: DefaultTemplate.bind({}),
};

export const ClientSideRouting: Story = {
  render: ClientSideRoutingTemplate.bind({}),
};

export const CustomLink: Story = {
  render: CustomLinkTemplate.bind({}),
};

export const Responsive: Story = {
  render: CustomLinkTemplate.bind({}),
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};

const tabs = [
  ["Billing", "billing"],
  ["Members", "members"],
  ["API Keys", "api-keys"],
  ["Branded Tracker", "branded-tracker"],
  ["Shipping Settings", "shipping-settings"],
];

function DefaultTemplate(args: TabNavProps) {
  return (
    <TabNav aria-label="Account" {...args}>
      {tabs.map(([label, location], i) => (
        <TabNav.Item
          key={location}
          href={href(location)}
          isCurrentPage={tab() === location || (!tab() && i === 0)}
        >
          {label}
        </TabNav.Item>
      ))}
    </TabNav>
  );
}

// Items render as regular anchors with regular hrefs; the router configured on
// `<Provider />` is what keeps clicking them from loading a new page.
function ClientSideRoutingTemplate(args: Partial<TabNavProps>) {
  return (
    <FakeClientSideRouter initialPath={settingsPath(tabs[0][1])}>
      {(path) => (
        <TabNav aria-label="Account" {...args}>
          {tabs.map(([label, location]) => (
            <TabNav.Item
              key={location}
              href={settingsPath(location)}
              isCurrentPage={path === settingsPath(location)}
            >
              {label}
            </TabNav.Item>
          ))}
        </TabNav>
      )}
    </FakeClientSideRouter>
  );
}

function CustomLinkTemplate(args: Partial<TabNavProps>) {
  const [page, setPage] = useState("billing");
  return (
    <TabNav aria-label="Account" {...args}>
      {tabs.map(([label, location]) => (
        <TabNav.Item
          key={location}
          as={FakeClientSideRouterLink}
          isCurrentPage={page === location}
          onClick={() => setPage(location)}
        >
          {label}
        </TabNav.Item>
      ))}
    </TabNav>
  );
}

// This story uses a `button` as a link, only as an example for showing that
// the link element can be customized for custom routers like next/link.
// TabNav shouldn't use `button`s in production.
function FakeClientSideRouterLink(props: ComponentProps<"button">) {
  return <button {...props} />;
}

function settingsPath(location: string) {
  return `/settings/${location}`;
}

function $window() {
  return window.top || window;
}

function tab() {
  const url = new URL($window().location.href);
  return url.searchParams.get("ezui-tab-nav-tab");
}

function href(tab: string) {
  const url = new URL($window().location.href);
  url.searchParams.set("ezui-tab-nav-tab", tab);
  return url.href;
}
