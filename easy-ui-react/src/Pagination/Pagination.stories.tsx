import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Pagination, PaginationSize } from "./Pagination";

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

function PageNumbersExample({ size }: { size?: PaginationSize }) {
  const [page, setPage] = React.useState(1);
  const totalPage = 10;
  const hasPrevious = page > 1;
  const hasNext = totalPage > page;
  return (
    <Pagination
      label="Example Pagination with Page Numbers"
      size={size}
      onFirst={() => setPage(1)}
      onPrevious={() => setPage((prev) => prev - 1)}
      onNext={() => setPage((prev) => prev + 1)}
      onLast={() => setPage(totalPage)}
      hasFirst={hasPrevious}
      hasPrevious={hasPrevious}
      hasNext={hasNext}
      hasLast={hasNext}
    >
      <Pagination.Pages count={totalPage} page={page} onSelect={setPage} />
    </Pagination>
  );
}

export const WithPageNumbers: Story = {
  render: () => <PageNumbersExample />,
};

export const WithPageNumbersSmall: Story = {
  render: () => <PageNumbersExample size="sm" />,
};

export const WithPageNumbersOnly: Story = {
  render: () => {
    const [page, setPage] = React.useState(1);
    return (
      <Pagination label="Example Pagination with Page Numbers Only">
        <Pagination.Pages count={3} page={page} onSelect={setPage} />
      </Pagination>
    );
  },
};

export const WithPageNumbersAndNavButtons: Story = {
  render: () => {
    const [page, setPage] = React.useState(1);
    const totalPage = 8;
    return (
      <Pagination
        label="Example Pagination with Page Numbers and Nav Buttons"
        onPrevious={() => setPage((prev) => prev - 1)}
        onNext={() => setPage((prev) => prev + 1)}
        hasPrevious={page > 1}
        hasNext={totalPage > page}
      >
        {/* Enough siblings to keep every page in the run, so nothing truncates */}
        <Pagination.Pages
          count={totalPage}
          page={page}
          siblingCount={3}
          onSelect={setPage}
        />
      </Pagination>
    );
  },
};

function RowsPerPageExample({ size }: { size?: PaginationSize }) {
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  return (
    <Pagination.RowsPerPage
      rowsPerPage={rowsPerPage}
      options={[25, 50, 100]}
      onChange={setRowsPerPage}
      size={size}
    />
  );
}

export const WithRowsPerPage: Story = {
  render: () => <RowsPerPageExample />,
};

export const WithRowsPerPageSmall: Story = {
  render: () => <RowsPerPageExample size="sm" />,
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
