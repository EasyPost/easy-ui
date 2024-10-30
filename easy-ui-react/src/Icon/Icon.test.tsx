import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import { render, screen } from "@testing-library/react";
import React, { ComponentProps } from "react";
import {
  getResponsiveDesignToken,
  getComponentThemeToken,
} from "../utilities/css";
import { Icon } from "./Icon";

describe("<Icon />", () => {
  it("should render a decorative icon", () => {
    render(<Icon symbol={CheckCircleIcon} />);
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should render an informative icon", () => {
    render(
      <Icon
        symbol={CheckCircleIcon}
        accessibilityLabel="View your created items"
      />,
    );
    expect(screen.getByRole("img", { hidden: false })).toBeInTheDocument();
    expect(screen.getByTitle("View your created items")).toBeInTheDocument();
  });

  it("should apply specified color", () => {
    render(<Icon symbol={CheckCircleIcon} color="neutral.300" />);
    const $svg = screen.getByRole("img", { hidden: true });
    expect($svg.closest("span")).toHaveStyle(
      getComponentThemeToken("icon", "color", "color", "neutral.300"),
    );
  });

  it("should apply specified size", () => {
    render(<Icon symbol={CheckCircleIcon} size="sm" />);
    const $svg = screen.getByRole("img", { hidden: true });
    expect($svg.closest("span")).toHaveStyle(
      getResponsiveDesignToken("icon", "size", "size.icon", "sm"),
    );
  });

  it("should render an image", () => {
    const CarrierLogo = (props: ComponentProps<"img">) => (
      <img src="/carrier-logo.png" {...props} />
    );
    render(<Icon symbol={CarrierLogo} accessibilityLabel="Carrier name" />);
    expect(screen.getByRole("img", { hidden: false })).toBeInTheDocument();
    expect(screen.getByTitle("Carrier name")).toBeInTheDocument();
  });
});
