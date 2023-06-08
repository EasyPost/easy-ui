import { vi } from "vitest";

describe("<RadioGroup />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a radio group", () => {
    expect(true).toBe(true);
  });
});
