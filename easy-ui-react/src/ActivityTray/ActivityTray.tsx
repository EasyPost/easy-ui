import ArrowDropDownIcon from "@easypost/easy-ui-icons/ArrowDropDown";
import ArrowDropUpIcon from "@easypost/easy-ui-icons/ArrowDropUp";
import React, {
  KeyboardEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { mergeProps, useFocusWithin, useHover } from "react-aria";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { UnstyledButton } from "../UnstyledButton";
import { classNames, getComponentToken, variationName } from "../utilities/css";
import { filterChildrenByDisplayName } from "../utilities/react";
import { useScrollbar } from "../utilities/useScrollbar";
import { ActivityTrayContext } from "./context";
import { ActivityTrayAction } from "./ActivityTrayAction";
import { ActivityTraySpinner } from "./ActivityTraySpinner";
import { ActivityTrayTask, ActivityTrayTaskProps } from "./ActivityTrayTask";
import {
  DEFAULT_ARIA_LABEL,
  DEFAULT_AUTO_DISMISS_DELAY,
  DEFAULT_MAX_VISIBLE_TASKS,
  ActivityTrayOffset,
  ActivityTrayPlacement,
  defaultRenderSummary,
  getMostSevereStatus,
  getOffsetStyle,
  getStatusIcon,
  isTerminalStatus,
} from "./utilities";
import styles from "./ActivityTray.module.scss";

// Written out rather than derived through `variationName()`, which would produce
// the hyphenated `placementBottom-end` for these values.
const PLACEMENT_CLASSES: Record<ActivityTrayPlacement, string> = {
  "bottom-end": styles.placementBottomEnd,
  "bottom-start": styles.placementBottomStart,
  "top-end": styles.placementTopEnd,
  "top-start": styles.placementTopStart,
};

export type ActivityTrayProps = {
  /** `<ActivityTray.Task />` elements. */
  children: ReactNode;
  /**
   * Accessible name for the tray's landmark region.
   * @default "Background tasks"
   */
  "aria-label"?: string;
  /**
   * Text for the header, which is also all that's shown when the tray is
   * collapsed. Receives the number of tasks that haven't finished and the total.
   * Never called with one task, which needs no header—the row is the whole tray.
   * @default (running, total) => `${running} of ${total} tasks running`
   */
  renderSummary?: (runningCount: number, totalCount: number) => ReactNode;
  /** Whether the tray is expanded (controlled). Ignored with a single task. */
  isExpanded?: boolean;
  /**
   * Whether the tray starts expanded (uncontrolled). Ignored with a single task,
   * where there's nothing to collapse.
   * @default true
   */
  defaultExpanded?: boolean;
  /** Called when the user expands or collapses the tray. */
  onExpandedChange?: (isExpanded: boolean) => void;
  /**
   * Corner the tray docks to.
   * @default "bottom-end"
   */
  placement?: ActivityTrayPlacement;
  /** Distance from the container's edges, for clearing app chrome. */
  offset?: ActivityTrayOffset;
  /**
   * Roughly how many rows are visible before the expanded list scrolls. Applies
   * from the second task on; a single row is never capped.
   * @default 4
   */
  maxVisibleTasks?: number;
  /**
   * How long a `succeeded` or `canceled` task stays before its `onDismiss`
   * fires, in milliseconds. `null` disables auto-dismissal. Held while the
   * pointer or focus is inside the tray.
   * @default 6000
   */
  autoDismissDelay?: number | null;
  /**
   * Retrieves the element the tray portals into. Nothing renders until it
   * returns an element, so a getter reading a ref is safe.
   * @default () => document.body
   */
  getContainer?: () => HTMLElement | null;
};

/**
 * A `<ActivityTray />` reports on work the app is doing in the background, from a
 * corner of the screen, without blocking anything.
 *
 * @remarks
 * Use this for work the user starts and then walks away from—buying 250 labels,
 * generating a report, importing a CSV. Each task is a row that names the work,
 * shows its progress, and ends in a state the user can act on.
 *
 * Reach for `Notification`'s toasts instead when there is a message rather than
 * a task: something happened, it's worth a sentence, and there's nothing to
 * track. The two compose well—a bulk action can fire a toast to acknowledge the
 * click and open a tray row to carry the work.
 *
 * The component is controlled. It renders the tasks it's handed and owns only
 * its collapsed state and its dismissal timers; the app owns the task list.
 * That's what makes the tray survive navigation: mount it above your router,
 * typically beside `<Provider />`, and route changes never unmount it. Carrying
 * tasks across a full page load is a different problem—the work is running on a
 * server, so the app refetches in-flight jobs on mount and feeds them back in.
 *
 * @example
 * _Simple:_
 * ```tsx
 * import { ActivityTray } from "@easypost/easy-ui/ActivityTray";
 *
 * export function Component() {
 *  return (
 *    <ActivityTray>
 *      <ActivityTray.Task
 *        title="Buying labels"
 *        status="running"
 *        completed={127}
 *        total={250}
 *        unit="labels"
 *      />
 *    </ActivityTray>
 *  );
 * }
 * ```
 *
 * @example
 * _With actions and dismissal:_
 * ```tsx
 * <ActivityTray>
 *  {tasks.map((task) => (
 *    <ActivityTray.Task
 *      key={task.id}
 *      title={task.title}
 *      status={task.status}
 *      completed={task.completed}
 *      total={task.total}
 *      description={task.description}
 *      onDismiss={() => dismiss(task.id)}
 *    >
 *      {task.status === "running" && (
 *        <ActivityTray.Action onPress={() => cancel(task.id)}>
 *          Cancel
 *        </ActivityTray.Action>
 *      )}
 *    </ActivityTray.Task>
 *  ))}
 * </ActivityTray>
 * ```
 *
 * @example
 * _Docked clear of a sticky footer:_
 * ```tsx
 * <ActivityTray placement="bottom-start" offset={{ bottom: "72px", left: "16px" }}>
 *  {children}
 * </ActivityTray>
 * ```
 */
export function ActivityTray(props: ActivityTrayProps) {
  const {
    children,
    "aria-label": ariaLabel = DEFAULT_ARIA_LABEL,
    renderSummary = defaultRenderSummary,
    isExpanded: isExpandedProp,
    defaultExpanded = true,
    onExpandedChange,
    placement = "bottom-end",
    offset,
    maxVisibleTasks = DEFAULT_MAX_VISIBLE_TASKS,
    autoDismissDelay = DEFAULT_AUTO_DISMISS_DELAY,
    getContainer,
  } = props;

  const listId = useId();

  const trayRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  useScrollbar(listRef, "ezui-os-theme-overlay");

  // A row that dismisses itself while holding focus would otherwise drop focus
  // onto `document.body`. The tray outlives any one row, and landing here keeps
  // the user inside the landmark—with the dismissal timers held, since focus is
  // now within the tray.
  const focusTray = useCallback(() => {
    trayRef.current?.focus();
  }, []);

  const [uncontrolledExpanded, setUncontrolledExpanded] =
    useState(defaultExpanded);
  const isExpanded = isExpandedProp ?? uncontrolledExpanded;

  // Hover and focus are tracked separately rather than as one flag, because
  // either can end while the other is still true—tabbing into the tray and then
  // moving the mouse away shouldn't restart the dismissal clock.
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const { hoverProps } = useHover({ onHoverChange: setIsHovered });
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: setIsFocusWithin,
  });

  const [announcement, setAnnouncement] = useState("");
  const pendingAnnouncements = useRef<string[]>([]);
  const flushTimeout = useRef<number | null>(null);

  // Two tasks finishing in the same tick would otherwise race, each overwriting
  // the other's sentence before a screen reader got to it. Collecting them and
  // flushing once produces one announcement holding both.
  const announce = useCallback((message: string) => {
    pendingAnnouncements.current.push(message);
    if (flushTimeout.current != null) {
      return;
    }
    flushTimeout.current = window.setTimeout(() => {
      flushTimeout.current = null;
      setAnnouncement(pendingAnnouncements.current.join(" "));
      pendingAnnouncements.current = [];
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (flushTimeout.current != null) {
        window.clearTimeout(flushTimeout.current);
      }
    };
  }, []);

  const context = useMemo(
    () => ({
      isPaused: isHovered || isFocusWithin,
      autoDismissDelay,
      announce,
      focusTray,
    }),
    [isHovered, isFocusWithin, autoDismissDelay, announce, focusTray],
  );

  const tasks = filterChildrenByDisplayName(
    children,
    ActivityTrayTask.displayName,
  ) as ReactElement<ActivityTrayTaskProps>[];

  const statuses = tasks.map((task) => task.props.status);
  const runningCount = statuses.filter(
    (status) => !isTerminalStatus(status),
  ).length;

  // A lone task is its own summary: the row already names the work, shows its
  // progress, and carries its actions. A header above it would repeat the title
  // back and offer a disclosure with nothing behind it, so the row is the whole
  // tray and there's nothing to collapse.
  const hasHeader = tasks.length > 1;

  const setExpanded = (nextIsExpanded: boolean) => {
    if (isExpandedProp === undefined) {
      setUncontrolledExpanded(nextIsExpanded);
    }
    onExpandedChange?.(nextIsExpanded);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !isExpanded || !hasHeader) {
      return;
    }
    // Collapse, never dismiss. The work is still running, and clearing the tray
    // on escape would tell the user it stopped.
    event.stopPropagation();
    setExpanded(false);
  };

  // Nothing to report, nothing in the DOM. The tray leaves no empty fixed
  // element sitting over the corner of the page.
  if (tasks.length === 0 || typeof document === "undefined") {
    return null;
  }

  // A supplied `getContainer` is taken at its word, with no fallback to the
  // body. Getters normally read a ref, which is null on the first render, and
  // falling back would dock the tray to the viewport corner for a render and
  // then move the portal—jumping the tray out from under the pointer as soon as
  // anything caused a re-render.
  const container = getContainer ? getContainer() : document.body;
  if (!container) {
    return null;
  }

  const summary = renderSummary(runningCount, tasks.length);

  // While anything is still running the header reports that, however the
  // finished tasks turned out. Once everything has landed it takes on the most
  // severe outcome present, so one failure isn't hidden behind nine successes.
  const headerStatus =
    runningCount > 0 ? "running" : getMostSevereStatus(statuses);
  const summaryIcon = runningCount > 0 ? null : getStatusIcon(headerStatus);

  const containerStyle = {
    ...getOffsetStyle(placement, offset),
    ...getComponentToken(
      "activity-tray",
      "max-visible-tasks",
      String(maxVisibleTasks),
    ),
  } as React.CSSProperties;

  return createPortal(
    <div
      className={classNames(styles.container, PLACEMENT_CLASSES[placement])}
      style={containerStyle}
    >
      <div
        {...mergeProps(hoverProps, focusWithinProps)}
        ref={trayRef}
        // Focusable only programmatically, as somewhere for focus to go when a
        // row dismisses itself.
        tabIndex={-1}
        // A named region is a landmark, which assistive technology can jump
        // straight to. That matters more here than for most components: a fixed
        // corner element is easy to never encounter, and this is where the
        // progress lives.
        role="region"
        aria-label={ariaLabel}
        className={styles.tray}
        onKeyDown={handleKeyDown}
      >
        {hasHeader && (
          <div className={styles.header}>
            {/*
              Decorative—see the note on the row's status slot.

              Sized to match a row's glyph rather than a size down from it. The
              summary and the titles below it are one column of text, and a
              smaller glyph here would start that column 4px further left for
              the header alone. It also means the collapsed tray, which is just
              this header, keeps a full-size status indicator.
            */}
            <div
              className={classNames(
                styles.headerStatus,
                styles[variationName("status", headerStatus)],
              )}
            >
              {summaryIcon ? (
                <Icon symbol={summaryIcon} size="md" />
              ) : (
                <ActivityTraySpinner size="md" />
              )}
            </div>
            <div className={styles.summary}>
              <Text variant="subtitle2" truncate>
                {summary}
              </Text>
            </div>
            <UnstyledButton
              className={styles.toggle}
              onPress={() => setExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-controls={listId}
            >
              <Text visuallyHidden>
                {isExpanded ? "Collapse" : "Expand"} {ariaLabel.toLowerCase()}
              </Text>
              <Icon
                symbol={isExpanded ? ArrowDropDownIcon : ArrowDropUpIcon}
                size="md"
              />
            </UnstyledButton>
          </div>
        )}
        {/*
          Rows stay mounted while collapsed—their work is still running, and so
          are their dismissal timers. `hidden` is what takes them out of the
          accessibility tree, which is what `aria-expanded` on the toggle is
          claiming.
        */}
        <div
          id={listId}
          ref={listRef}
          className={classNames(styles.list, hasHeader && styles.listCapped)}
          hidden={hasHeader && !isExpanded}
          data-overlayscrollbars-initialize
        >
          <ul className={styles.listItems}>
            <ActivityTrayContext.Provider value={context}>
              {tasks}
            </ActivityTrayContext.Provider>
          </ul>
        </div>
      </div>
      {/*
        Outside the region, so collapsing the tray can't unmount it: a live
        region added to the DOM at the same moment as its content is unreliable
        across screen readers. It holds only terminal outcomes—progress ticks
        reach assistive technology through each row's `progressbar` instead.
      */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className={styles.announcement}
      >
        {announcement}
      </div>
    </div>,
    container,
  );
}

ActivityTray.Task = ActivityTrayTask;
ActivityTray.Action = ActivityTrayAction;

ActivityTray.displayName = "ActivityTray";

export type { ActivityTrayActionProps } from "./ActivityTrayAction";
export type { ActivityTrayTaskProps } from "./ActivityTrayTask";
export type {
  ActivityTrayOffset,
  ActivityTrayPlacement,
  TaskStatus,
} from "./utilities";
