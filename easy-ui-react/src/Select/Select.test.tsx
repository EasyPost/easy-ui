import { act, screen } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import React from "react";
import { vi } from "vitest";
import { mockGetComputedStyle, render } from "../utilities/test";
import { Select } from "./Select";

describe("<Select />", () => {
  let restoreGetComputedStyle: () => void;

  beforeEach(() => {
    restoreGetComputedStyle = mockGetComputedStyle();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    restoreGetComputedStyle();
  });

  it("should show on trigger click", async () => {
    const { user } = render(getSelect());
    await clickSelectTrigger(user, screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });
});

function getSelect({
  selectProps = { label: "Label" },
  options = [
    <Select.Option key="1">1</Select.Option>,
    <Select.Option key="2">2</Select.Option>,
    <Select.Option key="3">3</Select.Option>,
  ],
} = {}) {
  return <Select {...selectProps}>{...options}</Select>;
}

async function clickSelectTrigger(user: UserEvent, el: HTMLElement) {
  await act(async () => {
    await user.click(el);
    vi.runAllTimers();
  });
}
