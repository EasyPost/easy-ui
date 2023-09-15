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
        <TabNav.Link
          as={CustomLink}
          aria-current={page === "Tab 1" ? true : false}
          onClick={() => {
            setPage("Tab 1");
          }}
        >
          Tab 1
        </TabNav.Link>
        <TabNav.Link
          as={CustomLink}
          aria-current={page === "Tab 2" ? true : false}
          onClick={() => {
            setPage("Tab 2");
          }}
        >
          Tab 2
        </TabNav.Link>
        <TabNav.Link
          as={CustomLink}
          aria-current={page === "Tab 3" ? true : false}
          onClick={() => {
            setPage("Tab 3");
          }}
        >
          Tab 3
        </TabNav.Link>
        <TabNav.Link
          as={CustomLink}
          aria-current={page === "Long Tab" ? true : false}
          onClick={() => {
            setPage("Long Tab");
          }}
        >
          Long Tab
        </TabNav.Link>
        <TabNav.Link
          as={CustomLink}
          aria-current={page === "Tab 4" ? true : false}
          onClick={() => {
            setPage("Tab 4");
          }}
        >
          Tab 4
        </TabNav.Link>
      </TabNav>
    );
  },
};

function CustomLink(props: ComponentProps<"button">) {
  return <button {...props} />;
}
