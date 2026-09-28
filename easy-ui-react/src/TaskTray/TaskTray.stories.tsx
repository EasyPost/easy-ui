import { Meta, StoryObj } from "@storybook/react-vite";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { action } from "storybook/actions";
import { Button } from "../Button";
import { Card } from "../Card";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import { useNotification } from "../Notification";
import { FakeClientSideRouter } from "../utilities/storybook";
import { TaskTray, TaskTrayProps } from "./TaskTray";
import { TaskStatus } from "./utilities";

type Story = StoryObj<typeof TaskTray>;

const meta: Meta<typeof TaskTray> = {
  // Under `Prototypes` rather than `Components`: this is the working sketch for
  // documentation/specs/TaskTray.md, and it has no `index.ts`, so it isn't a
  // published entry point of `@easypost/easy-ui`.
  title: "Prototypes/TaskTray",
  component: TaskTray,
  parameters: {
    controls: { exclude: ["children", "onExpandedChange", "getContainer"] },
  },
};

export default meta;

export const Simple: Story = {
  render: (args: TaskTrayProps) => (
    <StoryFrame>
      {(getContainer) => (
        <TaskTray {...args} getContainer={getContainer}>
          <TaskTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
            unit="labels"
          >
            <TaskTray.Action onPress={action("Cancel")}>Cancel</TaskTray.Action>
          </TaskTray.Task>
        </TaskTray>
      )}
    </StoryFrame>
  ),
};

/**
 * The whole point of the component, end to end. Start a purchase and keep
 * clicking around the page while it runs—nothing is blocked, and the outcome is
 * waiting when you come back to it.
 */
export const BulkPurchase: Story = {
  render: (args: TaskTrayProps) => <BulkPurchaseStory {...args} />,
};

/**
 * Omit `total` when the app can't honestly say how far along the work is. An
 * indeterminate row is better than a bar that sticks at 90%.
 */
export const Indeterminate: Story = {
  render: (args: TaskTrayProps) => (
    <StoryFrame>
      {(getContainer) => (
        <TaskTray {...args} getContainer={getContainer}>
          <TaskTray.Task title="Generating January report" status="running" />
        </TaskTray>
      )}
    </StoryFrame>
  ),
};

/**
 * `succeeded` and `canceled` retire themselves on a timer; `partial` and
 * `failed` stay until the user dismisses them, because they carry information
 * that vanishing would destroy. `autoDismissDelay={null}` is set here so the
 * finished rows stick around to be looked at.
 */
export const Statuses: Story = {
  render: (args: TaskTrayProps) => (
    <StoryFrame height={440}>
      {(getContainer) => (
        <TaskTray
          {...args}
          getContainer={getContainer}
          autoDismissDelay={null}
          maxVisibleTasks={6}
        >
          <TaskTray.Task title="Queued import" status="pending" />
          <TaskTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
            unit="labels"
          >
            <TaskTray.Action onPress={action("Cancel")}>Cancel</TaskTray.Action>
          </TaskTray.Task>
          <TaskTray.Task
            title="Bought 40 labels"
            status="succeeded"
            onDismiss={action("Dismiss")}
          />
          <TaskTray.Task
            title="Bought 247 of 250 labels"
            status="partial"
            description="3 shipments were missing a rate"
            onDismiss={action("Dismiss")}
          >
            <TaskTray.Action href="/shipments">Review</TaskTray.Action>
          </TaskTray.Task>
          <TaskTray.Task
            title="January report"
            status="failed"
            description="The report timed out"
            onDismiss={action("Dismiss")}
          >
            <TaskTray.Action onPress={action("Retry")}>Retry</TaskTray.Action>
          </TaskTray.Task>
          <TaskTray.Task
            title="Address import"
            status="canceled"
            onDismiss={action("Dismiss")}
          />
        </TaskTray>
      )}
    </StoryFrame>
  ),
};

/**
 * Past one task the header counts instead of naming, and the list scrolls once
 * it passes `maxVisibleTasks`.
 */
