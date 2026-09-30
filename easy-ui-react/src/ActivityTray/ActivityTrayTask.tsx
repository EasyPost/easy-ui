import CloseIcon from "@easypost/easy-ui-icons/Close";
import React, { ReactNode, useEffect, useId, useRef } from "react";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { UnstyledButton } from "../UnstyledButton";
import { classNames, variationName } from "../utilities/css";
import { useActivityTrayContext } from "./context";
import { ActivityTrayProgress } from "./ActivityTrayProgress";
import { ActivityTraySpinner } from "./ActivityTraySpinner";
import {
  TaskStatus,
  buildAnnouncement,
  getStatusIcon,
  isTerminalStatus,
  shouldAutoDismiss,
} from "./utilities";
import styles from "./ActivityTray.module.scss";

export type ActivityTrayTaskProps = {
  /**
   * Short label naming the work, e.g. "Buying 250 labels". Also names the row's
   * progress bar and its dismiss button, and is the subject of the sentence
   * announced when the task finishes—so it's a string rather than a
   * `ReactNode`.
   */
  title: string;
  /** The task's lifecycle stage. */
  status: TaskStatus;
  /**
   * Units of work finished. Paired with `total`, renders a determinate progress
   * bar. Ignored without `total`.
   */
  completed?: number;
  /**
   * Total units of work. Omit for indeterminate progress, which is preferable
   * to a fabricated percentage—a bar stalled at 90% reads worse than one that
   * never claimed to know.
   */
  total?: number;
  /** What `completed` and `total` count, e.g. "labels". */
  unit?: string;
  /** One line of detail under the title, e.g. "3 shipments failed". */
  description?: string;
  /**
   * Called when the user dismisses the row, and when `autoDismissDelay` elapses
   * on a `succeeded` or `canceled` task. Without it the row has no dismiss
   * button and never retires itself, which only suits a task the app removes on
   * its own.
   */
  onDismiss?: () => void;
  /** Overrides the tray's `autoDismissDelay` for this task. */
  autoDismissDelay?: number | null;
  /** Up to two `<ActivityTray.Action />` elements. */
  children?: ReactNode;
};

/**
 * A single row in a `<ActivityTray />`.
 *
 * @example
 * ```tsx
 * <ActivityTray.Task
 *  title="Buying labels"
 *  status="running"
 *  completed={127}
 *  total={250}
 *  unit="labels"
 * >
 *  <ActivityTray.Action onPress={cancel}>Cancel</ActivityTray.Action>
 * </ActivityTray.Task>
 * ```
 */
export function ActivityTrayTask(props: ActivityTrayTaskProps) {
  const {
    title,
    status,
    completed,
    total,
    unit,
    description,
    onDismiss,
    autoDismissDelay: taskAutoDismissDelay,
    children,
  } = props;

  const {
    isPaused,
    autoDismissDelay: trayAutoDismissDelay,
    announce,
    focusTray,
  } = useActivityTrayContext();

  const titleId = useId();
  const isTerminal = isTerminalStatus(status);
  const statusIcon = getStatusIcon(status);

  // `undefined` means "inherit the tray's delay"; `null` means "never
  // auto-dismiss", which is why this isn't a `??`.
  const autoDismissDelay =
    taskAutoDismissDelay !== undefined
      ? taskAutoDismissDelay
      : trayAutoDismissDelay;

  // Progress belongs to work in flight. Once the task is done the row reports
  // its outcome; a bar frozen at 247/250 next to "finished with errors" is just
  // a second, worse way of saying the same thing.
  const hasProgress =
    !isTerminal &&
    typeof total === "number" &&
    total > 0 &&
    typeof completed === "number";

  // `undefined` on the first render, so a task that mounts already terminal—a
  // page reload landing on finished work—still gets announced.
  const previousStatus = useRef<TaskStatus | undefined>(undefined);
  useEffect(() => {
    const previous = previousStatus.current;
    previousStatus.current = status;
    if (previous === status) {
      return;
    }
    // Terminal-to-terminal moves aren't transitions worth repeating.
    if (isTerminalStatus(status) && !(previous && isTerminalStatus(previous))) {
      announce(buildAnnouncement(title, status, description));
    }
  }, [status, title, description, announce]);

  // Read through a ref so the timer doesn't depend on `onDismiss`'s identity.
  // Callers typically pass an inline `() => dismiss(task.id)`, and restarting
  // the delay on every render would mean a finished row never retires while a
  // sibling task keeps re-rendering the tray with progress.
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });
  const canDismiss = Boolean(onDismiss);

  useEffect(() => {
    if (!canDismiss || !shouldAutoDismiss(status) || autoDismissDelay == null) {
      return;
    }
    // Paused means the pointer or focus is somewhere in the tray. Unpausing
    // restarts the delay rather than resuming it, which errs toward giving the
    // user more time to read the row they were just looking at.
    if (isPaused) {
      return;
    }
    const timeout = window.setTimeout(
      () => onDismissRef.current?.(),
      autoDismissDelay,
    );
    return () => window.clearTimeout(timeout);
  }, [canDismiss, status, autoDismissDelay, isPaused]);

  const handleDismiss = () => {
    // This row is about to unmount with focus on its own dismiss button, which
    // would leave focus on `document.body`. The tray is the nearest thing that
    // outlives the row.
    focusTray();
    onDismiss?.();
  };

  const hasActions = Boolean(children) || Boolean(isTerminal && onDismiss);

  // Title only: the status glyph and the actions center against it instead of
  // hanging from the top of a row that has nothing below its first line.
  const isSingleLine = !hasProgress && !description;

  return (
    <li
      className={classNames(
        styles.task,
        styles[variationName("status", status)],
        isSingleLine && styles.taskSingleLine,
      )}
    >
      {/*
        Both of these hide themselves from assistive technology—an unlabeled
        `Icon` sets `aria-hidden`, and `ActivityTraySpinner` is decorative by
        construction. The status reaches a screen reader through the title, the
        progress bar, and the announcement instead.
      */}
      <div className={styles.taskStatus}>
        {statusIcon ? (
          <Icon symbol={statusIcon} size="md" />
        ) : (
          <ActivityTraySpinner size="md" />
        )}
      </div>
      <div className={styles.taskContent}>
        {/*
          `body2` against the header's `subtitle2`: the same 13px at a lighter
          weight, which is how the rest of the library separates content from
          the label above it.
        */}
        <Text id={titleId} variant="body2" breakWord>
          {title}
        </Text>
        {hasProgress && (
          <ActivityTrayProgress
            completed={completed as number}
            total={total as number}
            unit={unit}
            labelId={titleId}
          />
        )}
        {description && (
          <Text variant="caption" color="neutral.600" breakWord>
            {description}
          </Text>
        )}
      </div>
      {hasActions && (
        <div className={styles.taskActions}>
          {children}
          {/*
            Running tasks get no dismiss button. Hiding a row whose work is
            still happening tells the user it stopped; `<ActivityTray.Action />`
            with a real cancel handler is the honest version of that.
          */}
          {isTerminal && onDismiss && (
            <UnstyledButton className={styles.dismiss} onPress={handleDismiss}>
              <Text visuallyHidden>{`Dismiss ${title}`}</Text>
              <Icon symbol={CloseIcon} size="sm" />
            </UnstyledButton>
          )}
        </div>
      )}
    </li>
  );
}

ActivityTrayTask.displayName = "ActivityTray.Task";
