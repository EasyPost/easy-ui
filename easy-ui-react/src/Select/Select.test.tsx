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
    await clickElement(user, screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("should show expand icon by default", () => {
    render(getSelect());
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should display placeholder text", () => {
    render(getSelect({ selectProps: { placeholder: "placeholder" } }));
    expect(screen.getByText("placeholder")).toBeInTheDocument();
  });

  it("should support displaying an uncontrolled default option", () => {
    render(getSelect({ selectProps: { defaultSelectedKey: "3" } }));
    expect(screen.getAllByText("Option 3")[0]).toBeInTheDocument();
  });

  it("should show with defaultOpen", async () => {
    render(getSelect({ selectProps: { defaultOpen: true } }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("should show on trigger keydown", async () => {
    const { user } = render(getSelect());
    await tabToAndEnterKeySelectTrigger(user);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("should be able to be disabled", async () => {
    render(getSelect({ selectProps: { isDisabled: true } }));
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should support helperText", () => {
    render(getSelect({ selectProps: { helperText: "Optional helper text" } }));
    expect(screen.getByText("Optional helper text")).toBeInTheDocument();
  });

  it("should support errorText", () => {
    render(
      getSelect({
        selectProps: {
          errorText: "Optional error text",
          validationState: "invalid",
        },
      }),
    );
    expect(screen.getByText("Optional error text")).toBeInTheDocument();
  });

  it("should support displaying a label with emphasis", () => {
    render(
      getSelect({
        selectProps: {
          isLabelEmphasized: true,
        },
      }),
    );
    expect(screen.getAllByText("Label")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Label")[0].tagName).toBe("STRONG");
  });

  it("should support being controlled", async () => {
    const handleSelectionChange = vi.fn();
    const { user } = render(
      getSelect({
        selectProps: { onSelectionChange: handleSelectionChange },
      }),
    );

    await clickElement(user, screen.getByRole("button"));
    await clickElement(user, screen.queryAllByRole("option")[0]);
    expect(handleSelectionChange).toHaveBeenCalledTimes(1);
  });
});

function getSelect({
  selectProps = {},
  options = [
    <Select.Option key="1">Option 1</Select.Option>,
    <Select.Option key="2">Option 2</Select.Option>,
    <Select.Option key="3">Option 3</Select.Option>,
  ],
} = {}) {
  return (
    <Select label="Label" {...selectProps}>
      {...options}
    </Select>
  );
}

async function clickElement(user: UserEvent, el: HTMLElement) {
  await act(async () => {
    await user.click(el);
    vi.runAllTimers();
  });
}

async function tabToAndEnterKeySelectTrigger(user: UserEvent) {
  await act(async () => {
    await user.tab();
    await user.keyboard("{enter}");
    vi.runAllTimers();
  });
}
