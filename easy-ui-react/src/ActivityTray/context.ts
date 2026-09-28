import { createContext, useContext } from "react";

export type ActivityTrayContextValue = {
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
   * Moves focus to the tray itself. A row dismissing itself while it holds focus
   * calls this rather than dropping focus on `document.body`. The tray is the
   * target because it's the one element that outlives every row—the header is
   * gone once a single task is left.
   */
  focusTray: () => void;
};

export const ActivityTrayContext =
  createContext<ActivityTrayContextValue | null>(null);

export function useActivityTrayContext() {
  const context = useContext(ActivityTrayContext);
  if (!context) {
    throw new Error(
      "ActivityTray.Task must be rendered inside an ActivityTray",
    );
  }
  return context;
}
