import { Meta, StoryObj } from "@storybook/react";
import React, { ComponentProps, useState } from "react";
import { TabNav } from "./TabNav";

type Story = StoryObj<typeof TabNav>;

const meta: Meta<typeof TabNav> = {
  title: "Components/TabNav",
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
  render: DefaultTemplate.bind({}),
};

const tabs = [
  ["Billing", "billing"],
  ["Members", "members"],
  ["API Keys", "api-keys"],
  ["Branded Tracker", "branded-tracker"],
  ["Shipping Settings", "shipping-settings"],
];

function DefaultTemplate() {
  return (
    <TabNav aria-label="Account">
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

function CustomLinkTemplate() {
  const [page, setPage] = useState("billing");
  return (
    <TabNav aria-label="Account">
      {tabs.map(([label, location]) => (
        <TabNav.Item
          key={location}
          as={FakeClientSideRouterLink}
          isCurrentPage={page === location ? true : false}
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
