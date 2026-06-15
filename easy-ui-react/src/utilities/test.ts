import { render as renderWithTestingLib } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { ReactElement } from "react";
import { config as reactTransitionGroupConfig } from "react-transition-group";
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
 *
 * Note: relies on the test runner's `beforeAll` global, so it must be called
 * from a vitest/jest environment that exposes globals.
 */
export function installJestCompatibleFakeTimers() {
  beforeAll(() => {
    const globalWithJest = globalThis as typeof globalThis & {
      jest?: Record<string, unknown>;
    };
    const _jest = globalWithJest.jest;
    globalWithJest.jest = {
      ...globalWithJest.jest,
      advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
    };
    return () => {
      globalWithJest.jest = _jest;
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
  const originalScrollTo = Element.prototype.scrollTo;
  Element.prototype.scrollTo = () => {};
  return () => {
    Element.prototype.scrollTo = originalScrollTo;
  };
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

export function silenceConsoleError() {
  const mock = vi.spyOn(console, "error").mockImplementation(() => vi.fn());
  return () => {
    mock.mockRestore();
  };
}

export async function userClick(user: UserEvent, element: Element) {
  await user.click(element);
}

export async function userKeyboard(user: UserEvent, text: string) {
  await user.keyboard(text);
}

export async function userHover(user: UserEvent, element: Element) {
  await user.hover(element);
}

export async function userTab(user: UserEvent) {
  await user.tab();
}

export async function userType(
  user: UserEvent,
  element: Element,
  text: string,
) {
  await user.type(element, text);
}

export async function selectCheckbox(user: UserEvent, el: HTMLElement) {
  await userClick(user, el);
}

export function disableReactTransitionGroup() {
  reactTransitionGroupConfig.disabled = true;
}

export function enableReactTransitionGroup() {
  reactTransitionGroupConfig.disabled = false;
}
