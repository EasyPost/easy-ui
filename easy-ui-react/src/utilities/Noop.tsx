import { ReactElement } from "react";

/**
 * React component that simply renders its children. Useful for conditionally
 * swapping out an optional parent component.
 */
export function Noop({ children }: { children: ReactElement }) {
  return children;
}
