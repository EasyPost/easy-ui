import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { Button } from "../Button";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
  userClick,
} from "../utilities/test";
import { SectionCard } from "./SectionCard";

describe("<SectionCard />", () => {
  let restoreGetComputedStyle: () => void;
  let restoreIntersectionObserver: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    restoreIntersectionObserver = mockIntersectionObserver();
    restoreGetComputedStyle = mockGetComputedStyle();
  });

  afterEach(() => {
    restoreGetComputedStyle();
    restoreIntersectionObserver();
    vi.useRealTimers();
  });

  it("should render a section card", async () => {
    const handleAction = vi.fn();

    const { user } = render(
      <SectionCard.Container>
        <div>
          <SectionCard.Area>
            <SectionCard.Header>
              <SectionCard.Title>Section Title</SectionCard.Title>
              <SectionCard.Controls>
                <div>Controls</div>
              </SectionCard.Controls>
              <SectionCard.Actions>
                <Button size="sm" onPress={handleAction}>
                  Action
                </Button>
              </SectionCard.Actions>
            </SectionCard.Header>
            <div>Content</div>
          </SectionCard.Area>
        </div>
      </SectionCard.Container>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Controls")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Section Title" }),
    ).toBeInTheDocument();

    await userClick(user, screen.getByRole("button", { name: "Action" }));

    expect(handleAction).toBeCalled();
  });
});
