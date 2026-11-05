// Adds @testing-library/jest-dom's matchers (`toBeInTheDocument`, etc.) to
// Vitest's `expect` types.
//
// jest-dom ships a Vitest augmentation (`@testing-library/jest-dom/vitest`),
// but it declares `Assertion<T>` with one type parameter. Vitest 5 declares
// `Assertion<R, T>`, and TypeScript can't merge interfaces whose type
// parameters differ, so the matchers silently disappear. Vitest's supported
// extension point is `Matchers<R, T>`, which `Assertion` extends. Remove this
// file once jest-dom ships a Vitest 5–compatible augmentation.
import "vitest";
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "vitest" {
  // Must be an interface (not a type alias) to merge with Vitest's `Matchers`.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    // Unused, but merging requires the same type parameter names as Vitest's.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    T = unknown,
  > extends TestingLibraryMatchers<unknown, R> {}
}
