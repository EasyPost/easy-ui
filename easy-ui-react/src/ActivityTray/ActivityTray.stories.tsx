import { Meta, StoryObj } from "@storybook/react-vite";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { action } from "storybook/actions";
import { Button } from "../Button";
import { Card } from "../Card";
import { HorizontalStack } from "../HorizontalStack";
import { Modal, ModalContainer } from "../Modal";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import { useNotification } from "../Notification";
import { FakeClientSideRouter } from "../utilities/storybook";
import { ActivityTray, ActivityTrayProps } from "./ActivityTray";
import { TaskStatus } from "./utilities";

type Story = StoryObj<typeof ActivityTray>;

const meta: Meta<typeof ActivityTray> = {
  title: "Components/ActivityTray",
  component: ActivityTray,
  parameters: {
    controls: { exclude: ["children", "onExpandedChange", "getContainer"] },
  },
};

export default meta;

/**
 * One task is one row. There's no header, because the row already names the work
 * and a disclosure would have nothing behind it.
 */
export const Simple: Story = {
  render: (args: ActivityTrayProps) => (
    <StoryFrame>
      {(getContainer) => (
        <ActivityTray {...args} getContainer={getContainer}>
          <ActivityTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
            unit="labels"
          >
            <ActivityTray.Action onPress={action("Cancel")}>
              Cancel
            </ActivityTray.Action>
          </ActivityTray.Task>
        </ActivityTray>
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
  render: (args: ActivityTrayProps) => <BulkPurchaseStory {...args} />,
};

/**
 * Omit `total` when the app can't honestly say how far along the work is. An
 * indeterminate row is better than a bar that sticks at 90%.
 */
export const Indeterminate: Story = {
  render: (args: ActivityTrayProps) => (
    <StoryFrame>
      {(getContainer) => (
        <ActivityTray {...args} getContainer={getContainer}>
          <ActivityTray.Task
            title="Generating January report"
            status="running"
          />
        </ActivityTray>
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
  render: (args: ActivityTrayProps) => (
    <StoryFrame height={440}>
      {(getContainer) => (
        <ActivityTray
          {...args}
          getContainer={getContainer}
          autoDismissDelay={null}
          maxVisibleTasks={6}
        >
          <ActivityTray.Task title="Queued import" status="pending" />
          <ActivityTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
            unit="labels"
          >
            <ActivityTray.Action onPress={action("Cancel")}>
              Cancel
            </ActivityTray.Action>
          </ActivityTray.Task>
          <ActivityTray.Task
            title="Bought 40 labels"
            status="succeeded"
            onDismiss={action("Dismiss")}
          />
          <ActivityTray.Task
            title="Bought 247 of 250 labels"
            status="partial"
            description="3 shipments were missing a rate"
            onDismiss={action("Dismiss")}
          >
            <ActivityTray.Action href="/shipments">Review</ActivityTray.Action>
          </ActivityTray.Task>
          <ActivityTray.Task
            title="January report"
            status="failed"
            description="The report timed out"
            onDismiss={action("Dismiss")}
          >
            <ActivityTray.Action onPress={action("Retry")}>
              Retry
            </ActivityTray.Action>
          </ActivityTray.Task>
          <ActivityTray.Task
            title="Address import"
            status="canceled"
            onDismiss={action("Dismiss")}
          />
        </ActivityTray>
      )}
    </StoryFrame>
  ),
};

/**
 * The header appears with the second task, counting instead of naming, and the
 * list scrolls once it passes `maxVisibleTasks`. A single task has no header at
 * all—see `Simple`.
 */
export const MultipleTasks: Story = {
  render: (args: ActivityTrayProps) => (
    <StoryFrame>
      {(getContainer) => (
        <ActivityTray {...args} getContainer={getContainer} maxVisibleTasks={3}>
          <ActivityTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
            unit="labels"
          />
          <ActivityTray.Task
            title="Importing addresses"
            status="running"
            completed={12}
            total={900}
            unit="rows"
          />
          <ActivityTray.Task title="Generating manifest" status="running" />
          <ActivityTray.Task
            title="Generating January report"
            status="running"
            completed={3}
            total={4}
            unit="steps"
          />
        </ActivityTray>
      )}
    </StoryFrame>
  ),
};

/**
 * A dozen concurrent tasks, to show what the height cap buys. The tray holds at
 * `maxVisibleTasks` rows and scrolls; it never grows to cover the page.
 *
 * It's still a lot of corner. Collapsing is the honest answer at this volume,
 * and so is aggregating tasks of the same kind into one row—"Buying labels, 3
 * batches"—before they reach the tray. Nesting a second disclosure inside each
 * row is not: a row holds one line of detail, which isn't enough to hide behind
 * a chevron.
 */
export const ManyTasks: Story = {
  render: (args: ActivityTrayProps) => <ManyTasksStory {...args} />,
};

/**
 * Collapsed, the tray is one line. Useful as a default for work measured in
 * minutes, where the user doesn't need the detail in front of them the whole
 * time.
 */
export const Collapsed: Story = {
  render: (args: ActivityTrayProps) => (
    <StoryFrame>
      {(getContainer) => (
        <ActivityTray
          {...args}
          getContainer={getContainer}
          defaultExpanded={false}
        >
          <ActivityTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
            unit="labels"
          />
          <ActivityTray.Task title="Generating manifest" status="running" />
        </ActivityTray>
      )}
    </StoryFrame>
  ),
};

/**
 * Up to two actions per row. `onPress` for work the app does—cancel, retry—and
 * `href` for somewhere to go, like the shipments that failed. Both are buttons.
 */
export const Actions: Story = {
  render: (args: ActivityTrayProps) => (
    <StoryFrame height={320}>
      {(getContainer) => (
        <ActivityTray
          {...args}
          getContainer={getContainer}
          autoDismissDelay={null}
        >
          <ActivityTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
            unit="labels"
          >
            <ActivityTray.Action onPress={action("Cancel")}>
              Cancel
            </ActivityTray.Action>
          </ActivityTray.Task>
          <ActivityTray.Task
            title="Bought 247 of 250 labels"
            status="partial"
            description="3 shipments were missing a rate"
            onDismiss={action("Dismiss")}
          >
            <ActivityTray.Action href="/shipments">Review</ActivityTray.Action>
          </ActivityTray.Task>
          <ActivityTray.Task
            title="January report"
            status="failed"
            description="The report timed out"
            onDismiss={action("Dismiss")}
          >
            <ActivityTray.Action onPress={action("Retry")}>
              Retry
            </ActivityTray.Action>
          </ActivityTray.Task>
        </ActivityTray>
      )}
    </StoryFrame>
  ),
};

/**
 * A cancel that costs something is confirmed by the app, not the tray. The
 * action opens a `<Modal />`; the modal's underlay dims the tray, and the work
 * keeps running underneath until the user decides.
 */
export const CancelConfirmation: Story = {
  render: (args: ActivityTrayProps) => <CancelConfirmationStory {...args} />,
};

/**
 * `isExpanded` and `onExpandedChange` hand the collapsed state to the app—to
 * remember it across sessions, say, or to open the tray from elsewhere on the
 * page.
 */
export const Controlled: Story = {
  render: (args: ActivityTrayProps) => <ControlledStory {...args} />,
};

/**
 * `renderSummary` rewrites the header—the only thing showing when the tray is
 * collapsed. It gets the number of unfinished tasks and the total.
 */
export const CustomSummary: Story = {
  render: (args: ActivityTrayProps) => (
    <StoryFrame>
      {(getContainer) => (
        <ActivityTray
          {...args}
          getContainer={getContainer}
          aria-label="Label purchases"
          renderSummary={(running, total) =>
            running > 0
              ? `Buying labels in ${running} of ${total} batches`
              : `${total} batches done`
          }
        >
          <ActivityTray.Task
            title="Batch 1"
            status="running"
            completed={80}
            total={100}
            unit="labels"
          />
          <ActivityTray.Task
            title="Batch 2"
            status="running"
            completed={35}
            total={100}
            unit="labels"
          />
        </ActivityTray>
      )}
    </StoryFrame>
  ),
};

/**
 * Docked top-start and pushed down with `offset`, clear of the page's heading.
 * Try the other corners from the controls.
 */
export const Placement: Story = {
  args: {
    placement: "top-start",
    offset: { top: "112px", left: "16px" },
  },
  render: (args: ActivityTrayProps) => (
    <StoryFrame>
      {(getContainer) => (
        <ActivityTray {...args} getContainer={getContainer}>
          <ActivityTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
            unit="labels"
          />
        </ActivityTray>
      )}
    </StoryFrame>
  ),
};

/**
 * Below the `sm` breakpoint the tray is a strip across the viewport. The
 * breakpoint is a media query on the viewport, so this story only shows it on
 * its own canvas, where it opens at a phone width—on the docs page it renders
 * at the page's width like the rest.
 */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
  render: (args: ActivityTrayProps) => (
    <StoryFrame height={360}>
      {(getContainer) => (
        <ActivityTray {...args} getContainer={getContainer}>
          <ActivityTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
            unit="labels"
          >
            <ActivityTray.Action onPress={action("Cancel")}>
              Cancel
            </ActivityTray.Action>
          </ActivityTray.Task>
          <ActivityTray.Task title="Generating manifest" status="running" />
        </ActivityTray>
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
  render: (args: ActivityTrayProps) => <PersistsAcrossRoutesStory {...args} />,
};

/**
 * A toast acknowledges the click; the tray carries the work. They answer
 * different questions and are often both right.
 */
export const WithToast: Story = {
  render: (args: ActivityTrayProps) => <WithToastStory {...args} />,
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
 *
 * The frame is held in state rather than a ref so that `children` can wait for
 * it. A ref is null on the first render, which would hand the tray a container
 * it can't use yet.
 */
function StoryFrame({ children, intro, height = 280 }: StoryFrameProps) {
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  const getContainer = useCallback(() => frame, [frame]);
  return (
    <VerticalStack gap="2">
      {intro ?? (
        <Text variant="body2" color="neutral.600">
          The tray docks to the corner of the frame below. Nothing inside it is
          blocked while work runs—scroll, click, and type as usual.
        </Text>
      )}
      <div
        ref={setFrame}
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
        {frame && children(getContainer)}
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
}: ActivityTrayProps & {
  tasks: SimulatedTask[];
  cancel: (id: number) => void;
  dismiss: (id: number) => void;
}) {
  return (
    <ActivityTray {...trayProps}>
      {tasks.map((task) => (
        <ActivityTray.Task
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
            <ActivityTray.Action onPress={() => cancel(task.id)}>
              Cancel
            </ActivityTray.Action>
          )}
          {task.status === "partial" && (
            <ActivityTray.Action href="/shipments">Review</ActivityTray.Action>
          )}
        </ActivityTray.Task>
      ))}
    </ActivityTray>
  );
}

function BulkPurchaseStory(args: ActivityTrayProps) {
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

function ManyTasksStory(args: ActivityTrayProps) {
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
          <ActivityTray
            {...args}
            getContainer={getContainer}
            maxVisibleTasks={maxVisibleTasks}
          >
            {MANY_TASK_TITLES.map((title, index) => (
              <ActivityTray.Task
                key={title}
                title={title}
                status="running"
                completed={index * 9}
                total={100}
                unit="items"
              />
            ))}
          </ActivityTray>
        </>
      )}
    </StoryFrame>
  );
}

function PersistsAcrossRoutesStory(args: ActivityTrayProps) {
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

function WithToastStory(args: ActivityTrayProps) {
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

function CancelConfirmationStory(args: ActivityTrayProps) {
  const { tasks, start, cancel, dismiss } = useSimulatedBulkPurchase();
  const [confirming, setConfirming] = useState<SimulatedTask | null>(null);
  return (
    <StoryFrame
      height={360}
      intro={
        <Text variant="body2" color="neutral.600">
          Start a purchase, then cancel it from the tray.
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
            cancel={(id) =>
              setConfirming(tasks.find((task) => task.id === id) ?? null)
            }
            dismiss={dismiss}
          />
          <ModalContainer onDismiss={() => setConfirming(null)}>
            {confirming && (
              <Modal>
                <Modal.Header>Stop buying labels?</Modal.Header>
                <Modal.Body>
                  <Text>
                    Labels already bought stay bought. The rest of the batch
                    won&apos;t be purchased.
                  </Text>
                </Modal.Body>
                <Modal.Footer>
                  <HorizontalStack align="end" gap="1">
                    <Button
                      variant="outlined"
                      onPress={() => setConfirming(null)}
                    >
                      Keep going
                    </Button>
                    <Button
                      onPress={() => {
                        cancel(confirming.id);
                        setConfirming(null);
                      }}
                    >
                      Stop
                    </Button>
                  </HorizontalStack>
                </Modal.Footer>
              </Modal>
            )}
          </ModalContainer>
        </>
      )}
    </StoryFrame>
  );
}

function ControlledStory(args: ActivityTrayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <StoryFrame
      intro={
        <Text variant="body2" color="neutral.600">
          The button and the tray&apos;s own toggle drive the same state.
        </Text>
      }
    >
      {(getContainer) => (
        <>
          <div style={{ marginTop: "var(--ezui-space-2)" }}>
            <Button variant="outlined" onPress={() => setIsExpanded((v) => !v)}>
              {isExpanded ? "Hide" : "Show"} background tasks
            </Button>
          </div>
          <ActivityTray
            {...args}
            getContainer={getContainer}
            isExpanded={isExpanded}
            onExpandedChange={setIsExpanded}
          >
            <ActivityTray.Task
              title="Buying labels"
              status="running"
              completed={127}
              total={250}
              unit="labels"
            />
            <ActivityTray.Task title="Generating manifest" status="running" />
          </ActivityTray>
        </>
      )}
    </StoryFrame>
  );
}
