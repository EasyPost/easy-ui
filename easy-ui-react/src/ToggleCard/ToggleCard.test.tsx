import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { Toggle } from "../Toggle";
import { Text } from "../Text";
import { render, silenceConsoleError, selectCheckbox } from "../utilities/test";
import { ToggleCard } from "./ToggleCard";

describe("<ToggleCard />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a toggle with content in header and body", () => {
    render(
      <ToggleCard>
        <ToggleCard.Header>
          <Toggle aria-labelledby="some id" />
          <Text id="some id" variant="subtitle1" color="primary.900">
            header
          </Text>
        </ToggleCard.Header>
        <ToggleCard.Body>body</ToggleCard.Body>
      </ToggleCard>,
    );
    expect(screen.getByText(/header/i)).toBeInTheDocument();
    expect(screen.getByText(/body/i)).toBeInTheDocument();
    expect(screen.getByRole("switch")).toBeInTheDocument();
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("should throw an error when Toggle is missing", () => {
    const restoreConsoleError = silenceConsoleError();
    expect(() =>
      render(
        <ToggleCard>
          <ToggleCard.Header>
            <Text id="some id" variant="subtitle1" color="primary.900">
              header
            </Text>
          </ToggleCard.Header>
          <ToggleCard.Body>body</ToggleCard.Body>
        </ToggleCard>,
      ),
    ).toThrow("ToggleCard.Header must contain Toggle");
    restoreConsoleError();
  });

  it("should support uncontrolled", async () => {
    const { user } = render(
      <ToggleCard>
        <ToggleCard.Header>
          <Toggle aria-labelledby="some id" defaultSelected />
          <Text id="some id" variant="subtitle1" color="primary.900">
            header
          </Text>
        </ToggleCard.Header>
        <ToggleCard.Body>body</ToggleCard.Body>
      </ToggleCard>,
    );
    expect(screen.getByRole("switch")).toBeChecked();
    await selectCheckbox(user, screen.getByRole("switch"));
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("should support controlled", async () => {
    const handleChange = vi.fn();
    const { user, rerender } = render(
      <ToggleCard>
        <ToggleCard.Header>
          <Toggle
            aria-labelledby="some id"
            isSelected={false}
            onChange={handleChange}
          />
          <Text id="some id" variant="subtitle1" color="primary.900">
            header
          </Text>
        </ToggleCard.Header>
        <ToggleCard.Body>body</ToggleCard.Body>
      </ToggleCard>,
    );
    await selectCheckbox(user, screen.getByRole("switch"));
    expect(handleChange).toBeCalled();
    expect(screen.getByRole("switch")).not.toBeChecked();
    rerender(
      <ToggleCard>
        <ToggleCard.Header>
          <Toggle
            aria-labelledby="some id"
            isSelected
            onChange={handleChange}
          />
          <Text id="some id" variant="subtitle1" color="primary.900">
            header
          </Text>
        </ToggleCard.Header>
        <ToggleCard.Body>body</ToggleCard.Body>
      </ToggleCard>,
    );
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("should support isDisabled", () => {
    render(
      <ToggleCard>
        <ToggleCard.Header>
          <Toggle aria-labelledby="some id" isDisabled />
          <Text id="some id" variant="subtitle1" color="primary.900">
            header
          </Text>
        </ToggleCard.Header>
        <ToggleCard.Body>body</ToggleCard.Body>
      </ToggleCard>,
    );
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("should support isReadOnly", async () => {
    render(
      <ToggleCard>
        <ToggleCard.Header>
          <Toggle aria-labelledby="some id" isReadOnly />
          <Text id="some id" variant="subtitle1" color="primary.900">
            header
          </Text>
        </ToggleCard.Header>
        <ToggleCard.Body>body</ToggleCard.Body>
      </ToggleCard>,
    );
    expect(screen.getByRole("switch")).not.toBeChecked();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-readonly", "true");
  });
});
