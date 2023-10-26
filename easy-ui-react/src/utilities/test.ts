import { render as renderWithTestingLib } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";
import { vi } from "vitest";

declare global {
  // eslint-disable-next-line no-var
  var jest: object;
}

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

export function mockIntersectionObserver() {
  const originalIntersectionObserver = window.IntersectionObserver;
  window.IntersectionObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })) as unknown as typeof window.IntersectionObserver;
  return () => {
    window.IntersectionObserver = originalIntersectionObserver;
  };
}

export function installScrollToMock() {
  Element.prototype.scrollTo = () => {};
}

export function mockMatchMedia({
  getMatches,
}: {
  getMatches: (query: string) => boolean;
}) {
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: getMatches(query),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  return () => {
    window.matchMedia = originalMatchMedia;
  };
}
