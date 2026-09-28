import { Meta, StoryObj } from "@storybook/react-vite";
import React, { useEffect, useRef, useState } from "react";
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
    <PageContent>
      <TaskTray {...args}>
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
    </PageContent>
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
    <PageContent>
      <TaskTray {...args}>
        <TaskTray.Task title="Generating January report" status="running" />
      </TaskTray>
    </PageContent>
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
    <PageContent>
      <TaskTray {...args} autoDismissDelay={null} maxVisibleTasks={6}>
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
    </PageContent>
  ),
};

/**
 * Past one task the header counts instead of naming, and the list scrolls once
 * it passes `maxVisibleTasks`.
 */
export const MultipleTasks: Story = {
  render: (args: TaskTrayProps) => (
    <PageContent>
      <TaskTray {...args} maxVisibleTasks={3}>
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
    </PageContent>
  ),
};

/**
 * Collapsed, the tray is one line. Useful as a default for work measured in
 * minutes, where the user doesn't need the detail in front of them the whole
 * time.
 */
export const Collapsed: Story = {
  render: (args: TaskTrayProps) => (
    <PageContent>
      <TaskTray {...args} defaultExpanded={false}>
        <TaskTray.Task
          title="Buying labels"
          status="running"
          completed={127}
          total={250}
          unit="labels"
        />
        <TaskTray.Task title="Generating manifest" status="running" />
      </TaskTray>
    </PageContent>
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

/** Enough page for the tray to sit on top of something. */
function PageContent({ children }: { children?: React.ReactNode }) {
  return (
    <VerticalStack gap="2">
      <Text variant="heading4" as="h2">
        Shipments
      </Text>
      <Text variant="body2" color="neutral.600">
        The tray docks to the corner of the frame. Nothing here is blocked while
        it runs—scroll, click, and type as usual.
      </Text>
      {children}
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
    <VerticalStack gap="2">
      <Text variant="heading4" as="h2">
        Shipments
      </Text>
      <Text variant="body2" color="neutral.600">
        Buy more than once to stack tasks. Each run finishes with three
        failures, so it ends in the state that has to stay put.
      </Text>
      <div>
        <Button onPress={start}>Buy {PURCHASE_TOTAL} labels</Button>
      </div>
      <SimulatedTray
        {...args}
        tasks={tasks}
        cancel={cancel}
        dismiss={dismiss}
      />
    </VerticalStack>
  );
}

function PersistsAcrossRoutesStory(args: TaskTrayProps) {
  const { tasks, start, cancel, dismiss } = useSimulatedBulkPurchase();
  return (
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
                    Navigating swaps the content. The tray is mounted outside
                    this content, so the running task is untouched.
                  </Text>
                  <div>
                    <Button onPress={start}>Buy {PURCHASE_TOTAL} labels</Button>
                  </div>
                </VerticalStack>
              </Card.Area>
            </Card>
          </VerticalStack>
        )}
      </FakeClientSideRouter>
      <SimulatedTray
        {...args}
        tasks={tasks}
        cancel={cancel}
        dismiss={dismiss}
      />
    </>
  );
}

function WithToastStory(args: TaskTrayProps) {
  const notification = useNotification();
  const { tasks, start, cancel, dismiss } = useSimulatedBulkPurchase();
  return (
    <VerticalStack gap="2">
      <Text variant="heading4" as="h2">
        Shipments
      </Text>
      <Text variant="body2" color="neutral.600">
        The toast confirms the click landed. The tray reports on the work
        itself.
      </Text>
      <div>
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
        tasks={tasks}
        cancel={cancel}
        dismiss={dismiss}
      />
    </VerticalStack>
  );
}
