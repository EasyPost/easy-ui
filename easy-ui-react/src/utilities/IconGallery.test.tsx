import { screen, waitFor } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { IconGallery } from "./IconGallery";
import {
  installJestCompatibleFakeTimers,
  render,
  userClick,
  userType,
} from "./test";

describe("<IconGallery />", () => {
  installJestCompatibleFakeTimers();

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a heading per letter", () => {
    render(<IconGallery />);
    expect(screen.getByRole("heading", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "S" })).toBeInTheDocument();
  });

  it("should order icons alphabetically", () => {
    render(<IconGallery />);
    const names = screen
      .getAllByRole("button", { name: /^Copy import for A/ })
      .map((tile) => tile.getAttribute("aria-label"));
    expect(names[0]).toBe("Copy import for AccountBalance");
    expect(names[1]).toBe("Copy import for AccountBalanceWallet");
  });

  it("should copy an import statement when an icon is selected", async () => {
    const { user } = render(<IconGallery />);

    Object.assign(window.navigator.clipboard, {
      writeText: vi.fn().mockImplementation(() => Promise.resolve()),
    });

    await userClick(
      user,
      screen.getByRole("button", { name: "Copy import for Add" }),
    );

    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
      'import AddIcon from "@easypost/easy-ui-icons/Add";',
    );
    await waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });

  it("should filter by name", async () => {
    const { user } = render(<IconGallery />);
    await userType(user, screen.getByLabelText("Filter icons"), "accountbal");
    expect(
      screen.getByRole("button", { name: "Copy import for AccountBalance" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Copy import for Add" }),
    ).not.toBeInTheDocument();
  });

  it("should filter by the words in a name", async () => {
    const { user } = render(<IconGallery />);
    await userType(user, screen.getByLabelText("Filter icons"), "account bal");
    expect(
      screen.getByRole("button", { name: "Copy import for AccountBalance" }),
    ).toBeInTheDocument();
  });

  it("should message when nothing matches the filter", async () => {
    const { user } = render(<IconGallery />);
    await userType(user, screen.getByLabelText("Filter icons"), "mailbox");
    expect(screen.getByText("No icons match “mailbox”.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Copy import/ })).toBeNull();
  });
});
