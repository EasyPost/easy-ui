import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { render, userClick, silenceConsoleError } from "../utilities/test";
import { Pagination, PaginationProps } from "./Pagination";

describe("<Pagination />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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
