import { Meta, StoryObj } from "@storybook/react-vite";
import React, { ComponentProps, useState } from "react";
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
