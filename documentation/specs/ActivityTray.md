# `ActivityTray` Component Specification

## Overview

A `ActivityTray` is a persistent, non-blocking surface docked to a corner of the viewport that reports on work the app is doing in the background. Each piece of work is a row in the tray: it names the work, shows its progress, and reaches a terminal state that the user can act on. A single task is the whole tray — one row, nothing above it. Past one task a header appears, summarizing the set, and the tray collapses to that header and expands to show the individual rows.

It exists for work the user starts and then walks away from — buying 250 labels, generating a report, importing a CSV. The user should be free to navigate elsewhere and keep working while it runs, and should still be told when it finishes.

**There is a working prototype** at `easy-ui-react/src/ActivityTray/`, in Storybook under `Prototypes/ActivityTray`. It has no `index.ts`, so it is not an entry point of the published package and nothing can import it yet. Where the prototype and this document disagreed, the prototype won and this document was corrected; the places where it fell short of the spec are called out as such.

### What this is not

This component is frequently confused with a toast, so it is worth being precise about the difference. Easy UI already ships `Notification`, which covers toasts and alerts.

|                     | `Notification` (toast)           | `ActivityTray`                                   |
| ------------------- | -------------------------------- | ------------------------------------------------ |
| Subject             | A message                        | A tracked entity with a lifecycle                |
| Lifetime            | 4000ms, then gone                | Minutes; ends when the work ends                 |
| Content over time   | Fixed                            | Changes continuously as progress advances        |
| Count               | One at a time                    | Several at once, stacked and aggregated          |
| Interactive         | No                               | Yes — expand, cancel, retry, view                |
| Survives navigation | Irrelevant, it is already gone   | Required                                         |
| ARIA                | `role="status"` / `role="alert"` | Named landmark region, plus a narrow live region |

A toast is the right tool for _"we've started buying your labels."_ A `ActivityTray` is the right tool for _"we are 127 of 250 labels into buying your labels, and here's the button to stop."_ Many flows want both: a toast to confirm the action registered, and a tray row to carry the work.

### On naming

There is no industry-standard name for this pattern, which is why it is hard to search for. The pattern is common but most design systems have not formalized it, so implementations are named ad hoc:

- Google Drive calls its version the **upload status panel**; it is the canonical web example.
- Chrome ships the **download bubble** (formerly the download shelf).
- Salesforce Lightning has the **Utility Bar**, a docked strip of persistent panels — the closest thing to a formal design-system treatment.
- Desktop OS literature calls the general idea **background task progress feedback**, surfaced in a **status tray** or **activity center**.
- Slack's in-progress workflow indicator, the prompt for this spec, is not publicly named.

The terms that do get used in design-system writing are **activity tray**, **task tray**, **progress tray**, and **activity center**. None of them is dominant.

Material's **Snackbar** ([MUI](https://mui.com/material-ui/react-snackbar/)) is _not_ this pattern, despite the visual resemblance. Snackbar is Material's name for a toast: a single transient message, corner-anchored, auto-dismissing, with at most one action. It shares a position on screen and nothing else. Building this on top of a snackbar leads to a snackbar that never dismisses, stacks, and contains live-updating content — at which point every property that makes a snackbar a snackbar has been overridden.

This spec settles on **`ActivityTray`**. "Tray" carries the three structural facts that matter — it docks to an edge, it holds several items, and it collapses — and "activity" names what is in it without borrowing a word that product language may already have spoken for. "Task" survives one level down, as `ActivityTray.Task`, where it describes a single unit of work rather than the surface holding them. Alternatives considered:

| Name              | Assessment                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `TaskTray`        | What this spec originally proposed. More concrete about what a row is, but "task" is the riskier word to claim at the component level |
| `ProgressTray`    | Over-indexes on the progress bar; a queued or failed task has no progress                                                             |
| `BackgroundTasks` | Accurate but names the data, not the UI; reads like a hook or a page                                                                  |
| `TaskMonitor`     | Suggests an admin/ops surface                                                                                                         |
| `Snackbar`        | Actively misleading, see above                                                                                                        |

The cost of "activity" is that it can read as an audit log or an activity feed, which is a different component — a historical list rather than work in flight. What keeps the two apart is behavior the tray already has: the header counts what is running rather than what has happened, finished rows retire themselves, and there is no scrollback. An activity _log_ would keep everything; this keeps only what is live.

### Use Cases

- **Bulk label purchase.** The user selects 250 shipments and buys. The tray reports `127 of 250`, offers Cancel, and on completion reports `247 bought, 3 failed` with a link to the failures.
- **Report or export generation.** Indeterminate for most of its life, terminal state carries a download link.
- **CSV / address book import.** Determinate, long-running, partial failure is the common outcome.
- **Batch creation and manifest generation.** Server-side work the user kicks off and returns to later.
- Several of the above at once, started from different pages.

### When not to use

- Work the user is waiting on right now, in place. Use `Spinner`, a skeleton, or a pending button state.
- Work that finishes in under a couple of seconds. The tray appearing and vanishing is noise; use a toast.
- Reporting the _result_ of something instantaneous. Use a toast.
- Work that must block the page. Use `Modal`.
- A historical list of everything that has ever run. That is an activity log — a page, not a tray.

