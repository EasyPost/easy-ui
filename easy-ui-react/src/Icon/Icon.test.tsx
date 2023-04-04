import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import { render, screen } from "@testing-library/react";
import React from "react";
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
    render(<Icon symbol={CheckCircleIcon} color="disabled" />);
    const $svg = screen.getByRole("img", { hidden: true });
    expect($svg.closest("span")).toHaveStyle(
      getComponentThemeToken("icon", "color", "color.text", "disabled"),
    );
  });

  it("should apply specified size", () => {
    render(<Icon symbol={CheckCircleIcon} size="sm" />);
    const $svg = screen.getByRole("img", { hidden: true });
    expect($svg.closest("span")).toHaveStyle(
      getResponsiveDesignToken("icon", "size", "size-icon", "sm"),
    );
  });
});
