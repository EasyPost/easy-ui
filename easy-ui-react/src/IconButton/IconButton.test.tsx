import React from "react";
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import { render, screen } from "@testing-library/react";
import { IconButton } from "./IconButton";

describe("<IconButton />", () => {
  it("should render a button with an icon", () => {
    render(<IconButton iconSymbol={ArrowBackIcon} accessibilityLabel="Back" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should apply the primary color class", () => {
    render(<IconButton iconSymbol={ArrowBackIcon} accessibilityLabel="Back" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("colorPrimary"),
    );
  });

  it("should apply the secondary color class", () => {
    render(
      <IconButton
        color="secondary"
        iconSymbol={ArrowBackIcon}
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
        iconSymbol={ArrowBackIcon}
        accessibilityLabel="Back"
      />,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("variantOutlined"),
    );
  });

  it("should apply the disabled attribute", () => {
    render(
      <IconButton
        iconSymbol={ArrowBackIcon}
        accessibilityLabel="Back"
        isDisabled
      />,
    );
    expect(screen.getByRole("button")).toHaveAttribute("disabled");
  });
});
