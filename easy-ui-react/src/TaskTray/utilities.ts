import CancelIcon from "@easypost/easy-ui-icons/Cancel";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import ErrorIcon from "@easypost/easy-ui-icons/Error";
import WarningIcon from "@easypost/easy-ui-icons/Warning";
import { IconSymbol } from "../types";

/**
 * A task's lifecycle stage.
 *
 * These are stages rather than the tone words `Notification` uses for its
 * `status` (`success`, `error`, `warning`). The deviation is deliberate:
 * `partial` and `canceled` have no tonal equivalent, and the stage drives
 * layout and dismissal behavior, not just color. Tone is derived from the stage
 * internally.
 */
export type TaskStatus =
  "pending" | "running" | "succeeded" | "partial" | "failed" | "canceled";

/** Corner of the container the tray docks to. */
export type TaskTrayPlacement =
  "bottom-end" | "bottom-start" | "top-end" | "top-start";

/**
 * Distance from the container's edges. Only the properties relevant to the
 * chosen `placement` are read; the rest are ignored.
 *
 * Deliberately shaped like `NotificationOffset` so the two components are
 * configured the same way. Both should eventually read from one shared type.
 */
export type TaskTrayOffset = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

export const DEFAULT_ARIA_LABEL = "Background tasks";

/**
 * How long a `succeeded` or `canceled` task lingers before it retires itself.
 *
 * Longer than a toast's 4000ms. A toast is a message the user can afford to
 * miss; this is the outcome of work they started and walked away from, so it
 * gets a little more time to be noticed on return.
 */
export const DEFAULT_AUTO_DISMISS_DELAY = 6000;

/** How many rows fit before the expanded list scrolls. */
export const DEFAULT_MAX_VISIBLE_TASKS = 4;

const TERMINAL_STATUSES: TaskStatus[] = [
  "succeeded",
  "partial",
  "failed",
  "canceled",
];

/**
 * Statuses that retire themselves on a timer.
 *
 * Success and cancellation are self-explanatory, so they clear out. `partial`
 * and `failed` carry information the user has to act on—which three shipments
 * failed—and a timer that throws that away is worse than a tray that needs
 * dismissing.
 */
const AUTO_DISMISSING_STATUSES: TaskStatus[] = ["succeeded", "canceled"];

export function isTerminalStatus(status: TaskStatus) {
  return TERMINAL_STATUSES.includes(status);
}

export function shouldAutoDismiss(status: TaskStatus) {
  return AUTO_DISMISSING_STATUSES.includes(status);
}

const STATUS_ICONS: Record<TaskStatus, IconSymbol | null> = {
  // `pending` and `running` show a `Spinner` instead of an icon.
  pending: null,
  running: null,
  succeeded: CheckCircleIcon,
  partial: WarningIcon,
  failed: ErrorIcon,
  canceled: CancelIcon,
};

export function getStatusIcon(status: TaskStatus) {
  return STATUS_ICONS[status];
}

/**
 * The status the tray's collapsed pill reports when nothing is running
 * anymore—the most severe outcome present, so a single failure isn't hidden
 * behind nine successes.
 */
const STATUS_SEVERITY: Record<TaskStatus, number> = {
  running: 0,
  pending: 0,
  canceled: 1,
  succeeded: 2,
  partial: 3,
  failed: 4,
};

export function getMostSevereStatus(statuses: TaskStatus[]) {
  return statuses.reduce(
    (worst, status) =>
      STATUS_SEVERITY[status] > STATUS_SEVERITY[worst] ? status : worst,
    statuses[0],
  );
}

const TERMINAL_PHRASES: Record<string, string> = {
  succeeded: "finished",
  partial: "finished with errors",
  failed: "failed",
  canceled: "canceled",
};

/**
 * Builds the sentence written into the tray's live region when a task reaches a
 * terminal state.
 *
 * Only terminal transitions are announced. Announcing progress would mean a
 * screen reader reading a new number every time the app advanced the count;
 * progress reaches assistive technology through `role="progressbar"` instead,
 * when the user goes looking for it.
 */
export function buildAnnouncement(
  title: string,
  status: TaskStatus,
  description?: string,
) {
  const phrase = TERMINAL_PHRASES[status];
  const sentence = phrase ? `${title} ${phrase}.` : `${title}.`;
  if (!description) {
    return sentence;
  }
  const punctuated = /[.!?]$/.test(description)
    ? description
    : `${description}.`;
  return `${sentence} ${punctuated}`;
}

/**
 * Narrows the `offset` prop to the two sides the chosen corner actually sits
 * against, so an offset written for one placement doesn't stretch the tray
 * across the viewport when the placement changes.
 *
 * The `start`/`end` in a placement is mapped to `left`/`right` for LTR. Full RTL
 * support wants logical properties throughout, including in the offset type,
 * which `NotificationOffset` doesn't have either—see the spec's open questions.
 */
export function getOffsetStyle(
  placement: TaskTrayPlacement,
  offset?: TaskTrayOffset,
) {
  if (!offset) {
    return {};
  }
  const [block, inline] = placement.split("-");
  const blockSide = block === "top" ? "top" : "bottom";
  const inlineSide = inline === "start" ? "left" : "right";
  return { [blockSide]: offset[blockSide], [inlineSide]: offset[inlineSide] };
}

export function defaultRenderSummary(
  runningCount: number,
  totalCount: number,
): string {
  if (runningCount === 0) {
    return `${totalCount} ${pluralize("task", totalCount)} finished`;
  }
  if (runningCount === totalCount) {
    return `${runningCount} ${pluralize("task", runningCount)} running`;
  }
  return `${runningCount} of ${totalCount} tasks running`;
}

function pluralize(word: string, count: number) {
  return count === 1 ? word : `${word}s`;
}
