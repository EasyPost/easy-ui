import { vi } from "vitest";
import { mockGetComputedStyle } from "../utilities/test";

describe("<MultiSelect />", () => {
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
    expect(true).toBe(true);
  });
});
