import React from "react";
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import { render, screen } from "@testing-library/react";
import { IconButton } from "./IconButton";

describe("<IconButton />", () => {
  it("should render a button with icon", () => {
    render(<IconButton symbol={ArrowBackIcon} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should apply the primary color class", () => {
    render(<IconButton symbol={ArrowBackIcon} />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Primary"),
    );
  });

  it("should apply the secondary color class", () => {
    render(<IconButton color="secondary" symbol={ArrowBackIcon} />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Secondary"),
    );
  });

  it("should apply the outlined variant class", () => {
    render(<IconButton variant="outlined" symbol={ArrowBackIcon} />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Outlined"),
    );
  });

  it("should apply the disabled attribute", () => {
    render(<IconButton symbol={ArrowBackIcon} isDisabled />);
    expect(screen.getByRole("button")).toHaveAttribute("disabled");
  });
});
