import React from "react";
import { vi } from "vitest";
import { screen } from "@testing-library/react";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
} from "../utilities/test";
import { TabPanels, TabPanelsProps } from "./TabPanels";

describe("<TabPanels />", () => {
  let restoreGetComputedStyle: () => void;
  let restoreIntersectionObserver: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    restoreGetComputedStyle = mockGetComputedStyle();
    restoreIntersectionObserver = mockIntersectionObserver();
  });

  afterEach(() => {
    restoreIntersectionObserver();
    restoreGetComputedStyle();
    vi.useRealTimers();
  });

  it("should render an accessible TabPanels", () => {
    render(createDefaultTabPanels());
    expect(
      screen.getByRole("tablist", { name: "History of Rome" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(
      screen.getByText("Arma virumque cano, Troiae qui primus ab oris."),
    ).toBeInTheDocument();
  });

  it("should support controlled", async () => {
    const onSelectionChange = vi.fn();
    const { user } = render(
      createDefaultTabPanels({ selectedKey: "mar", onSelectionChange }),
    );
    expect(
      screen.getByRole("tab", { name: "Monarchy and Republic" }),
    ).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("tab", { name: "Empire" }));
    expect(onSelectionChange).toBeCalledWith("emp");
  });

  it("should support default selection", () => {
    render(createDefaultTabPanels({ defaultSelectedKey: "mar" }));
    expect(
      screen.getByRole("tab", { name: "Monarchy and Republic" }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("should support disabled list", () => {
    render(createDefaultTabPanels({ isDisabled: true }));
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-disabled", "true");
    expect(tabs[1]).toHaveAttribute("aria-disabled", "true");
    expect(tabs[2]).toHaveAttribute("aria-disabled", "true");
  });

  it("should support disabled items", () => {
    render(createDefaultTabPanels({ disabledKeys: ["emp"] }));
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).not.toHaveAttribute("aria-disabled");
    expect(tabs[1]).not.toHaveAttribute("aria-disabled");
    expect(tabs[2]).toHaveAttribute("aria-disabled", "true");
  });

  it("should support automatic keyboard activation", async () => {
    const { user } = render(createDefaultTabPanels());
    await user.tab();
    let tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{arrowright}");
    tabs = screen.getAllByRole("tab");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  });

  it("should support manual keyboard activation", async () => {
    const { user } = render(
      createDefaultTabPanels({ keyboardActivation: "manual" }),
    );
    await user.tab();
    let tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{arrowright}");
    tabs = screen.getAllByRole("tab");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");

    await user.keyboard("{enter}");
    tabs = screen.getAllByRole("tab");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  });

  it("should support custom layout", () => {
    render(
      <TabPanels aria-label="History of Rome">
        <div style={{ border: "1px solid red", padding: 8 }}>
          <div style={{ border: "1px solid orange", padding: 8 }}>
            <TabPanels.Tabs>
              <TabPanels.Item key="for">Founding of Rome</TabPanels.Item>
              <TabPanels.Item key="mar">Monarchy and Republic</TabPanels.Item>
              <TabPanels.Item key="emp">Empire</TabPanels.Item>
            </TabPanels.Tabs>
          </div>
          <div style={{ marginTop: 8, border: "1px solid green", padding: 24 }}>
            <TabPanels.Panels>
              <TabPanels.Item key="for">
                <div style={{ border: "1px solid purple", padding: 8 }}>
                  Arma virumque cano, Troiae qui primus ab oris.
                </div>
              </TabPanels.Item>
              <TabPanels.Item key="mar">
                Senatus Populusque Romanus.
              </TabPanels.Item>
              <TabPanels.Item key="emp">Alea jacta est.</TabPanels.Item>
            </TabPanels.Panels>
          </div>
        </div>
      </TabPanels>,
    );
    expect(
      screen.getByRole("tablist", { name: "History of Rome" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(
      screen.getByText("Arma virumque cano, Troiae qui primus ab oris."),
    ).toBeInTheDocument();
  });
});

function createDefaultTabPanels(props: Partial<TabPanelsProps> = {}) {
  return (
    <TabPanels aria-label="History of Rome" {...props}>
      <TabPanels.Tabs>
        <TabPanels.Item key="for">Founding of Rome</TabPanels.Item>
        <TabPanels.Item key="mar">Monarchy and Republic</TabPanels.Item>
        <TabPanels.Item key="emp">Empire</TabPanels.Item>
      </TabPanels.Tabs>
      <TabPanels.Panels>
        <TabPanels.Item key="for">
          Arma virumque cano, Troiae qui primus ab oris.
        </TabPanels.Item>
        <TabPanels.Item key="mar">Senatus Populusque Romanus.</TabPanels.Item>
        <TabPanels.Item key="emp">Alea jacta est.</TabPanels.Item>
      </TabPanels.Panels>
    </TabPanels>
  );
}
