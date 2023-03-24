import React from "react";
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import { render, screen } from "@testing-library/react";
import { IconButton } from "./IconButton";
import { Icon } from "../Icon";

describe("<IconButton />", () => {
  it("should render a button with an icon and an accessibility label", () => {
    render(
      <IconButton
        icon={<Icon symbol={ArrowBackIcon} accessibilityLabel="arrow back" />}
      />,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: false })).toBeInTheDocument();
  });

  it("should apply the primary color class", () => {
    render(<IconButton icon={<Icon symbol={ArrowBackIcon} />} />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("colorPrimary"),
    );
  });

  it("should apply the secondary color class", () => {
    render(
      <IconButton color="secondary" icon={<Icon symbol={ArrowBackIcon} />} />,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("colorSecondary"),
    );
  });

  it("should apply the outlined variant class", () => {
    render(
      <IconButton variant="outlined" icon={<Icon symbol={ArrowBackIcon} />} />,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("variantOutlined"),
    );
  });

  it("should apply the disabled attribute", () => {
    render(<IconButton icon={<Icon symbol={ArrowBackIcon} />} isDisabled />);
    expect(screen.getByRole("button")).toHaveAttribute("disabled");
  });
});
