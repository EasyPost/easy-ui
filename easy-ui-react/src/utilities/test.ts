import { render as renderWithTestingLib } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";
import { vi } from "vitest";

/**
 * Render a react element for testing. Passes in vitest's timers for user-event.
 */
export function render(jsx: ReactElement) {
  return {
    user: userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    }),
    ...renderWithTestingLib(jsx),
  };
}

/**
 * Temporary workaround for bug in @testing-library/react when using
 * user-event with `vi.useFakeTimers()`
 *
 * See https://github.com/testing-library/react-testing-library/issues/1195
 */
export function installJestCompatibleFakeTimers() {
  beforeAll(() => {
    const _jest = globalThis.jest;
    globalThis.jest = {
      ...globalThis.jest,
      advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
    };
    return () => {
      globalThis.jest = _jest;
    };
  });
}

export function mockGetComputedStyle() {
  const originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (elt) => originalGetComputedStyle(elt);
  return () => {
    window.getComputedStyle = originalGetComputedStyle;
  };
}