### Features

- Docks to a viewport corner, defaulting to bottom-end, above app content and below `Modal`.
- A single task renders as a single row, with no header and nothing to collapse.
- Past one task, a header summarizes the set (`3 tasks running`); the tray collapses to that one line and expands to the list, and the collapsed/expanded choice is the user's and sticks.
- Holds several tasks; the expanded list caps its height and scrolls rather than growing.
- Per-task lifecycle: pending, running, and the terminal states succeeded, partial, failed, and canceled.
- Determinate (`127 of 250`) or indeterminate progress per task.
- Per-task actions — Cancel while running, Retry or View when terminal.
- Successful and canceled tasks retire themselves after a delay; partial and failed tasks stay until dismissed.
- Auto-dismissal pauses while the pointer or focus is inside the tray.
- Never takes focus, never blocks a click on the page behind it.
- Announces terminal outcomes to assistive technology once, and does not announce progress ticks.

### Risks and Challenges

- **The hard part is not the component, it is the state behind it.** "Persist across URLs" means one thing inside a single-page app and something very different across a full page load. Getting the division of responsibility wrong here produces either a component nobody can use or a design system that has opinions about polling and authentication. See [Task state ownership](#decision-task-state-ownership).
- **Accessibility of continuously changing content.** Naively wrapping the tray in `aria-live` turns a progress bar into a screen reader flooding at whatever rate the app updates. The live behavior has to be deliberately narrow.
- **It covers content.** A fixed corner element sits on top of whatever is in that corner — a floating action button, a chat widget, a sticky footer. The tray needs configurable offsets and a documented height cap, and consumers need to know it is there.
- **Stacking against `Notification`.** `Notification` renders at `z-index: 999999` and is top-anchored by default, but `notificationPlacement.offset` lets consumers move it to the bottom, where it would sit on top of the tray. This needs a documented contract rather than escalating z-index.
- **Easy UI has no linear progress primitive.** `Spinner` is radial and is the only thing available. See [Dependencies](#dependencies).
- **`Spinner` cannot be used decoratively.** Its indeterminate mode renders a `role="status"` live region, and its only label channel is `children`, which it renders as visible text. A tray with four running rows would mount four live regions, and there is no way to ask for a silent one. See [Dependencies](#dependencies).
- **Cancellation is a promise the UI cannot keep alone.** A Cancel button that does not actually stop server-side work is worse than no button. Cancel is opt-in per task and the app is responsible for honoring it.
- **Truthfulness of progress.** A determinate bar that stalls at 90% for two minutes is worse than an indeterminate one. The API should make indeterminate the easy default rather than pushing consumers toward fake percentages.

### Prior Art

Implementations of this pattern:

- [Google Drive upload status panel](https://support.google.com/drive/answer/2424368) — collapsible, stacked, per-item progress and per-item terminal state
- Chrome download bubble — aggregated pill that expands to a list
- [Salesforce Lightning Utility Bar](https://www.lightningdesignsystem.com/components/utilities/) — docked persistent panels
- GitHub Actions in-progress indicator, Vercel deployment indicator — single-item versions
- macOS and Windows taskbar progress — OS-level precedent for the same idea

Toast/snackbar components, for contrast:

- [MUI Snackbar](https://mui.com/material-ui/react-snackbar/)
- [Spectrum `<Toast />`](https://react-spectrum.adobe.com/react-spectrum/Toast.html)
- [Paste `<Toast />`](https://paste.twilio.design/components/toast)

Related guidance on progress feedback:

- [Nielsen Norman Group, _Progress Indicators Make a Slow System Less Insufferable_](https://www.nngroup.com/articles/progress-indicators/)
- [WAI-ARIA `progressbar` role](https://www.w3.org/TR/wai-aria-1.2/#progressbar)

---

## Design

Three decisions shape the API. They are recorded here because they are the substance of the proposal; the prop list follows from them.

### Decision: do not build this on `Notification`

`Notification` is the obvious place to look, and it is the wrong place. `EasyUINotificationQueue` closes the active notification before adding a new one, so exactly one notification is ever visible. Toasts carry a mandatory 4000ms timeout. The queue keys on a single `activeNotificationKey`. `Notification`'s own spec instructs consumers to keep interactive elements out of toasts and warns that `role="status"` is unsuitable for dynamically changing content.

Every one of those is correct for toasts and disqualifying here. Reworking the queue to support N concurrent, indefinitely-lived, interactive, continuously-updating items would leave a component that shares a name with toasts and no behavior. `ActivityTray` is a separate component that composes cleanly with `Notification` — a bulk action can fire a toast to confirm the click and open a tray row to carry the work.

### Decision: task state ownership

The component is **controlled and presentational**. It renders the tasks it is handed and owns nothing but its own collapsed/expanded state and its dismissal timers. The app owns the task list.

This is the decision that makes "persist across URLs" tractable, because that phrase covers two different problems:

**Within a single-page app.** Mounting `<ActivityTray />` above the router — typically next to `EasyUIProvider` — is sufficient. Route changes do not unmount it and there is nothing to persist. This is free and needs no API.

**Across a full page load, a second tab, or a different device.** The work is running on a server, so the truth about it lives on the server. Rehydrating means the app fetches in-flight jobs on mount and feeds them to the tray. Easy UI cannot do this part: it would have to decide how to poll, how often, how to authenticate, how to reconcile duplicate tabs, how long to trust a cached value, and what a job even looks like. Those are product decisions, and a design system that makes them will be wrong for the second consumer.

So the boundary is: **Easy UI owns presentation, placement, collapse, dismissal timing, and accessibility. The app owns task identity, progress, persistence, and cancellation.** A `sessionStorage` or server-rehydration recipe belongs in the documentation, not in the component.

A convenience layer for apps that do not want their own store is specified below as [phase two](#phase-two-the-imperative-layer), deliberately separated so that phase one can ship and be used without it.

### Decision: composition over a data prop

Rows are subcomponents, not objects in a `tasks` array:

```tsx
<ActivityTray>
  <ActivityTray.Task
    status="running"
    title="Buying labels"
    completed={127}
    total={250}
  >
    <ActivityTray.Action onPress={cancel}>Cancel</ActivityTray.Action>
  </ActivityTray.Task>
</ActivityTray>
```

This follows the house style — `Popover`, `Drawer`, and `Menu` all compose — and it keeps the task data model in the app where it already lives. A `tasks={[...]}` prop would force Easy UI to define a `Task` type that every consumer has to map into, and would push row actions into an awkward `actions: TaskAction[]` shape rather than letting them be Easy UI buttons.

### Visual precedent

The tray is a floating surface, and Easy UI already has a family of them. `Menu`, `Select`, and `MultiSelect` share their surface through `Menu/_mixins.scss` and `Popover` matches it as closely as `Box` allows: `color.neutral.000` background, a `shape.border_width.1` `color.neutral.300` border, `shape.border_radius.md`, `shadow.overlay`, `space.2` of horizontal padding, and `color.neutral.050` on hover. `ActivityTray` takes all of it, so the corner reads as the same library as everything else on the page rather than as a component with its own taste.

The rest of the styling follows existing precedent the same way, and the places it does are worth naming because they are the places a future contributor would otherwise re-decide:

- **Scrolling** goes through `useScrollbar(ref, "ezui-os-theme-overlay")`, the OverlayScrollbars wrapper `Menu` and `Select` use. Consistent scrollbars matter more on a fixed corner surface than anywhere else, since the tray's scrollbar sits over page content. Unlike a menu, the tray reserves the scrollbar's lane as right padding on every row and on the header: a menu row is short left-aligned text, while a task row ends in a progress counter and a dismiss button, and the handle's hit area spans the full lane — content under it is both drawn through and unclickable. The header reserves the same gutter only so its toggle lines up with the dismiss buttons below it.
- **A row's status glyph hangs from the first line** when the row is more than one line tall, which is what aligning a glyph to a heading means everywhere else in the library. A title-only row is centered instead, glyph and actions together, since there is no first line to distinguish.
- **Typography** is `subtitle2` for the header summary, `body2` for a row title, and `caption` with `color.neutral.600` for descriptions and the progress counter — 13px medium above 13px normal above 12px light, which is how the library separates a label from its content.
- **The status ring** borrows `Spinner`'s values rather than inventing its own: a `color.neutral.050` track, a 1.5px stroke, and a 1s `cubic-bezier(0.5, 0, 0.5, 1)` rotation. Two spinners that turn at different speeds in the same viewport is the kind of detail that reads as sloppiness without being attributable to anything.
- **The tray surface takes no focus ring** despite being focusable, matching `Popover`'s dialog: `tabindex="-1"` means it is only ever focused programmatically, and a ring on an element the user cannot tab to only ever looks like a mistake.

### API

```typescript
import type { ReactNode } from "react";

/**
 * A task's lifecycle stage.
 *
 * These are past-tense stages rather than the tone words used by
 * `Notification`'s `status` (`success`, `error`, `warning`). The deviation is
 * deliberate: `partial` and `canceled` have no tonal equivalent, and a task's
 * stage drives layout and dismissal behavior, not just color. The mapping to
 * Easy UI status colors is internal to the component.
 */
export type TaskStatus =
  "pending" | "running" | "succeeded" | "partial" | "failed" | "canceled";

/** Corner of the container the tray docks to. */
export type ActivityTrayPlacement =
  "bottom-end" | "bottom-start" | "top-end" | "top-start";

/**
 * Distance from the container's edges. Only the properties relevant to the
 * chosen `placement` are read.
 *
 * Shaped to match `NotificationOffset`. Both should be lifted into a shared
 * `Offset` type in `types.ts` — see open questions.
 */
export type ActivityTrayOffset = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
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
   * collapsed. Receives the number of tasks that haven't finished and the
   * total. Never called with one task, which needs no header—the row is the
   * whole tray.
   * @default (running, total) => `${running} of ${total} tasks running`
   */
  renderSummary?: (runningCount: number, totalCount: number) => ReactNode;
  /** Whether the tray is expanded (controlled). Ignored with a single task. */
  isExpanded?: boolean;
  /**
   * Whether the tray starts expanded (uncontrolled). Ignored with a single
   * task, where there's nothing to collapse.
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
  /**
   * Distance from the container's edges.
   * @default { bottom: "space.4", right: "space.4" }
   */
  offset?: ActivityTrayOffset;
  /**
   * How many task rows are visible before the expanded list scrolls. Applies
   * from the second task on; a single row is never capped.
   * @default 4
   */
  maxVisibleTasks?: number;
  /**
   * How long a `succeeded` or `canceled` task stays in the tray before
   * `onDismiss` fires, in milliseconds. `null` disables auto-dismissal.
   * Paused while the pointer or focus is inside the tray.
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

export type ActivityTrayTaskProps = {
  /**
   * Short label naming the work, e.g. "Buying 250 labels". Also names the row's
   * progress bar and its dismiss button, and is the subject of the sentence
   * announced when the task finishes — so it is a `string` rather than a
   * `ReactNode`. The prototype started with `ReactNode` and the announcement
   * forced the change: there is no way to build "Buying 250 labels finished
   * with errors." out of arbitrary children.
   */
  title: string;
  /** The task's lifecycle stage. */
  status: TaskStatus;
  /**
   * Units of work finished. With `total`, renders a determinate progress bar.
   * Without `total`, it is ignored.
   */
  completed?: number;
  /**
   * Total units of work. Omit for indeterminate progress — preferable to a
   * fabricated percentage.
   */
  total?: number;
  /**
   * The unit `completed` and `total` count, used to build the progress bar's
   * `aria-valuetext`: "127 of 250 labels".
   * @default "" (yielding "127 of 250")
   */
  unit?: string;
  /**
   * One line of detail under the title, e.g. "3 shipments failed". A `string`
   * for the same reason as `title` — it is appended to the announcement.
   */
  description?: string;
  /**
   * Called when the user dismisses the row, and when `autoDismissDelay`
   * elapses on a `succeeded` or `canceled` task. Omitting it makes the row
   * permanent, which is only appropriate for a task the app removes itself.
   */
  onDismiss?: () => void;
  /**
   * Overrides the tray's `autoDismissDelay` for this task.
   */
  autoDismissDelay?: number | null;
  /** Up to two `<ActivityTray.Action />` elements. */
  children?: ReactNode;
};

/**
 * A row action. A thin wrapper over `UnstyledButton` that applies the tray's
 * action styling; takes `href` for navigation and `onPress` for everything
 * else, matching `Button`.
 */
export type ActivityTrayActionProps = {
  children: ReactNode;
  onPress?: () => void;
  href?: string;
};
```

### Example Usage

_A single task, driven by app state:_

```tsx
import { ActivityTray } from "@easypost/easy-ui/ActivityTray";

function BulkPurchase() {
  const [purchase, setPurchase] = useState(null);

  if (!purchase) return null;

  return (
    <ActivityTray>
      <ActivityTray.Task
        title="Buying labels"
        status={purchase.status}
        completed={purchase.bought}
        total={purchase.selected}
        unit="labels"
        onDismiss={() => setPurchase(null)}
      >
        {purchase.status === "running" && (
          <ActivityTray.Action onPress={() => cancelPurchase(purchase.id)}>
            Cancel
          </ActivityTray.Action>
        )}
      </ActivityTray.Task>
    </ActivityTray>
  );
}
```

_Mounted above the router so it survives route changes:_

```tsx
import { Provider as EasyUIProvider } from "@easypost/easy-ui/Provider";
import { ActivityTray } from "@easypost/easy-ui/ActivityTray";
import { useNavigate, useHref } from "react-router";

function App({ children }) {
  const { tasks, dismiss, cancel } = useBackgroundWork();

  return (
    <EasyUIProvider navigate={useNavigate()} useHref={useHref}>
      <ActivityTray>
        {tasks.map((task) => (
          <ActivityTray.Task
            key={task.id}
            title={task.title}
            status={task.status}
            completed={task.completed}
            total={task.total}
            description={task.description}
            onDismiss={() => dismiss(task.id)}
          >
            {task.status === "running" && (
              <ActivityTray.Action onPress={() => cancel(task.id)}>
                Cancel
              </ActivityTray.Action>
            )}
            {task.status === "partial" && (
              <ActivityTray.Action href={`/batches/${task.id}/errors`}>
                View errors
              </ActivityTray.Action>
            )}
          </ActivityTray.Task>
        ))}
      </ActivityTray>
      {children}
    </EasyUIProvider>
  );
}
```

_Indeterminate work:_

```tsx
<ActivityTray.Task title="Generating January report" status="running" />
```

_Partial failure, the common bulk-purchase outcome:_

```tsx
<ActivityTray.Task
  title="Bought 247 of 250 labels"
  status="partial"
  description="3 shipments were missing a rate"
  onDismiss={dismiss}
>
  <ActivityTray.Action href="/shipments?filter=failed">
    Review
  </ActivityTray.Action>
  <ActivityTray.Action onPress={retry}>Retry 3</ActivityTray.Action>
</ActivityTray.Task>
```

_Paired with a toast, so the click gets immediate acknowledgement:_

```tsx
const notification = useNotification();

function onBuy() {
  const task = startBulkPurchase(selected);
  notification.showSuccessToast({ message: "Buying labels in the background" });
  setTasks((tasks) => [...tasks, task]);
}
```

_Docked bottom-start, clear of a sticky footer:_

```tsx
<ActivityTray
  placement="bottom-start"
  offset={{ bottom: "72px", left: "16px" }}
/>
```

_Rehydrating after a full page load — the app's job, not the tray's:_

```tsx
function useBackgroundWork() {
  const [tasks, setTasks] = useState([]);

  // In-flight work lives on the server, so the server is what gets asked. The
  // tray renders whatever this returns; it has no memory of its own.
  useEffect(() => {
    let canceled = false;
    const poll = async () => {
      const inFlight = await fetch("/api/jobs?status=active").then((r) =>
        r.json(),
      );
      if (!canceled) setTasks(inFlight);
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => {
      canceled = true;
      clearInterval(id);
    };
  }, []);

  return { tasks /* ... */ };
}
```

### Anatomy

`ActivityTray` portals into `getContainer()` — `document.body` by default — and renders a fixed-position wrapper positioned from `placement` and `offset`. The wrapper is `pointer-events: none` so it never eats a click meant for the page; the tray surface inside it restores `pointer-events: auto`. When there are no children, the whole thing renders `null`; nothing is left in the DOM.

A supplied `getContainer` is taken at its word — there's no fallback to the body when it returns `null`. Getters normally read a ref, which is `null` on the first render, and falling back would dock the tray to the viewport corner for a render and then move the portal once the ref filled in, jumping the tray across the screen.

The surface is a `role="region"` with an accessible name, making it a landmark that assistive technology can navigate to directly. This matters more here than for most components: a fixed corner element is easy to never encounter.

Inside the region:

- A **header**, present only once there's more than one task, holding `renderSummary(runningCount, totalCount)` and the collapse toggle. The toggle is a disclosure button carrying `aria-expanded` and `aria-controls` pointing at the list. A lone task is its own summary — the row names the work, shows its progress, and carries its actions — so a header would repeat the title back above a disclosure with nothing behind it. With one task there is nothing to collapse, and `isExpanded` and `defaultExpanded` do nothing.
- A **list** of `ActivityTray.Task` rows, capped at `maxVisibleTasks` rows of height and scrolling beyond that, and hidden when collapsed. The cap applies from the second row on; capping a single row could only clip it. The scroll container is a `div` wrapping the `ul` rather than the `ul` itself, because OverlayScrollbars restructures its target's children and would otherwise put a `div` between the list and its items.
- A **live region** — `aria-live="polite"`, `aria-atomic="true"`, visually hidden — that the tray owns and that stays mounted whether the tray is expanded or not.

Each `ActivityTray.Task` row renders a status affordance (a spinning ring while running, a status `Icon` when terminal), the title, an optional determinate progress bar with its counter, an optional description, up to two actions, and a dismiss button when the row is terminal and `onDismiss` was given. Running rows get no dismiss button — dismissing a running task would hide work that is still happening. Cancel is the action for that.

`ActivityTray` tracks which tasks it has seen and at what status, so it can detect the transition into a terminal state. That transition does two things: it writes a sentence into the live region, and it starts the `autoDismissDelay` timer for `succeeded` and `canceled`. Timers are held in a context alongside a paused flag that the surface's pointer and focus handlers drive.

### DOM Structure

```html
<!-- portaled to document.body -->
<div class="container" style="position: fixed; bottom: 16px; right: 16px">
  <div role="region" aria-label="Background tasks" tabindex="-1" class="tray">
    <!-- Only past one task; a single row stands on its own. -->
    <div class="header">
      <div class="headerStatus">
        <div aria-hidden="true" class="spinner"></div>
      </div>
      <span class="summary">2 tasks running</span>
      <button
        aria-expanded="true"
        aria-controls="activity-tray-list-:r1:"
        class="toggle"
      >
        <svg aria-hidden="true"><!-- chevron --></svg>
        <span class="visuallyHidden">Collapse background tasks</span>
      </button>
    </div>

    <div
      id="activity-tray-list-:r1:"
      class="list listCapped"
      data-overlayscrollbars-initialize
    >
      <ul class="listItems">
        <li class="task">
          <div class="status">
            <!-- decorative spinning ring; see Dependencies on `Spinner` -->
            <div aria-hidden="true" class="spinner"></div>
          </div>
          <div class="content">
            <span id="task-title-:r2:" class="title">Buying labels</span>
            <div class="progress">
              <div
                role="progressbar"
                aria-labelledby="task-title-:r2:"
                aria-valuemin="0"
                aria-valuemax="250"
                aria-valuenow="127"
                aria-valuetext="127 of 250 labels"
                class="progressTrack"
                style="--ezui-c-activity-tray-progress-fill: 50.8%"
              >
                <div class="progressFill"></div>
              </div>
              <span class="counter">127 of 250 labels</span>
            </div>
          </div>
          <div class="actions">
            <button class="action">Cancel</button>
          </div>
        </li>

        <li class="task">
          <div class="status">
            <svg aria-hidden="true"><!-- warning --></svg>
          </div>
          <div class="content">
            <span class="title">Bought 247 of 250 labels</span>
            <span class="description">3 shipments were missing a rate</span>
          </div>
          <div class="actions">
            <a href="/shipments?filter=failed" class="action">Review</a>
            <button
              class="dismiss"
              aria-label="Dismiss Bought 247 of 250 labels"
            >
              <svg aria-hidden="true"><!-- close --></svg>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <div aria-live="polite" aria-atomic="true" class="visuallyHidden">
    Bought 247 of 250 labels finished with errors. 3 shipments were missing a
    rate.
  </div>
</div>
```

Notes on the attributes above:

- The region's name comes from `aria-label`, and a named `region` is a landmark. An unnamed one is not, which is why the label has a default rather than being optional-and-absent.
- The progress bar is labelled by the row title rather than carrying its own `aria-label`, so the title is not announced twice.
- `aria-valuemax` is `total`, not `100`. `aria-valuetext` carries the human phrasing so screen readers say "127 of 250 labels" instead of "51 percent".
- An indeterminate task has no `progressbar` at all. Its status slot holds a decorative spinner, so the indeterminate state is conveyed visually and the row's title carries it in text; an empty `progressbar` with no `aria-valuenow` would add a control a screen reader user can land on and learn nothing from.
- The status slot is hidden from assistive technology in both cases. The status is already in the title, the progress bar, and the announcement, and a live region per running row is the flooding this design exists to avoid.
- The live region sits outside the tray region so collapsing the tray cannot unmount it. A live region that is added to the DOM at the same time as its content is unreliable across screen readers — it has to be present and empty beforehand.

---

## Behavior

### States and Interactions

**Task lifecycle.**

```
pending ──▶ running ──┬──▶ succeeded ──▶ auto-dismiss after autoDismissDelay
                      ├──▶ partial ─────▶ stays until dismissed
                      ├──▶ failed ──────▶ stays until dismissed
                      └──▶ canceled ────▶ auto-dismiss after autoDismissDelay
```

The tray does not drive these transitions; the app does, by re-rendering with a new `status`. The tray only reacts to them.

The asymmetry in the terminal row is the important behavioral rule: **an outcome the user needs to do something about does not disappear on a timer.** Success and cancellation are self-explanatory and retire themselves. Partial success and failure carry information — which three shipments failed — and vanishing after six seconds destroys it.

| Status      | Affordance    | Dismissible | Auto-dismisses | Color    |
| ----------- | ------------- | ----------- | -------------- | -------- |
| `pending`   | Spinning ring | No          | No             | neutral  |
| `running`   | Spinning ring | No          | No             | primary  |
| `succeeded` | Check icon    | Yes         | Yes            | positive |
| `partial`   | Warning icon  | Yes         | No             | warning  |
| `failed`    | Error icon    | Yes         | No             | negative |
| `canceled`  | Close icon    | Yes         | Yes            | neutral  |

**Tray states.**

- **Absent.** No children, nothing rendered.
- **Single.** One task, one row, no header. The row already names the work, shows its progress, and carries its actions, so there is nothing for a header to add and nothing for a disclosure to reveal.
- **Collapsed.** One-line pill: status affordance, summary text, expand toggle. Keeps the corner quiet for long-running work. Only reachable past one task.
- **Expanded.** Header plus the list. The default, so a task the user just started is visible without a click.

Expansion is uncontrolled by default and `onExpandedChange` lets a consumer persist it. The component does not write to storage itself.

**Interactions.**

- Clicking the header toggle, or pressing <kbd>Enter</kbd>/<kbd>Space</kbd> on it, expands and collapses.
- <kbd>Escape</kbd> with focus inside the tray collapses it. It does not dismiss tasks — work is still running and hiding it entirely would be a lie. With a single task there is no header and nothing to collapse, so it does nothing.
- Pointer entering the tray, or focus moving into it, pauses every auto-dismiss timer. Leaving resumes them. Without this, a row can vanish out from under a cursor on its way to the Review button.
- A row whose dismiss button has focus never auto-dismisses, even after the pause is released, because that would drop focus to `document.body`. Dismissing moves focus to the tray region itself, which carries `tabindex="-1"` for the purpose. The tray is the target rather than the header toggle because the header is gone once a single task is left, and rather than the next row's dismiss button because that may not exist and may itself be about to retire. Landing on the tray also holds every remaining timer, since focus is now inside it.
- Actions with `href` navigate through Easy UI's `RouterProvider` when the app supplies one.
- Rows are not clickable as a whole. Whole-row click targets containing nested buttons are ambiguous for pointer users and outright broken for keyboard users; the affordances are the actions.

### Accessibility

The central problem is that this component's content changes constantly and most of those changes are not worth announcing. The design draws a hard line: **progress is polled, outcomes are pushed.**

**Progress is not announced.** The tray region is not a live region. Progress reaches assistive technology through `role="progressbar"`, which a screen reader reports when the user navigates to it and not otherwise. This is the entire reason the tray is a named landmark — the user can jump to it on demand and hear where things stand.

**Outcomes are announced, once.** Terminal transitions write one sentence into the tray's `aria-live="polite"` region, built from the title and description: _"Bought 247 of 250 labels. 3 shipments were missing a rate."_ Polite, so it waits for a gap rather than interrupting. Never assertive — background work finishing is not an emergency, and `role="alert"` on something the user did not just do is startling.

Simultaneous terminal transitions are coalesced into one announcement rather than racing. `aria-atomic="true"` makes the region read as a whole.

**Focus is never taken.** The tray appears, expands, and dismisses rows without moving focus. It is not a dialog: no focus trap, no focus restoration, no inert background. Focus only moves when the user's own action removes the element they were on, per the rule above.

**Keyboard.**

- The tray is in the tab order at the end of the document, following the portal. No custom arrow-key navigation: the row count is small and each row holds at most three controls, so plain tabbing is both sufficient and what users expect from a list of links and buttons. Adding a composite widget's keyboard model here would cost more than it buys.
- Tab order within the tray is the header toggle, when there is one, then rows top to bottom, then each row's actions before its dismiss button. The tray itself carries `tabindex="-1"` and is skipped, since it is a focus target only for dismissal.
- <kbd>Escape</kbd> collapses, when there is a header to collapse to.
- Being at the end of the tab order is a real cost — a keyboard user tabbing from the top of a long page will not reach the tray quickly. The landmark is the mitigation, and consumers wanting more can put a link to the tray in their app chrome.

**Visual.**

- Status is carried by icon and text, never color alone.
- Determinate progress is accompanied by its `127 of 250` counter in text, so the bar is not the only channel.
- `prefers-reduced-motion: reduce` drops the enter/exit transitions and the progress bar's width animation. The status spinner keeps turning: it is the only signal that the work has not stalled, and `Spinner` makes the same call.
- The tray caps its height at `maxVisibleTasks` rows and scrolls, so it cannot grow to cover the viewport.
- Text must not be truncated to the point of uselessness: titles wrap to two lines and then ellipsize.

**Announcement examples.**

| Transition              | Announced                                                                         |
| ----------------------- | --------------------------------------------------------------------------------- |
| `running` → `succeeded` | "Buying labels finished."                                                         |
| `running` → `partial`   | "Bought 247 of 250 labels finished with errors. 3 shipments were missing a rate." |
| `running` → `failed`    | "Buying labels failed. Carrier account is not connected."                         |
| `running` → `canceled`  | "Buying labels canceled."                                                         |
| `completed` 126 → 127   | Nothing.                                                                          |
| Task added              | Nothing. The action that started it should have fired a toast.                    |

### Security

No new surface. Titles and descriptions are strings rendered as text nodes, so no `dangerouslySetInnerHTML` path exists. `ActivityTray.Action` accepts `href`, which carries the same consumer-supplied-URL considerations as `Button` and `Menu.Item` and no additional ones.

### Performance

- Task counts are small — single digits in every use case above — so the list is not virtualized. `maxVisibleTasks` bounds the rendered height, not the rendered node count; a tray with 50 tasks renders 50 rows. Documented rather than solved, on the grounds that a product surfacing 50 concurrent background tasks has a different problem.
- Progress updates re-render the tray and its rows. Memoizing rows on their props would confine a single task's change to its own row; the prototype does not, on the grounds that a handful of rows holding a few text nodes each is not worth the memo, and a measurement should decide it rather than an assumption.
- The tray does not poll or animate on a timer of its own. The only timers are the per-task dismissal timers, cleared on unmount and on status change.
- Progress bar fill is driven by a CSS custom property. The prototype applies it to `width`, which is simple and correct; a `transform: scaleX()` would keep a fast-updating bar off the layout path entirely and is the change to make if profiling asks for it.
- The live region's content is derived during render but only written when the terminal transition is detected, so a re-render at the same status does not re-announce.

## Dependencies

No new third-party dependencies. React Aria's `useProgressBar` already ships with the package and gives the progress bar its ARIA attributes, exactly as `Spinner` uses it.

Three internal prerequisites:

**A linear progress primitive.** Easy UI has no `ProgressBar`. `Spinner` covers determinate progress radially, which does not work in a one-line row and reads poorly for `127 of 250`. Two options:

1. Add a `ProgressBar` component first and compose it. Right long-term — a linear bar is a generally useful primitive, and it is a gap in the system regardless of this component.
2. Build the bar inside `ActivityTray` and extract it later. Faster, and avoids designing a public `ProgressBar` API under pressure from a single consumer.

Recommendation is (2) for the prototype and (1) before `ActivityTray` ships publicly, so the bar's API is designed on its own terms. The prototype took (2): `ActivityTrayProgress` is private to the component.

**A decorative mode for `Spinner`.** `Spinner` is unusable as a glyph. It renders `role="status"` whenever `isIndeterminate` is set, so one per running row means several live regions in a component whose whole accessibility design is one narrow live region. Its only label channel is `children`, which it renders as visible text, so a `Spinner` with no label also logs a React Aria warning on every render — sixty-five of them across this component's test run, before the prototype stopped using it.

Either would fix it: an `aria-label` prop, which silences the warning but leaves the live region; or a flag that makes the spinner purely presentational — no `role`, no label, `aria-hidden`. The second is what this component needs, and the pattern is general: every spinner rendered beside text that already says "Loading…" has the same problem.

The prototype works around it with a private `ActivityTraySpinner`, a one-element CSS ring rather than a copy of `Spinner`'s three-arc animation. That is a duplication to delete, not to keep — it will drift from `Spinner`, and a design system with two spinners is a design system with a bug.

**A z-index token.** `z_index` currently holds `input_icon: 1`, `nav: 1000`, `drawer: 1200`, `modal: 1300`, `notification: 999999`. `ActivityTray` needs `z_index.activity_tray`. Proposed value **1250**: above `nav` and `drawer`, below `modal`.

Below `modal` is the debatable half. It means an open modal covers the tray, and the modal underlay dims it. That is the right default — a modal is a focused, blocking task and a progress bar creeping along underneath it is a distraction the user cannot act on anyway — but it does mean a user who opens a modal loses sight of running work. Flagged as an open question.

The gap between 1300 and 999999 is worth noting as pre-existing: `notification` was set far out of range rather than into the scale. Not this component's problem to fix, but it is why `ActivityTray` cannot simply be "one above notification."

### Platform Requirements

Nothing exotic. `position: fixed`, CSS custom properties, `createPortal`, and `prefers-reduced-motion`, all already used across the package. No `popover` attribute, no top layer, no container queries.

---

## Phase two: the imperative layer

Phase one requires the app to hold the task list. For apps that do not already have a store, this is friction, and `useNotification()` has trained Easy UI consumers to expect a hook. A second phase can add one without changing anything above:

```tsx
import {
  ActivityTrayProvider,
  useActivityTray,
} from "@easypost/easy-ui/ActivityTray";

function BuyButton({ shipments }) {
  const tasks = useActivityTray();

  async function onBuy() {
    const task = tasks.start({
      title: "Buying labels",
      total: shipments.length,
    });
    for await (const result of buyAll(shipments)) {
      task.advance(result.count);
    }
    task.finish({ status: "partial", description: "3 shipments failed" });
  }

  return <Button onPress={onBuy}>Buy</Button>;
}
```

`ActivityTrayProvider` holds the list in state and renders `ActivityTray` from it. The handle returned by `start()` carries `advance`, `finish`, and `cancel`, which is nicer than passing ids around.

Two reasons this is phase two rather than phase one:

- It is additive. Nothing in phase one changes, and the provider is written entirely in terms of the phase-one component. If it turns out nobody wants it, nothing is stranded.
- Persistence is still not solved by it. An in-memory provider is lost on a hard navigation, so an app needing that still rehydrates from its server. The provider would take an `onTasksChange` callback so a consumer can mirror the list wherever it likes — which is the same boundary as phase one, just with the store provided as a default.

Shipping it alongside phase one risks consumers reaching for the hook, discovering it does not survive a page load, and concluding the component does not do what it advertises.

---

## Open questions

1. **Stacking against `Modal`.** Should the tray be visible over a modal? This spec says no. A flow that opens a modal to start more background work is the case that argues yes.
2. **Collision with `Notification`.** Consumers who move notifications to the bottom via `notificationPlacement.offset` will overlap the tray. Options: document it, or have the tray read notification placement from context and offset itself. The second is more magic than it is worth, probably.
3. **Shared offset type.** `ActivityTrayOffset` duplicates `NotificationOffset`. Lift a shared `Offset` into `types.ts` as part of this work, or leave the duplication and clean it up separately?
4. **Mobile.** A corner tray on a 375px viewport either covers a lot or shrinks to nothing. Full-width bottom sheet below the `sm` breakpoint, or out of scope for the first pass?
5. **Aggregation.** `maxVisibleTasks` caps the tray's height but not its row count, so a dozen concurrent tasks is a dozen rows behind a scrollbar. The fix is grouping tasks of the same kind into one row — "Buying labels, 3 batches", with summed `completed` and `total`, which is what Google Drive does with "Uploading 12 items". Two places it could live: the app aggregates before passing tasks in (free, and today's answer), or `ActivityTray.Task` takes a `group` key and the tray does it (nicer, but the tray then owns how progress across grouped tasks is combined, and what a group with one failure in it reports). Not a nested accordion either way: a row holds one line of detail, which isn't enough to hide behind a chevron, and it would make glancing at the corner cost a click.
6. **Cancel confirmation.** Cancel is currently a plain action. Bulk purchases involve money; does cancelling a half-finished purchase of 250 labels warrant a confirmation step, and if so is that the tray's job or the app's?
7. **Link semantics for actions.** `ActivityTray.Action` with an `href` renders an `<a>` carrying `role="button"`, because `UnstyledButton` runs React Aria's `useButton()` over the anchor — the same as `Button` with an `href`. A "Review" action that navigates arguably should read as a link, but changing it here would make the tray inconsistent with every other Easy UI button. Package-wide question, inherited rather than introduced.

## Resources

- [WAI-ARIA `progressbar` role](https://www.w3.org/TR/wai-aria-1.2/#progressbar)
- [WAI-ARIA Disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- [WAI-ARIA live regions](https://www.w3.org/WAI/ARIA/apg/practices/live-regions/)
- [`Notification` specification](./Notification.md) — the component this one is most often confused with
- [`Spinner` specification](./Spinner.md) — the existing progress primitive
- [React Aria `useProgressBar`](https://react-spectrum.adobe.com/react-aria/useProgressBar.html)