export const MultipleTasks: Story = {
  render: (args: TaskTrayProps) => (
    <StoryFrame>
      {(getContainer) => (
        <TaskTray {...args} getContainer={getContainer} maxVisibleTasks={3}>
          <TaskTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
            unit="labels"
          />
          <TaskTray.Task
            title="Importing addresses"
            status="running"
            completed={12}
            total={900}
            unit="rows"
          />
          <TaskTray.Task title="Generating manifest" status="running" />
          <TaskTray.Task
            title="Generating January report"
            status="running"
            completed={3}
            total={4}
            unit="steps"
          />
        </TaskTray>
      )}
    </StoryFrame>
  ),
};

/**
 * A dozen concurrent tasks, to show what the height cap buys. The tray holds at
 * `maxVisibleTasks` rows and scrolls; it never grows to cover the page.
 *
 * It's still a lot of corner. Collapsing is the honest answer at this volume,
 * and aggregating tasks of the same kind into one row—"Buying labels, 3
 * batches"—is the open question in the spec. Nesting a second disclosure inside
 * each row is not: a row holds one line of detail, which isn't enough to hide
 * behind a chevron.
 */
export const ManyTasks: Story = {
  render: (args: TaskTrayProps) => <ManyTasksStory {...args} />,
};

/**
 * Collapsed, the tray is one line. Useful as a default for work measured in
 * minutes, where the user doesn't need the detail in front of them the whole
 * time.
 */
export const Collapsed: Story = {
  render: (args: TaskTrayProps) => (
    <StoryFrame>
      {(getContainer) => (
        <TaskTray {...args} getContainer={getContainer} defaultExpanded={false}>
          <TaskTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
            unit="labels"
          />
          <TaskTray.Task title="Generating manifest" status="running" />
        </TaskTray>
      )}
    </StoryFrame>
  ),
};

/**
 * Surviving navigation is a matter of where the tray is mounted, not a feature
 * of the component. Here it sits outside the routed content, so switching pages
 * leaves it alone. Rendering it inside a page would tear it down on every
 * navigation.
 *
 * Carrying tasks across a full page load is a different problem, and not one the
 * tray can solve: the work is on a server, so the app refetches in-flight jobs
 * on mount and feeds them back in.
 */
export const PersistsAcrossRoutes: Story = {
  render: (args: TaskTrayProps) => <PersistsAcrossRoutesStory {...args} />,
};

/**
 * A toast acknowledges the click; the tray carries the work. They answer
 * different questions and are often both right.
 */
export const WithToast: Story = {
  render: (args: TaskTrayProps) => <WithToastStory {...args} />,
};

// --- story helpers -------------------------------------------------------

type StoryFrameProps = {
  /** Receives the frame element for the tray's `getContainer`. */
  children: (getContainer: () => HTMLElement | null) => React.ReactNode;
  /** Page copy above the frame, when a story wants its own. */
  intro?: React.ReactNode;
  /** @default 280 */
  height?: number;
};

/**
 * A bounded stand-in for an app's frame.
 *
 * @remarks
 * The tray is `position: fixed`, so left alone every story on this page would
 * dock to the same corner of the real viewport and pile up on top of the others.
 * Two things fix that, and both are here for the docs' benefit rather than being
 * anything an app needs:
 *
 * 1. `transform` makes this element the containing block for fixed-position
 *    descendants, so "the corner" means this frame's corner.
 * 2. `getContainer` portals the tray inside the frame, which is what puts it
 *    under that containing block.
 *
 * In an app the tray goes to `document.body` and docks to the real viewport,
 * which is the whole point of it.
 */
function StoryFrame({ children, intro, height = 280 }: StoryFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const getContainer = useCallback(() => frameRef.current, []);
  return (
    <VerticalStack gap="2">
      {intro ?? (
        <Text variant="body2" color="neutral.600">
          The tray docks to the corner of the frame below. Nothing inside it is
          blocked while work runs—scroll, click, and type as usual.
        </Text>
      )}
      <div
        ref={frameRef}
        style={{
          position: "relative",
          // See the note above: this is what scopes `position: fixed` to the
          // frame instead of the viewport.
          transform: "translate(0)",
          height,
          padding: "var(--ezui-space-2)",
          border: "1px solid var(--ezui-color-neutral-100)",
          borderRadius: "var(--ezui-shape-border-radius-lg)",
          overflow: "hidden",
        }}
      >
        <VerticalStack gap="2">
          <Text variant="heading4" as="h2">
            Shipments
          </Text>
          <Text variant="body2" color="neutral.600">
            Pretend this is a page.
          </Text>
        </VerticalStack>
        {children(getContainer)}
      </div>
    </VerticalStack>
  );
}

