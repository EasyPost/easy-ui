import React from "react";
import { screen } from "@testing-library/react";
import { EmptyStateCard } from "./EmptyStateCard";
import { Button } from "../Button";
import {
  getComponentThemeToken,
  getResponsiveDesignToken,
  getComponentToken,
} from "../utilities/css";
import { render, mockGetComputedStyle, userClick } from "../utilities/test";

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

  it("should render header, body, and action content", () => {
    render(
      <EmptyStateCard>
        <EmptyStateCard.Section>
          <EmptyStateCard.TextGroup>
            <EmptyStateCard.HeaderText>Header text</EmptyStateCard.HeaderText>
            <EmptyStateCard.BodyText>Body text</EmptyStateCard.BodyText>
          </EmptyStateCard.TextGroup>
          <EmptyStateCard.ActionGroup>
            <Button>Button</Button>
          </EmptyStateCard.ActionGroup>
        </EmptyStateCard.Section>
      </EmptyStateCard>,
    );
    expect(screen.getByText(/Header text/i).parentElement).toBeInTheDocument();
    expect(screen.getByText(/Body text/i).parentElement).toBeInTheDocument();
    expect(screen.getByRole("button").parentElement).toBeInTheDocument();
  });

  it("should render header and body text with default styles", () => {
    render(
      <EmptyStateCard>
        <EmptyStateCard.Section>
          <EmptyStateCard.TextGroup>
            <EmptyStateCard.HeaderText>Header text</EmptyStateCard.HeaderText>
            <EmptyStateCard.BodyText>Body text</EmptyStateCard.BodyText>
          </EmptyStateCard.TextGroup>
          <EmptyStateCard.ActionGroup>
            <Button>Button</Button>
          </EmptyStateCard.ActionGroup>
        </EmptyStateCard.Section>
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
        <EmptyStateCard.Section>
          <EmptyStateCard.TextGroup>
            <EmptyStateCard.HeaderText>Header text</EmptyStateCard.HeaderText>
            <EmptyStateCard.BodyText>Body text</EmptyStateCard.BodyText>
          </EmptyStateCard.TextGroup>
          <EmptyStateCard.ActionGroup>
            <Button onPress={handleClick}>Button</Button>
          </EmptyStateCard.ActionGroup>
        </EmptyStateCard.Section>
      </EmptyStateCard>,
    );
    await userClick(user, screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });

  it("supports gap for text group", () => {
    render(
      <EmptyStateCard>
        <EmptyStateCard.Section>
          <EmptyStateCard.TextGroup gap="4">
            <EmptyStateCard.HeaderText>Header text</EmptyStateCard.HeaderText>
            <EmptyStateCard.BodyText>Body text</EmptyStateCard.BodyText>
          </EmptyStateCard.TextGroup>
          <EmptyStateCard.ActionGroup>
            <Button>Button</Button>
          </EmptyStateCard.ActionGroup>
        </EmptyStateCard.Section>
      </EmptyStateCard>,
    );
    expect(screen.getByText(/Header text/i).parentElement).toHaveStyle(
      getResponsiveDesignToken("vertical-stack", "gap", "space", "4"),
    );
  });

  it("supports gap for action group", () => {
    render(
      <EmptyStateCard>
        <EmptyStateCard.Section>
          <EmptyStateCard.TextGroup>
            <EmptyStateCard.HeaderText>Header text</EmptyStateCard.HeaderText>
            <EmptyStateCard.BodyText>Body text</EmptyStateCard.BodyText>
          </EmptyStateCard.TextGroup>
          <EmptyStateCard.ActionGroup gap="3">
            <Button>Button</Button>
          </EmptyStateCard.ActionGroup>
        </EmptyStateCard.Section>
      </EmptyStateCard>,
    );
    expect(
      screen.getByText(/Button/i).parentElement?.parentElement,
    ).toHaveStyle(
      getResponsiveDesignToken("horizontal-stack", "gap", "space", "3"),
    );
  });

  it("supports contentAlignment", () => {
    render(
      <EmptyStateCard>
        <EmptyStateCard.Section inlineAlign="center">
          <EmptyStateCard.TextGroup>
            <EmptyStateCard.HeaderText>Header text</EmptyStateCard.HeaderText>
            <EmptyStateCard.BodyText>Body text</EmptyStateCard.BodyText>
          </EmptyStateCard.TextGroup>
          <EmptyStateCard.ActionGroup>
            <Button>Button</Button>
          </EmptyStateCard.ActionGroup>
        </EmptyStateCard.Section>
      </EmptyStateCard>,
    );
    expect(screen.getByRole("button").parentElement?.parentElement).toHaveStyle(
      getComponentToken("vertical-stack", "inline-align", "center"),
    );
  });
});
