import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Pagination } from "./Pagination";

type Story = StoryObj<typeof Pagination>;

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
};

export default meta;

export const Default: Story = {
  render: () => {
    const handleNext = () => console.log("Next");
    const handlePrevious = () => console.log("Previous");
    return (
      <Pagination
        label="Example Basic Pagination"
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious
        hasNext
      />
    );
  },
};

export const WithPageDropdown: Story = {
  render: () => {
    const [page, setPage] = React.useState(1);
    const totalPage = 10;
    const handleNext = () => setPage((prev) => prev + 1);
    const handlePrevious = () => setPage((prev) => prev - 1);
    const hasPrevious = page > 1;
    const hasNext = totalPage > page;
    const handleSelect = (key: number) => setPage(key);
    return (
      <Pagination
        label="Example Pagination with Dropdown"
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
      >
        <Pagination.Dropdown
          count={totalPage}
          page={page}
          onSelect={handleSelect}
        />
      </Pagination>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Pagination
      label="Example Pagination with Dropdown"
      onPrevious={() => console.log("Previous")}
      onNext={() => console.log("Next")}
      hasPrevious
      hasNext
      isDisabled
    >
      <Pagination.Dropdown
        count={10}
        page={4}
        onSelect={() => console.log("Select")}
      />
    </Pagination>
  ),
};