type SimulatedTask = {
  id: number;
  title: string;
  status: TaskStatus;
  completed: number;
  total: number;
  description?: string;
};

const PURCHASE_TOTAL = 250;
const PURCHASE_FAILURES = 3;
const PURCHASE_TICK_MS = 120;
const PURCHASE_TICK_SIZE = 7;

/**
 * Stands in for a server-side bulk purchase, so the stories exercise the tray's
 * real transitions rather than a static snapshot. In an app this is whatever
 * already tracks in-flight jobs—polling, a websocket, a mutation cache.
 */
function useSimulatedBulkPurchase() {
  const [tasks, setTasks] = useState<SimulatedTask[]>([]);
  const nextId = useRef(1);

  useEffect(() => {
    const running = tasks.some((task) => task.status === "running");
    if (!running) {
      return;
    }
    const interval = window.setInterval(() => {
      setTasks((current) =>
        current.map((task) => {
          if (task.status !== "running") {
            return task;
          }
          const completed = Math.min(
            task.total,
            task.completed + PURCHASE_TICK_SIZE,
          );
          if (completed < task.total) {
            return { ...task, completed };
          }
          const bought = task.total - PURCHASE_FAILURES;
          return {
            ...task,
            completed,
            status: "partial",
            title: `Bought ${bought} of ${task.total} labels`,
            description: `${PURCHASE_FAILURES} shipments were missing a rate`,
          };
        }),
      );
    }, PURCHASE_TICK_MS);
    return () => window.clearInterval(interval);
  }, [tasks]);

  const start = () => {
    const id = nextId.current++;
    setTasks((current) => [
      ...current,
      {
        id,
        title: "Buying labels",
        status: "running",
        completed: 0,
        total: PURCHASE_TOTAL,
      },
    ]);
    return id;
  };

  const cancel = (id: number) =>
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, status: "canceled", title: "Buying labels canceled" }
          : task,
      ),
    );

  const dismiss = (id: number) =>
    setTasks((current) => current.filter((task) => task.id !== id));

  return { tasks, start, cancel, dismiss };
}

function SimulatedTray({
  tasks,
  cancel,
  dismiss,
  ...trayProps
}: TaskTrayProps & {
  tasks: SimulatedTask[];
  cancel: (id: number) => void;
  dismiss: (id: number) => void;
}) {
  return (
    <TaskTray {...trayProps}>
      {tasks.map((task) => (
        <TaskTray.Task
          key={task.id}
          title={task.title}
          status={task.status}
          completed={task.completed}
          total={task.total}
          unit="labels"
          description={task.description}
          onDismiss={() => dismiss(task.id)}
        >
          {task.status === "running" && (
            <TaskTray.Action onPress={() => cancel(task.id)}>
              Cancel
            </TaskTray.Action>
          )}
          {task.status === "partial" && (
            <TaskTray.Action href="/shipments">Review</TaskTray.Action>
          )}
        </TaskTray.Task>
      ))}
    </TaskTray>
  );
}

function BulkPurchaseStory(args: TaskTrayProps) {
  const { tasks, start, cancel, dismiss } = useSimulatedBulkPurchase();
  return (
    <StoryFrame
      height={360}
      intro={
        <Text variant="body2" color="neutral.600">
          Buy more than once to stack tasks. Each run finishes with three
          failures, so it ends in the state that has to stay put.
        </Text>
      }
    >
      {(getContainer) => (
        <>
          <div style={{ marginTop: "var(--ezui-space-2)" }}>
            <Button onPress={start}>Buy {PURCHASE_TOTAL} labels</Button>
          </div>
          <SimulatedTray
            {...args}
            getContainer={getContainer}
            tasks={tasks}
            cancel={cancel}
            dismiss={dismiss}
          />
        </>
      )}
    </StoryFrame>
  );
}

