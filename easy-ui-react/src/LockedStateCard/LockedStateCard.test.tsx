import React from "react";
import { screen } from "@testing-library/react";
import { LockedStateCard } from "./LockedStateCard";
import { Button } from "../Button";
import {
  getComponentThemeToken,
  getResponsiveDesignToken,
  getComponentToken,
} from "../utilities/css";
import { render, mockGetComputedStyle, userClick } from "../utilities/test";

describe("<LockedStateCard />", () => {
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
      <LockedStateCard>
        <LockedStateCard.Section>
          <LockedStateCard.TextGroup>
            <LockedStateCard.HeaderText>Header text</LockedStateCard.HeaderText>
            <LockedStateCard.BodyText>Body text</LockedStateCard.BodyText>
          </LockedStateCard.TextGroup>
          <LockedStateCard.ActionGroup>
            <Button>Button</Button>
          </LockedStateCard.ActionGroup>
        </LockedStateCard.Section>
      </LockedStateCard>,
    );
    expect(screen.getByText(/Header text/i).parentElement).toBeInTheDocument();
    expect(screen.getByText(/Body text/i).parentElement).toBeInTheDocument();
    expect(screen.getByRole("button").parentElement).toBeInTheDocument();
  });

  it("should render header and body text with default styles", () => {
    render(
      <LockedStateCard>
        <LockedStateCard.Section>
          <LockedStateCard.TextGroup>
            <LockedStateCard.HeaderText>Header text</LockedStateCard.HeaderText>
            <LockedStateCard.BodyText>Body text</LockedStateCard.BodyText>
          </LockedStateCard.TextGroup>
          <LockedStateCard.ActionGroup>
            <Button>Button</Button>
          </LockedStateCard.ActionGroup>
        </LockedStateCard.Section>
      </LockedStateCard>,
    );
    expect(screen.getByText(/Header text/i)).toHaveAttribute(
      "class",
      expect.stringContaining("subtitle1"),
    );
    expect(screen.getByText(/Header text/i)).toHaveStyle(
      getComponentThemeToken("text", "color", "color", "neutral.900"),
    );
    expect(screen.getByText(/Body text/i)).toHaveAttribute(
      "class",
      expect.stringContaining("body2"),
    );
    expect(screen.getByText(/Body text/i)).toHaveStyle(
      getComponentThemeToken("text", "color", "color", "neutral.900"),
    );
  });

  it("supports a clickable button in the action section", async () => {
    const handleClick = vi.fn();
    const { user } = render(
      <LockedStateCard>
        <LockedStateCard.Section>
          <LockedStateCard.TextGroup>
            <LockedStateCard.HeaderText>Header text</LockedStateCard.HeaderText>
            <LockedStateCard.BodyText>Body text</LockedStateCard.BodyText>
          </LockedStateCard.TextGroup>
          <LockedStateCard.ActionGroup>
            <Button onPress={handleClick}>Button</Button>
          </LockedStateCard.ActionGroup>
        </LockedStateCard.Section>
      </LockedStateCard>,
    );
    await userClick(user, screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });

  it("supports gap for text group", () => {
    render(
      <LockedStateCard>
        <LockedStateCard.Section>
          <LockedStateCard.TextGroup gap="4">
            <LockedStateCard.HeaderText>Header text</LockedStateCard.HeaderText>
            <LockedStateCard.BodyText>Body text</LockedStateCard.BodyText>
          </LockedStateCard.TextGroup>
          <LockedStateCard.ActionGroup>
            <Button>Button</Button>
          </LockedStateCard.ActionGroup>
        </LockedStateCard.Section>
      </LockedStateCard>,
    );
    expect(screen.getByText(/Header text/i).parentElement).toHaveStyle(
      getResponsiveDesignToken("vertical-stack", "gap", "space", "4"),
    );
  });

  it("supports gap for action group", () => {
    render(
      <LockedStateCard>
        <LockedStateCard.Section>
          <LockedStateCard.TextGroup>
            <LockedStateCard.HeaderText>Header text</LockedStateCard.HeaderText>
            <LockedStateCard.BodyText>Body text</LockedStateCard.BodyText>
          </LockedStateCard.TextGroup>
          <LockedStateCard.ActionGroup gap="3">
            <Button>Button</Button>
          </LockedStateCard.ActionGroup>
        </LockedStateCard.Section>
      </LockedStateCard>,
    );
    expect(
      screen.getByText(/Button/i).parentElement?.parentElement,
    ).toHaveStyle(
      getResponsiveDesignToken("horizontal-stack", "gap", "space", "3"),
    );
  });

  it("supports contentAlignment", () => {
    render(
      <LockedStateCard>
        <LockedStateCard.Section inlineAlign="center">
          <LockedStateCard.TextGroup>
            <LockedStateCard.HeaderText>Header text</LockedStateCard.HeaderText>
            <LockedStateCard.BodyText>Body text</LockedStateCard.BodyText>
          </LockedStateCard.TextGroup>
          <LockedStateCard.ActionGroup>
            <Button>Button</Button>
          </LockedStateCard.ActionGroup>
        </LockedStateCard.Section>
      </LockedStateCard>,
    );
    expect(screen.getByRole("button").parentElement?.parentElement).toHaveStyle(
      getComponentToken("vertical-stack", "inline-align", "center"),
    );
  });
});
