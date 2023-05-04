import React from "react";
import { vi } from "vitest";
import { render } from "../utilities/test";
import { Menu } from "./Menu";

describe("<Menu />", () => {
  const props = {
    children: <></>,
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render", async () => {
    render(<Menu {...props} />);
    expect(true).toBe(true);
  });
});