const MANY_TASK_TITLES = [
  "Buying labels, batch 1",
  "Buying labels, batch 2",
  "Buying labels, batch 3",
  "Importing addresses",
  "Generating manifest",
  "Generating January report",
  "Generating February report",
  "Exporting shipments",
  "Exporting claims",
  "Syncing carrier accounts",
  "Refreshing rates",
  "Validating addresses",
];

function ManyTasksStory(args: TaskTrayProps) {
  const [maxVisibleTasks, setMaxVisibleTasks] = useState(4);
  return (
    <StoryFrame
      height={520}
      intro={
        <Text variant="body2" color="neutral.600">
          Twelve concurrent tasks. Drag the cap down to see the tray stay the
          same size and scroll instead.
        </Text>
      }
    >
      {(getContainer) => (
        <>
          <div style={{ marginTop: "var(--ezui-space-2)" }}>
            <label>
              <Text variant="body2">Visible rows: {maxVisibleTasks}</Text>
              <input
                type="range"
                min={1}
                max={6}
                value={maxVisibleTasks}
                onChange={(event) =>
                  setMaxVisibleTasks(Number(event.target.value))
                }
                style={{
                  display: "block",
                  marginTop: "var(--ezui-space-1)",
                  width: 200,
                }}
              />
            </label>
          </div>
          <TaskTray
            {...args}
            getContainer={getContainer}
            maxVisibleTasks={maxVisibleTasks}
          >
            {MANY_TASK_TITLES.map((title, index) => (
              <TaskTray.Task
                key={title}
                title={title}
                status="running"
                completed={index * 9}
                total={100}
                unit="items"
              />
            ))}
          </TaskTray>
        </>
      )}
    </StoryFrame>
  );
}

function PersistsAcrossRoutesStory(args: TaskTrayProps) {
  const { tasks, start, cancel, dismiss } = useSimulatedBulkPurchase();
  return (
    <StoryFrame
      height={420}
      intro={
        <Text variant="body2" color="neutral.600">
          Start a purchase, then navigate. The page content swaps; the tray
          doesn&apos;t, because it&apos;s mounted outside the routed content.
        </Text>
      }
    >
      {(getContainer) => (
        <>
          <FakeClientSideRouter initialPath="/shipments">
            {(path) => (
              <VerticalStack gap="2">
                <Text variant="heading4" as="h2">
                  {path === "/shipments" ? "Shipments" : "Reports"}
                </Text>
                <div>
                  <Button
                    href={path === "/shipments" ? "/reports" : "/shipments"}
                    variant="outlined"
                  >
                    Go to {path === "/shipments" ? "reports" : "shipments"}
                  </Button>
                </div>
                <Card>
                  <Card.Area>
                    <VerticalStack gap="1">
                      <Text variant="subtitle1">This page remounts</Text>
                      <Text variant="body2" color="neutral.600">
                        Navigating swaps the content. The running task is
                        untouched.
                      </Text>
                      <div>
                        <Button onPress={start}>
                          Buy {PURCHASE_TOTAL} labels
                        </Button>
                      </div>
                    </VerticalStack>
                  </Card.Area>
                </Card>
              </VerticalStack>
            )}
          </FakeClientSideRouter>
          <SimulatedTray
            {...args}
            getContainer={getContainer}
            tasks={tasks}
            cancel={cancel}
            dismiss={dismiss}
          />
        </>
      )}
    </StoryFrame>
  );
}

function WithToastStory(args: TaskTrayProps) {
  const notification = useNotification();
  const { tasks, start, cancel, dismiss } = useSimulatedBulkPurchase();
  return (
    <StoryFrame
      height={360}
      intro={
        <Text variant="body2" color="neutral.600">
          The toast confirms the click landed. The tray reports on the work
          itself.
        </Text>
      }
    >
      {(getContainer) => (
        <>
          <div style={{ marginTop: "var(--ezui-space-2)" }}>
            <Button
              onPress={() => {
                start();
                notification.showSuccessToast({
                  message: "Buying labels in the background",
                });
              }}
            >
              Buy {PURCHASE_TOTAL} labels
            </Button>
          </div>
          <SimulatedTray
            {...args}
            getContainer={getContainer}
            tasks={tasks}
            cancel={cancel}
            dismiss={dismiss}
          />
        </>
      )}
    </StoryFrame>
  );
}
