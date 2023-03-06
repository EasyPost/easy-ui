import React from "react";
import { render, screen } from "@testing-library/react";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import { Icon } from "./Icon";
import { getComponentToken, getResponsiveToken } from "../utilities/css";

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
    render(<Icon symbol={CheckCircleIcon} color="blue-800" />);
    const $svg = screen.getByRole("img", { hidden: true });
    expect($svg.closest("span")).toHaveStyle(
      getComponentToken("icon", "color", "color", "blue-800"),
    );
  });

  it("should apply specified size", () => {
    render(<Icon symbol={CheckCircleIcon} size="sm" />);
    const $svg = screen.getByRole("img", { hidden: true });
    expect($svg.closest("span")).toHaveStyle(
      getResponsiveToken("icon", "size", "size-icon", "sm"),
    );
  });
});
