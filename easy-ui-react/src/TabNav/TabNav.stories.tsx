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
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [page, setPage] = useState("Tab 1");
    return (
      <TabNav aria-label="Account">
        {["Tab 1", "Tab 2", "Tab 3", "Tab 4", "Tab 5"].map((tab) => (
          <TabNav.Item
            key={tab}
            as={CustomLink}
            isCurrentPage={page === tab ? true : false}
            onClick={() => setPage(tab)}
          >
            {tab}
          </TabNav.Item>
        ))}
      </TabNav>
    );
  },
};

function CustomLink(props: ComponentProps<"button">) {
  return <button {...props} />;
}
