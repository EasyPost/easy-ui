import "@testing-library/jest-dom";
import { expect } from "vitest";
import {
  installJestCompatibleFakeTimers,
  installScrollToMock,
} from "./src/utilities/test";

// Asserts the values an element sets for CSS custom properties, e.g.
// `expect(el).toHaveCustomProperties({ "--ezui-c-box-padding": "var(--ezui-space-2)" })`.
//
// jest-dom's `toHaveStyle` compares computed values, and jsdom (31+) now
// substitutes `var()` in computed custom properties the way browsers do. Tokens
// aren't defined in tests, so `var(--ezui-…)` references compute to "". This
// checks the declared inline value instead, which is what components set, and
// falls back to the computed value for properties that aren't set inline.
expect.extend({
  toHaveCustomProperties(
    received: HTMLElement,
    expected: Record<string, string | number>,
  ) {
    const nonCustom = Object.keys(expected).filter((k) => !k.startsWith("--"));
    if (nonCustom.length) {
      throw new TypeError(
        `toHaveCustomProperties only checks custom properties; use toHaveStyle for: ${nonCustom.join(", ")}`,
      );
    }
    const computed = getComputedStyle(received);
    const actual: Record<string, string> = {};
    const wanted: Record<string, string> = {};
    for (const [prop, value] of Object.entries(expected)) {
      const inline = received.style.getPropertyValue(prop).trim();
      actual[prop] = inline || computed.getPropertyValue(prop).trim();
      wanted[prop] = String(value).trim();
    }
    const pass = this.equals(actual, wanted);
    return {
      pass,
      message: () =>
        pass
          ? `expected element not to have custom properties ${this.utils.printExpected(wanted)}`
          : `expected element to have custom properties\n\n${this.utils.diff(wanted, actual)}`,
    };
  },
});

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

installJestCompatibleFakeTimers();
installScrollToMock();
