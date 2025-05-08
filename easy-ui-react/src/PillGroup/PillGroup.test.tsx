import React from "react";
import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import { screen } from "@testing-library/react";
import { PillGroup, usePillListState } from "./PillGroup";
import { getComponentThemeToken } from "../utilities/css";
import { render, userClick, userTab, userKeyboard } from "../utilities/test";

describe("<PillGroup />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a group of pills", () => {
    render(
      <PillGroup label="Foobar Label">
        <PillGroup.Pill label="Foobar 12345" />
        <PillGroup.Pill label="Foobar 67890" />
        <PillGroup.Pill label="Foobar 55555" />
      </PillGroup>,
    );
    expect(
      screen.getByRole("grid", { name: "Foobar Label" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("gridcell", { name: "Foobar 12345" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("gridcell", { name: "Foobar 67890" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("gridcell", { name: "Foobar 55555" }),
    ).toBeInTheDocument();
  });

  it("should render a group of pills with icons", () => {
    render(
      <PillGroup label="Label">
        <PillGroup.Pill label="Foobaz 123" icon={LocalShippingIcon} />
        <PillGroup.Pill label="Foobaz 456" icon={LocalShippingIcon} />
      </PillGroup>,
    );
    expect(screen.getAllByRole("img", { hidden: true }).length).toBe(2);
  });

  it("should render a group of pills with buttons", () => {
    const callbackFn = vi.fn();
    render(
      <PillGroup label="Label" onRemove={callbackFn}>
        <PillGroup.Pill label="Foobaz 123" icon={LocalShippingIcon} />
        <PillGroup.Pill label="Foobaz 456" icon={LocalShippingIcon} />
      </PillGroup>,
    );
    expect(screen.getAllByRole("button").length).toBe(2);
  });

  it("supports background colors", () => {
    const callbackFn = vi.fn();
    render(
      <PillGroup label="Label" onRemove={callbackFn} background="primary.800">
        <PillGroup.Pill label="Foobaz 123" icon={LocalShippingIcon} />
        <PillGroup.Pill label="Foobaz 456" icon={LocalShippingIcon} />
      </PillGroup>,
    );
    expect(screen.getByRole("row", { name: "Foobaz 123" })).toHaveStyle(
      getComponentThemeToken("pill", "background", "color", "primary.800"),
    );
  });

  it("supports onRemove callback function", async () => {
    const callbackFn = vi.fn();
    const { user } = render(
      <PillGroup label="Label" onRemove={callbackFn}>
        <PillGroup.Pill label="Foobaz 123" icon={LocalShippingIcon} />
      </PillGroup>,
    );
    await userClick(user, screen.getByRole("button"));
    expect(callbackFn).toHaveBeenCalled();
  });

  it("supports usePillListState hook and removing a pill via mouse click", async () => {
    const { user } = render(<SimulatePillGroupRemoval />);
    // initially we should have 3
    expect(screen.getAllByRole("gridcell").length).toBe(3);
    await userClick(user, screen.getAllByRole("button")[0]);
    // now we should have 2
    expect(screen.getAllByRole("gridcell").length).toBe(2);
  });

  it("supports usePillListState hook and removing a pill via keyboard", async () => {
    const { user } = render(<SimulatePillGroupRemoval />);
    // initially we should have 3
    expect(screen.getAllByRole("gridcell").length).toBe(3);
    await userTab(user);
    await userKeyboard(user, "{delete}");
    // now we should have 2
    expect(screen.getAllByRole("gridcell").length).toBe(2);
  });
});

function SimulatePillGroupRemoval() {
  const list = usePillListState([
    { id: 1, name: "Foo 1" },
    { id: 2, name: "Foo 2" },
    { id: 3, name: "Foo 3" },
  ]);

  return (
    <PillGroup
      items={list.items}
      onRemove={(keys) => list.remove(...keys)}
      label="Foo"
    >
      {(item) => <PillGroup.Pill label={item.name} />}
    </PillGroup>
  );
}
