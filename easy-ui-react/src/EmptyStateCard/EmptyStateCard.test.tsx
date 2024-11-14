import React from "react";
import { screen } from "@testing-library/react";
import { EmptyStateCard } from "./EmptyStateCard";
import { Button } from "../Button";
import {
  getComponentThemeToken,
  getResponsiveDesignToken,
  getComponentToken,
} from "../utilities/css";
import {
  render,
  mockGetComputedStyle,
  silenceConsoleError,
  userClick,
} from "../utilities/test";

describe("<EmptyStateCard />", () => {
  let restoreGetComputedStyle: () => void;

  beforeEach(() => {
    restoreGetComputedStyle = mockGetComputedStyle();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    restoreGetComputedStyle();
  });

  it("should render header, body, and action sections", () => {
    render(
      <EmptyStateCard>
        <EmptyStateCard.Header>
          <EmptyStateCard.HeaderText>Header text</EmptyStateCard.HeaderText>
        </EmptyStateCard.Header>
        <EmptyStateCard.Body>
          <EmptyStateCard.BodyText>Body text</EmptyStateCard.BodyText>
        </EmptyStateCard.Body>
        <EmptyStateCard.Action>
          <Button>Butto1n</Button>
        </EmptyStateCard.Action>
      </EmptyStateCard>,
    );
    expect(screen.getByText(/Header text/i).parentElement).toBeInTheDocument();
    expect(screen.getByText(/Body text/i).parentElement).toBeInTheDocument();
    expect(screen.getByRole("button").parentElement).toBeInTheDocument();
  });

  it("should throw an error when a content section is missing", () => {
    const restoreConsoleError = silenceConsoleError();
    expect(() =>
      render(
        <EmptyStateCard>
          <EmptyStateCard.Header>
            <EmptyStateCard.HeaderText>Header text</EmptyStateCard.HeaderText>
          </EmptyStateCard.Header>
          <EmptyStateCard.Body>
            <EmptyStateCard.BodyText>Body text</EmptyStateCard.BodyText>
          </EmptyStateCard.Body>
        </EmptyStateCard>,
      ),
    ).toThrow("EmptyStateCard must contain EmptyStateCard.Action");
    restoreConsoleError();
  });

  it("should render header and body text with default styles", () => {
    render(
      <EmptyStateCard>
        <EmptyStateCard.Header>
          <EmptyStateCard.HeaderText>Header text</EmptyStateCard.HeaderText>
        </EmptyStateCard.Header>
        <EmptyStateCard.Body>
          <EmptyStateCard.BodyText>Body text</EmptyStateCard.BodyText>
        </EmptyStateCard.Body>
        <EmptyStateCard.Action>
          <Button>Button</Button>
        </EmptyStateCard.Action>
      </EmptyStateCard>,
    );
    expect(screen.getByText(/Header text/i)).toHaveAttribute(
      "class",
      expect.stringContaining("heading5"),
    );
    expect(screen.getByText(/Header text/i)).toHaveStyle(
      getComponentThemeToken("text", "color", "color", "neutral.000"),
    );
    expect(screen.getByText(/Body text/i)).toHaveAttribute(
      "class",
      expect.stringContaining("subtitle1"),
    );
    expect(screen.getByText(/Body text/i)).toHaveStyle(
      getComponentThemeToken("text", "color", "color", "neutral.000"),
    );
  });

  it("supports a clickable button in the action section", async () => {
    const handleClick = vi.fn();
    const { user } = render(
      <EmptyStateCard>
        <EmptyStateCard.Header>
          <EmptyStateCard.HeaderText>Header text</EmptyStateCard.HeaderText>
        </EmptyStateCard.Header>
        <EmptyStateCard.Body>
          <EmptyStateCard.BodyText>Body text</EmptyStateCard.BodyText>
        </EmptyStateCard.Body>
        <EmptyStateCard.Action>
          <Button onPress={handleClick}>Button</Button>
        </EmptyStateCard.Action>
      </EmptyStateCard>,
    );
    await userClick(user, screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });

  it("supports textGap", () => {
    render(
      <EmptyStateCard textGap="5">
        <EmptyStateCard.Header>
          <EmptyStateCard.HeaderText>Header text</EmptyStateCard.HeaderText>
        </EmptyStateCard.Header>
        <EmptyStateCard.Body>
          <EmptyStateCard.BodyText>Body text</EmptyStateCard.BodyText>
        </EmptyStateCard.Body>
        <EmptyStateCard.Action>
          <Button>Button</Button>
        </EmptyStateCard.Action>
      </EmptyStateCard>,
    );
    expect(
      screen.getByText(/Header text/i).parentElement?.parentElement,
    ).toHaveStyle(
      getResponsiveDesignToken("vertical-stack", "gap", "space", "5"),
    );
  });

  it("supports blockGap", () => {
    render(
      <EmptyStateCard blockGap="1">
        <EmptyStateCard.Header>
          <EmptyStateCard.HeaderText>Header text</EmptyStateCard.HeaderText>
        </EmptyStateCard.Header>
        <EmptyStateCard.Body>
          <EmptyStateCard.BodyText>Body text</EmptyStateCard.BodyText>
        </EmptyStateCard.Body>
        <EmptyStateCard.Action>
          <Button>Button</Button>
        </EmptyStateCard.Action>
      </EmptyStateCard>,
    );
    expect(
      screen.getByText(/Body text/i).parentElement?.parentElement
        ?.parentElement,
    ).toHaveStyle(
      getResponsiveDesignToken("vertical-stack", "gap", "space", "1"),
    );
  });

  it("supports contentAlignment", () => {
    render(
      <EmptyStateCard contentAlignment="center">
        <EmptyStateCard.Header>
          <EmptyStateCard.HeaderText>Header text</EmptyStateCard.HeaderText>
        </EmptyStateCard.Header>
        <EmptyStateCard.Body>
          <EmptyStateCard.BodyText>Body text</EmptyStateCard.BodyText>
        </EmptyStateCard.Body>
        <EmptyStateCard.Action>
          <Button>Button</Button>
        </EmptyStateCard.Action>
      </EmptyStateCard>,
    );
    expect(screen.getByRole("button").parentElement?.parentElement).toHaveStyle(
      getComponentToken("vertical-stack", "inline-align", "center"),
    );
  });
});