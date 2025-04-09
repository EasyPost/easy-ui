import { screen } from "@testing-library/react";
import React from "react";
import { mockGetComputedStyle, render } from "../utilities/test";
import { PlanCard } from "./PlanCard";
import { VerticalStack } from "../VerticalStack";
import { PlanCardIllustrationBuilding04 } from "./illustrations/Building04";
import { Badge } from "../Badge";

describe("<PlanCard />", () => {
  let restoreGetComputedStyle: () => void;

  beforeEach(() => {
    restoreGetComputedStyle = mockGetComputedStyle();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    restoreGetComputedStyle();
  });

  it("should render", async () => {
    const handlePress = vi.fn();
    const { user } = render(
      <PlanCard.Button onPress={handlePress}>
        {({ isHovered }) => (
          <PlanCard
            background={isHovered ? "primary.050" : "neutral.000"}
            borderColor={isHovered ? "primary.500" : "primary.200"}
          >
            <VerticalStack gap="2">
              <PlanCard.Callout>
                <Badge block variant="primary">
                  Active Plan
                </Badge>
              </PlanCard.Callout>
              <PlanCard.Header>
                <PlanCard.Title color="primary.500">Premium</PlanCard.Title>
                <PlanCard.Price color="primary.500">$100.00</PlanCard.Price>
                <PlanCard.Caption>Monthly</PlanCard.Caption>
              </PlanCard.Header>
            </VerticalStack>
            <PlanCard.Features>
              <PlanCard.Feature>Feature 1</PlanCard.Feature>
              <PlanCard.Feature>Feature 2</PlanCard.Feature>
              <PlanCard.Feature>Feature 3</PlanCard.Feature>
              <PlanCard.Feature>Feature 4</PlanCard.Feature>
              <PlanCard.Feature>Feature 5</PlanCard.Feature>
            </PlanCard.Features>
            <PlanCard.Illustration>
              <PlanCardIllustrationBuilding04 />
            </PlanCard.Illustration>
          </PlanCard>
        )}
      </PlanCard.Button>,
    );
    expect(
      screen.getByRole("heading", { name: "Premium" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Feature 1")).toBeInTheDocument();
    await user.click(screen.getByRole("button"));
    expect(handlePress).toHaveBeenCalled();
  });
});
