import { screen } from "@testing-library/react";
import React from "react";
import { render } from "../utilities/test";
import { Card } from "./Card";
import {
  getComponentThemeToken,
  getResponsiveDesignToken,
} from "../utilities/css";

describe("<Card />", () => {
  it("should render card", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("should render outlined card", () => {
    render(<Card variant="outlined">Content</Card>);
    expect(screen.getByTestId("container")).toHaveAttribute(
      "class",
      expect.stringContaining("variantOutlined"),
    );
  });

  it("should render custom element", () => {
    render(
      <Card variant="outlined" as="a" href="https://easypost.com">
        Content
      </Card>,
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByTestId("container").tagName).toBe("A");
    expect(screen.getByTestId("container")).toHaveAttribute("href");
  });

  it("should render disabled", () => {
    render(
      <Card variant="outlined" isDisabled>
        Content
      </Card>,
    );
    expect(screen.getByTestId("container")).toHaveAttribute(
      "class",
      expect.stringContaining("disabled"),
    );
  });

  it("should render selected", () => {
    render(
      <Card variant="outlined" isSelected>
        Content
      </Card>,
    );
    expect(screen.getByTestId("container")).toHaveAttribute(
      "class",
      expect.stringContaining("selected"),
    );
  });

  it("should render flagged card", () => {
    render(
      <Card variant="flagged" status="danger">
        Content
      </Card>,
    );
    expect(screen.getByTestId("container")).toHaveAttribute(
      "class",
      expect.stringContaining("variantFlagged"),
    );
    expect(screen.getByTestId("container")).toHaveAttribute(
      "class",
      expect.stringContaining("statusDanger"),
    );
  });

  it("should render shadow", () => {
    render(<Card boxShadow="2">Content</Card>);
    expect(screen.getByTestId("container")).toHaveStyle(
      getComponentThemeToken("card", "box-shadow", "shadow.level", "2"),
    );
  });

  it("should render custom background keyword", () => {
    render(<Card background="primary">Content</Card>);
    expect(screen.getByTestId("area")).toHaveStyle(
      getComponentThemeToken("card-area", "background", "color", "neutral.000"),
    );
  });

  it("should render custom background token", () => {
    render(<Card background="neutral.100">Content</Card>);
    expect(screen.getByTestId("area")).toHaveStyle(
      getComponentThemeToken("card-area", "background", "color", "neutral.100"),
    );
  });

  it("should render custom padding", () => {
    render(<Card padding="1">Content</Card>);
    expect(screen.getByTestId("area")).toHaveStyle(
      getResponsiveDesignToken("card-area", "padding-top", "space", "1"),
    );
    expect(screen.getByTestId("area")).toHaveStyle(
      getResponsiveDesignToken("card-area", "padding-right", "space", "1"),
    );
    expect(screen.getByTestId("area")).toHaveStyle(
      getResponsiveDesignToken("card-area", "padding-bottom", "space", "1"),
    );
    expect(screen.getByTestId("area")).toHaveStyle(
      getResponsiveDesignToken("card-area", "padding-left", "space", "1"),
    );
  });

  it("should render composable card", () => {
    render(
      <Card.Container variant="outlined">
        <div>
          <Card.Area background="secondary">Content</Card.Area>
        </div>
      </Card.Container>,
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByTestId("container")).toHaveAttribute(
      "class",
      expect.stringContaining("variantOutlined"),
    );
    expect(screen.getByTestId("area")).toHaveStyle(
      getComponentThemeToken("card-area", "background", "color", "neutral.050"),
    );
  });
});
