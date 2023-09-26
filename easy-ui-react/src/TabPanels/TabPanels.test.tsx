import React from "react";
import { vi } from "vitest";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
} from "../utilities/test";

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
    render(<div>Test</div>);
  });
});
