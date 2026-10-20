import { act, screen } from "@testing-library/react";
import React, { useState } from "react";
import { vi } from "vitest";
import { Key } from "react-aria-components";
import { mockGetComputedStyle, render } from "../utilities/test";
import { ComboBox, ComboBoxProps } from "./ComboBox";

type Fruit = { id: number; name: string };

const fruits: Fruit[] = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Cherry" },
];

describe("<ComboBox />", () => {
  let restoreGetComputedStyle: () => void;

  beforeEach(() => {
    restoreGetComputedStyle = mockGetComputedStyle();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    restoreGetComputedStyle();
  });

  it("should render a labeled combobox", () => {
    render(getComboBox());
    expect(screen.getByRole("combobox", { name: "Fruit" })).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should filter options as the user types", async () => {
    const { user } = render(getComboBox());
    await user.type(screen.getByRole("combobox"), "ban");
    expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Apple" }),
    ).not.toBeInTheDocument();
  });

  it("should fill the input with the selected option", async () => {
    const onSelectionChange = vi.fn();
    const { user } = render(getComboBox({ onSelectionChange }));
    await user.type(screen.getByRole("combobox"), "ch");
    await user.click(screen.getByRole("option", { name: "Cherry" }));
    expect(onSelectionChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole("combobox")).toHaveValue("Cherry");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should select the focused option with Enter", async () => {
    const onSelectionChange = vi.fn();
    const { user } = render(getComboBox({ onSelectionChange }));
    await user.type(screen.getByRole("combobox"), "a");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onSelectionChange).toHaveBeenCalledWith(1);
  });

  it("should keep free text with allowsCustomValue", async () => {
    const { user } = render(getComboBox({ allowsCustomValue: true }));
    await user.type(screen.getByRole("combobox"), "Durian");
    await user.tab();
    expect(screen.getByRole("combobox")).toHaveValue("Durian");
  });

  it("should describe the input with helper text", () => {
    render(getComboBox({ helperText: "Pick one" }));
    expect(screen.getByRole("combobox")).toHaveAccessibleDescription(
      "Pick one",
    );
  });

  it("should show error text in place of helper text when invalid", () => {
    render(
      getComboBox({
        helperText: "Pick one",
        errorText: "Required",
        validationState: "invalid",
      }),
    );
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Required");
    expect(screen.queryByText("Pick one")).not.toBeInTheDocument();
  });

  it("should mark the input as required", () => {
    render(getComboBox({ isRequired: true }));
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-required",
      "true",
    );
  });

  it("should show a loading indicator", () => {
    render(getComboBox({ isLoading: true }));
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("should render a footer that isn't an option", async () => {
    const { user } = render(
      getComboBox({
        footer: <ComboBox.FooterText>Powered by Google</ComboBox.FooterText>,
      }),
    );
    await user.type(screen.getByRole("combobox"), "a");
    expect(screen.getByText("Powered by Google")).toBeInTheDocument();
    expect(screen.getByRole("listbox")).not.toHaveTextContent(
      "Powered by Google",
    );
    expect(
      screen.queryByRole("option", { name: "Powered by Google" }),
    ).not.toBeInTheDocument();
  });

  it("should open the list when fetched options arrive after typing", async () => {
    const { user } = render(<AsyncComboBox />);
    await user.type(screen.getByRole("combobox"), "app");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
  });

  it("should not reopen the list when fetched options arrive after a selection", async () => {
    const onSelectionChange = vi.fn();
    const { user } = render(
      <AsyncComboBox onSelectionChange={onSelectionChange} />,
    );
    await user.type(screen.getByRole("combobox"), "app");
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    await user.click(screen.getByRole("option", { name: "Apple" }));
    expect(onSelectionChange).toHaveBeenCalledWith(1);
    // Selecting fills the input, which refetches.
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should not reopen the list after Escape", async () => {
    const { user } = render(<AsyncComboBox />);
    await user.type(screen.getByRole("combobox"), "app");
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

function getComboBox(props: Partial<ComboBoxProps<Fruit>> = {}) {
  return (
    <ComboBox label="Fruit" defaultItems={fruits} {...props}>
      {(item) => <ComboBox.Option id={item.id}>{item.name}</ComboBox.Option>}
    </ComboBox>
  );
}

/** Mimics a debounced fetch: options for the input arrive 250ms later. */
function AsyncComboBox({
  onSelectionChange,
}: {
  onSelectionChange?: (key: Key | null) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState<Fruit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const onInputChange = (value: string) => {
    setInputValue(value);
    clearTimeout(timeoutRef.current);
    setIsLoading(true);
    timeoutRef.current = setTimeout(() => {
      setItems(
        fruits.filter((f) =>
          f.name.toLowerCase().includes(value.toLowerCase()),
        ),
      );
      setIsLoading(false);
    }, 250);
  };

  return (
    <ComboBox
      aria-label="Fruit"
      allowsCustomValue
      inputValue={inputValue}
      onInputChange={onInputChange}
      items={items}
      isLoading={isLoading}
      onSelectionChange={onSelectionChange}
    >
      {(item) => <ComboBox.Option id={item.id}>{item.name}</ComboBox.Option>}
    </ComboBox>
  );
}
