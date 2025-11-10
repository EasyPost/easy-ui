import React from "react";
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import { render, screen } from "@testing-library/react";
import { IconButton } from "./IconButton";

describe("<IconButton />", () => {
  it("should render a button with an icon", () => {
    render(<IconButton icon={ArrowBackIcon} accessibilityLabel="Back" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should apply the primary color class", () => {
    render(<IconButton icon={ArrowBackIcon} accessibilityLabel="Back" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("colorPrimary"),
    );
  });

  it("should apply the secondary color class", () => {
    render(
      <IconButton
        color="secondary"
        icon={ArrowBackIcon}
        accessibilityLabel="Back"
      />,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("colorSecondary"),
    );
  });

  it("should apply the outlined variant class", () => {
    render(
      <IconButton
        variant="outlined"
        icon={ArrowBackIcon}
        accessibilityLabel="Back"
      />,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("variantOutlined"),
    );
  });

  it("should render a disabled button", () => {
    render(
      <IconButton icon={ArrowBackIcon} accessibilityLabel="Back" isDisabled />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should apply the medium size class by default", () => {
    render(<IconButton icon={ArrowBackIcon} accessibilityLabel="Back" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("sizeMd"),
    );
  });

  it("should apply the small size class", () => {
    render(
      <IconButton size="sm" icon={ArrowBackIcon} accessibilityLabel="Back" />,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("sizeSm"),
    );
  });

  it("should apply the medium size class", () => {
    render(
      <IconButton size="md" icon={ArrowBackIcon} accessibilityLabel="Back" />,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("sizeMd"),
    );
  });
});
