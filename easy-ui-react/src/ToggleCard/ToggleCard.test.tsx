import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { Text } from "../Text";
import { render, selectCheckbox } from "../utilities/test";
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
        <ToggleCard.Header aria-labelledby="myid">
          <Text id="myid">header</Text>
        </ToggleCard.Header>
        <ToggleCard.Body>body</ToggleCard.Body>
      </ToggleCard>,
    );
    expect(screen.getByText(/header/i)).toBeInTheDocument();
    expect(screen.getByText(/body/i)).toBeInTheDocument();
    expect(screen.getByRole("switch")).toBeInTheDocument();
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("should support passing children to toggle via toggleChildren", () => {
    render(
      <ToggleCard>
        <ToggleCard.Header toggleChildren={<Text id="anotherid">toggle</Text>}>
          header
        </ToggleCard.Header>
        <ToggleCard.Body>body</ToggleCard.Body>
      </ToggleCard>,
    );
    expect(screen.getByText(/toggle/i)).toHaveAttribute("id", "anotherid");
  });

  it("should support uncontrolled", async () => {
    const { user } = render(
      <ToggleCard>
        <ToggleCard.Header defaultSelected aria-labelledby="myid">
          <Text id="myid">header</Text>
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
        <ToggleCard.Header
          isSelected={false}
          onChange={handleChange}
          aria-labelledby="myid"
        >
          <Text id="myid">header</Text>
        </ToggleCard.Header>
        <ToggleCard.Body>body</ToggleCard.Body>
      </ToggleCard>,
    );
    await selectCheckbox(user, screen.getByRole("switch"));
    expect(handleChange).toBeCalled();
    expect(screen.getByRole("switch")).not.toBeChecked();
    rerender(
      <ToggleCard>
        <ToggleCard.Header
          isSelected
          onChange={handleChange}
          aria-labelledby="myid"
        >
          <Text id="myid">header</Text>
        </ToggleCard.Header>
        <ToggleCard.Body>body</ToggleCard.Body>
      </ToggleCard>,
    );
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("should support isDisabled", () => {
    render(
      <ToggleCard>
        <ToggleCard.Header isDisabled aria-labelledby="myid">
          <Text id="myid">header</Text>
        </ToggleCard.Header>
        <ToggleCard.Body>body</ToggleCard.Body>
      </ToggleCard>,
    );
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("should support isReadOnly", async () => {
    render(
      <ToggleCard>
        <ToggleCard.Header isReadOnly aria-labelledby="myid">
          <Text id="myid">header</Text>
        </ToggleCard.Header>
        <ToggleCard.Body>body</ToggleCard.Body>
      </ToggleCard>,
    );
    expect(screen.getByRole("switch")).not.toBeChecked();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-readonly", "true");
  });
});
