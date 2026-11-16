// Types for the custom matchers registered in `vitest.setup.ts`.
import "vitest";

declare module "vitest" {
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    // Unused, but merging requires the same type parameter names as Vitest's.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    T = unknown,
  > {
    /**
     * Asserts the element's CSS custom property values: the declared inline
     * value, or the computed value when the property isn't set inline.
     */
    toHaveCustomProperties(expected: Record<string, string | number>): R;
  }
}
