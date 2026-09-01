import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import {
  mockGetComputedStyle,
  render,
  silenceConsoleError,
  userClick,
} from "../utilities/test";
import { Pagination, PaginationProps } from "./Pagination";

let restoreGetComputedStyle: () => void;

beforeEach(() => {
  vi.useFakeTimers();
  restoreGetComputedStyle = mockGetComputedStyle();
});

afterEach(() => {
  restoreGetComputedStyle();
  vi.useRealTimers();
});

describe("<Pagination />", () => {
  it("should render a pagination component", () => {
    render(createPagination({ label: "Example Pagination" }));
    expect(
      screen.getByRole("navigation", { name: /example pagination/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /previous/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("should go to next/previous page", async () => {
    const handleNext = vi.fn();
    const handlePrevious = vi.fn();

    const { user } = render(
      createPagination({
        label: "Example Pagination",
        onPrevious: handlePrevious,
        onNext: handleNext,
        hasNext: true,
        hasPrevious: true,
      }),
    );
    await userClick(user, screen.getByRole("button", { name: /next/i }));
    expect(handleNext).toHaveBeenCalled();
    await userClick(user, screen.getByRole("button", { name: /previous/i }));
    expect(handlePrevious).toHaveBeenCalled();
  });

  it("should render pagination component with dropdown", () => {
    render(
      createPagination({
        label: "Example Pagination",
        children: (
          <Pagination.Dropdown onSelect={() => {}} page={1} count={10} />
        ),
      }),
    );
    expect(
      screen.getByRole("navigation", { name: /example pagination/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /dropdown/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("1 of 10")).toBeInTheDocument();
  });

  it("could select page from dropdown", async () => {
    const handleNext = vi.fn();
    const handlePrevious = vi.fn();
    const handleSelect = vi.fn();
    const { user } = render(
      createPagination({
        label: "Example Pagination",
        onPrevious: handlePrevious,
        onNext: handleNext,
        children: (
          <Pagination.Dropdown onSelect={handleSelect} page={1} count={10} />
        ),
      }),
    );
    expect(
      screen.getByRole("navigation", { name: /example pagination/i }),
    ).toBeInTheDocument();
    await userClick(user, screen.getByRole("button", { name: /dropdown/i }));
    expect(screen.getAllByRole("menuitem").length).toBe(10);
    await userClick(user, screen.getByRole("menuitem", { name: "4 of 10" }));
    expect(handleSelect).toHaveBeenCalled();
  });

  it("should render as disabled", () => {
    render(
      createPagination({
        label: "Example Pagination",
        isDisabled: true,
        children: (
          <Pagination.Dropdown onSelect={() => {}} page={1} count={10} />
        ),
      }),
    );
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /dropdown/i })).toBeDisabled();
  });

  it("should throw an error when children is not <Pagination.Dropdown />", () => {
    const restoreConsoleError = silenceConsoleError();
    expect(() =>
      render(
        createPagination({
          label: "Example Pagination",
          children: <span>Hello World</span>,
        }),
      ),
    ).toThrow("children must be Pagination.Dropdown");
    restoreConsoleError();
  });
});

function createPagination(props: PaginationProps) {
  return <Pagination {...props} />;
}

describe("<Pagination /> numbered", () => {
  it("should render numbered pages with previous and next", () => {
    render(
      createPagination({
        label: "Example Pagination",
        page: 1,
        count: 3,
        onPageChange: () => {},
      }),
    );
    expect(
      screen.getByRole("button", { name: /previous/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 2" })).toBeInTheDocument();
    // The active page carries aria-current; its label is not doubled up.
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("should call onPageChange with the selected page", async () => {
    const handlePageChange = vi.fn();
    const { user } = render(
      createPagination({
        label: "Example Pagination",
        page: 1,
        count: 3,
        onPageChange: handlePageChange,
      }),
    );
    await userClick(user, screen.getByRole("button", { name: "Page 3" }));
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("should move to the next and previous page", async () => {
    const handlePageChange = vi.fn();
    const { user } = render(
      createPagination({
        label: "Example Pagination",
        page: 2,
        count: 3,
        onPageChange: handlePageChange,
      }),
    );
    await userClick(user, screen.getByRole("button", { name: /next/i }));
    expect(handlePageChange).toHaveBeenCalledWith(3);
    await userClick(user, screen.getByRole("button", { name: /previous/i }));
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it("should disable previous on the first page and next on the last page", () => {
    const { rerender } = render(
      createPagination({
        label: "Example Pagination",
        page: 1,
        count: 3,
        onPageChange: () => {},
      }),
    );
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).not.toBeDisabled();

    rerender(
      createPagination({
        label: "Example Pagination",
        page: 3,
        count: 3,
        onPageChange: () => {},
      }),
    );
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /previous/i }),
    ).not.toBeDisabled();
  });

  it("should render and wire First and Last when showFirstLast is set", async () => {
    const handlePageChange = vi.fn();
    const { user } = render(
      createPagination({
        label: "Example Pagination",
        page: 5,
        count: 20,
        onPageChange: handlePageChange,
        showFirstLast: true,
      }),
    );
    await userClick(user, screen.getByRole("button", { name: /first/i }));
    expect(handlePageChange).toHaveBeenCalledWith(1);
    await userClick(user, screen.getByRole("button", { name: /last/i }));
    expect(handlePageChange).toHaveBeenCalledWith(20);
  });

  it("should show a windowed range centered on the active page with static ellipses", () => {
    render(
      createPagination({
        label: "Example Pagination",
        page: 10,
        count: 20,
        onPageChange: () => {},
      }),
    );
    // A 5-wide window centers on the active page (8–12).
    expect(screen.getByRole("button", { name: "Page 8" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 12" })).toBeInTheDocument();
    // Pages outside the window are hidden behind ellipses.
    expect(
      screen.queryByRole("button", { name: "Page 1" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Page 20" }),
    ).not.toBeInTheDocument();
    // The ellipses are static indicators, not buttons.
    expect(
      screen.queryByRole("button", { name: /pages/i }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("…")).toHaveLength(2);
  });

  it("should clamp the window to the start with only a trailing ellipsis", () => {
    render(
      createPagination({
        label: "Example Pagination",
        page: 1,
        count: 20,
        onPageChange: () => {},
      }),
    );
    // Window is 1–5; page 6 is hidden and only one (trailing) ellipsis shows.
    expect(screen.getByRole("button", { name: "Page 5" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Page 6" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("…")).toHaveLength(1);
  });

  it("should clamp the window to the end with only a leading ellipsis", () => {
    render(
      createPagination({
        label: "Example Pagination",
        page: 20,
        count: 20,
        onPageChange: () => {},
      }),
    );
    // Window is 16–20; only one (leading) ellipsis shows.
    expect(screen.getByRole("button", { name: "Page 16" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Page 15" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("…")).toHaveLength(1);
  });

  it("should disable all controls when isDisabled is set", () => {
    render(
      createPagination({
        label: "Example Pagination",
        page: 3,
        count: 20,
        onPageChange: () => {},
        showFirstLast: true,
        isDisabled: true,
      }),
    );
    expect(screen.getByRole("button", { name: "First" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Last" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Page 2" })).toBeDisabled();
  });

  it("should render Rows Per Page and fire onRowsPerPageChange on select", async () => {
    const handleRowsPerPageChange = vi.fn();
    const { user } = render(
      createPagination({
        label: "Example Pagination",
        page: 1,
        count: 20,
        onPageChange: () => {},
        rowsPerPage: 50,
        rowsPerPageOptions: [10, 25, 50, 100],
        onRowsPerPageChange: handleRowsPerPageChange,
      }),
    );
    const trigger = screen.getByRole("button", { name: /rows per page/i });
    expect(trigger).toBeInTheDocument();
    await userClick(user, trigger);
    await userClick(
      user,
      screen.getByRole("menuitem", { name: "100 rows per page" }),
    );
    expect(handleRowsPerPageChange).toHaveBeenCalledWith(100);
  });

  it("should not render Rows Per Page without its props", () => {
    render(
      createPagination({
        label: "Example Pagination",
        page: 1,
        count: 5,
        onPageChange: () => {},
      }),
    );
    expect(
      screen.queryByRole("button", { name: /rows per page/i }),
    ).not.toBeInTheDocument();
  });

  it("should render nothing when there are no pages (count = 0)", () => {
    render(
      createPagination({
        label: "Example Pagination",
        page: 1,
        count: 0,
        onPageChange: () => {},
      }),
    );
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Page 1" }),
    ).not.toBeInTheDocument();
  });

  it("should clamp an out-of-range page for display", () => {
    const { rerender } = render(
      createPagination({
        label: "Example Pagination",
        page: 999,
        count: 20,
        onPageChange: () => {},
      }),
    );
    // Clamps down to the last page.
    expect(screen.getByRole("button", { name: "Page 20" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();

    rerender(
      createPagination({
        label: "Example Pagination",
        page: 0,
        count: 20,
        onPageChange: () => {},
      }),
    );
    // Clamps up to the first page.
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  });

  it("should size the window with visiblePageCount", () => {
    render(
      createPagination({
        label: "Example Pagination",
        page: 10,
        count: 20,
        visiblePageCount: 3,
        onPageChange: () => {},
      }),
    );
    // A 3-wide window centers on the active page (9–11).
    expect(screen.getByRole("button", { name: "Page 9" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 11" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Page 8" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Page 12" }),
    ).not.toBeInTheDocument();
  });

  it("should not render Rows Per Page when only one of its props is provided", () => {
    const { rerender } = render(
      createPagination({
        label: "Example Pagination",
        page: 1,
        count: 20,
        onPageChange: () => {},
        rowsPerPage: 50,
      }),
    );
    expect(
      screen.queryByRole("button", { name: /rows per page/i }),
    ).not.toBeInTheDocument();

    rerender(
      createPagination({
        label: "Example Pagination",
        page: 1,
        count: 20,
        onPageChange: () => {},
        onRowsPerPageChange: () => {},
      }),
    );
    expect(
      screen.queryByRole("button", { name: /rows per page/i }),
    ).not.toBeInTheDocument();
  });

  it("should hide the ellipsis from assistive tech", () => {
    render(
      createPagination({
        label: "Example Pagination",
        page: 10,
        count: 20,
        onPageChange: () => {},
      }),
    );
    const ellipses = screen.getAllByText("…");
    expect(ellipses.length).toBeGreaterThan(0);
    ellipses.forEach((ellipsis) => {
      expect(ellipsis.closest('[aria-hidden="true"]')).not.toBeNull();
    });
  });

  it("should render the small size", () => {
    render(
      createPagination({
        label: "Example Pagination",
        page: 10,
        count: 20,
        size: "sm",
        showFirstLast: true,
        rowsPerPage: 50,
        rowsPerPageOptions: [10, 25, 50, 100],
        onRowsPerPageChange: () => {},
        onPageChange: () => {},
      }),
    );
    expect(screen.getByRole("button", { name: "First" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 10" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("button", { name: /rows per page/i }),
    ).toBeInTheDocument();
  });
});
