import { createContext, useContext } from "react";

export type TaskTrayContextValue = {
  /**
   * Whether auto-dismissal is on hold because the pointer or focus is inside
   * the tray. Without this, a row can vanish out from under a cursor on its way
   * to that row's own action.
   */
  isPaused: boolean;
  /** The tray-level dismissal delay, which a task can override. */
  autoDismissDelay: number | null;
  /** Writes a sentence into the tray's live region. */
  announce: (message: string) => void;
  /**
   * `id` of the header's collapse toggle. A row dismissing itself while it holds
   * focus hands focus there rather than dropping it on `document.body`.
   *
   * An `id` rather than a ref because `UnstyledButton` forwards its ref as
   * `Ref<null>`, so a ref typed as the element it actually receives doesn't
   * typecheck against it.
   */
  toggleId: string;
};

export const TaskTrayContext = createContext<TaskTrayContextValue | null>(null);

export function useTaskTrayContext() {
  const context = useContext(TaskTrayContext);
  if (!context) {
    throw new Error("TaskTray.Task must be rendered inside a TaskTray");
  }
  return context;
}
