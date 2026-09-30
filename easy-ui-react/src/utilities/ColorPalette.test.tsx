import { screen, waitFor } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { ColorPalette } from "./ColorPalette";
import {
  installJestCompatibleFakeTimers,
  render,
  userClick,
  userType,
} from "./test";

describe("<ColorPalette />", () => {
  installJestCompatibleFakeTimers();

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a heading per color family", () => {
    render(<ColorPalette />);
    expect(screen.getByRole("heading", { name: "blue" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "gray" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "named" })).toBeInTheDocument();
  });

  it("should order shades from dark to light", () => {
    render(<ColorPalette />);
    const blues = screen
      .getAllByRole("button", { name: /color\.blue\./ })
      .map((swatch) => swatch.getAttribute("aria-label"));
    expect(blues[0]).toBe("Copy #000824, color.blue.900");
    expect(blues[blues.length - 1]).toBe("Copy #FBFDFF, color.blue.025");
  });

  it("should resolve aliased colors to a hex value", () => {
    render(<ColorPalette />);
    expect(
      screen.getByRole("button", { name: "Copy #000000, color.black" }),
    ).toBeInTheDocument();
  });

  it("should copy a hex value when a swatch is selected", async () => {
    const { user } = render(<ColorPalette />);

    Object.assign(window.navigator.clipboard, {
      writeText: vi.fn().mockImplementation(() => Promise.resolve()),
    });

    await userClick(
      user,
      screen.getByRole("button", { name: "Copy #164DFF, color.blue.500" }),
    );

    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
      "#164DFF",
    );
    await waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });

  it("should filter by token name", async () => {
    const { user } = render(<ColorPalette />);
    await userType(user, screen.getByLabelText("Filter colors"), "purple");
    expect(screen.getByRole("heading", { name: "purple" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "blue" }),
    ).not.toBeInTheDocument();
  });

  it("should filter by hex value", async () => {
    const { user } = render(<ColorPalette />);
    await userType(user, screen.getByLabelText("Filter colors"), "#164DFF");
    expect(screen.getAllByRole("button", { name: /^Copy #/ })).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: "Copy #164DFF, color.blue.500" }),
    ).toBeInTheDocument();
  });

  it("should message when nothing matches the filter", async () => {
    const { user } = render(<ColorPalette />);
    await userType(user, screen.getByLabelText("Filter colors"), "chartreuse");
    expect(
      screen.getByText("No colors match “chartreuse”."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Copy #/ })).toBeNull();
  });
});
