import { act, screen } from "@testing-library/react";
import React, { useState } from "react";
import { vi } from "vitest";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
  userClick,
  userHover,
  userKeyboard,
  userTab,
} from "../utilities/test";
import { Modal, ModalContainer } from "../Modal";
import { ActivityTray } from "./ActivityTray";
import { DEFAULT_AUTO_DISMISS_DELAY } from "./utilities";

describe("<ActivityTray />", () => {
  let restoreGetComputedStyle: () => void;

  beforeEach(() => {
    restoreGetComputedStyle = mockGetComputedStyle();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    restoreGetComputedStyle();
  });

  it("should render nothing when it holds no tasks", () => {
    render(<ActivityTray>{null}</ActivityTray>);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("should render a named landmark region", () => {
    render(
      <ActivityTray>
        <ActivityTray.Task title="Buying labels" status="running" />
      </ActivityTray>,
    );
    expect(
      screen.getByRole("region", { name: "Background tasks" }),
    ).toBeInTheDocument();
  });

  it("should support a custom accessible name", () => {
    render(
      <ActivityTray aria-label="Label purchases">
        <ActivityTray.Task title="Buying labels" status="running" />
      </ActivityTray>,
    );
    expect(
      screen.getByRole("region", { name: "Label purchases" }),
    ).toBeInTheDocument();
  });

  it("should render a single task without a header", () => {
    render(
      <ActivityTray>
        <ActivityTray.Task title="Buying labels" status="running" />
      </ActivityTray>,
    );
    // The row is the whole tray: the title appears once, and there's no
    // disclosure toggle above it with nothing to disclose.
    expect(screen.getAllByText("Buying labels")).toHaveLength(1);
    expect(
      screen.queryByRole("button", { name: /background tasks/i }),
    ).toBeNull();
    expect(screen.getByRole("list")).toBeVisible();
  });

  it("should grow a header once a second task arrives", () => {
    const { rerender } = render(
      <ActivityTray>
        <ActivityTray.Task title="Buying labels" status="running" />
      </ActivityTray>,
    );
    rerender(
      <ActivityTray>
        <ActivityTray.Task title="Buying labels" status="running" />
        <ActivityTray.Task title="Generating manifest" status="running" />
      </ActivityTray>,
    );
    expect(screen.getByText("2 tasks running")).toBeInTheDocument();
    expect(screen.getByRole("button", { expanded: true })).toBeVisible();
  });

  it("should summarize by count past one task", () => {
    render(
      <ActivityTray>
        <ActivityTray.Task title="Buying labels" status="running" />
        <ActivityTray.Task title="Generating manifest" status="running" />
      </ActivityTray>,
    );
    expect(screen.getByText("2 tasks running")).toBeInTheDocument();
  });

  it("should distinguish running tasks from finished ones in the summary", () => {
    render(
      <ActivityTray autoDismissDelay={null}>
        <ActivityTray.Task title="Buying labels" status="running" />
        <ActivityTray.Task title="Bought 40 labels" status="succeeded" />
      </ActivityTray>,
    );
    expect(screen.getByText("1 of 2 tasks running")).toBeInTheDocument();
  });

  it("should support a custom summary", () => {
    render(
      <ActivityTray
        renderSummary={(running, total) => `${running}/${total} busy`}
      >
        <ActivityTray.Task title="Buying labels" status="running" />
        <ActivityTray.Task title="Generating manifest" status="running" />
      </ActivityTray>,
    );
    expect(screen.getByText("2/2 busy")).toBeInTheDocument();
  });

  describe("progress", () => {
    it("should expose a determinate progress bar", () => {
      render(
        <ActivityTray>
          <ActivityTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
            unit="labels"
          />
        </ActivityTray>,
      );
      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "127");
      expect(progressBar).toHaveAttribute("aria-valuemin", "0");
      // The total, not a percentage—"127 of 250" is what the user was told.
      expect(progressBar).toHaveAttribute("aria-valuemax", "250");
      expect(progressBar).toHaveAttribute(
        "aria-valuetext",
        "127 of 250 labels",
      );
    });

    it("should name the progress bar after the task", () => {
      render(
        <ActivityTray>
          <ActivityTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
          />
        </ActivityTray>,
      );
      expect(
        screen.getByRole("progressbar", { name: "Buying labels" }),
      ).toBeInTheDocument();
    });

    it("should render no progress bar without a total", () => {
      render(
        <ActivityTray>
          <ActivityTray.Task title="Generating manifest" status="running" />
        </ActivityTray>,
      );
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("should drop the progress bar once the task is terminal", () => {
      render(
        <ActivityTray autoDismissDelay={null}>
          <ActivityTray.Task
            title="Bought 247 of 250 labels"
            status="partial"
            completed={250}
            total={250}
          />
        </ActivityTray>,
      );
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  // Expansion is a property of the header, which only exists past one task.
  describe("expansion", () => {
    const twoTasks = (
      <>
        <ActivityTray.Task title="Buying labels" status="running" />
        <ActivityTray.Task title="Generating manifest" status="running" />
      </>
    );

    it("should be expanded by default", () => {
      render(<ActivityTray>{twoTasks}</ActivityTray>);
      const toggle = screen.getByRole("button", { expanded: true });
      expect(toggle).toHaveAttribute("aria-controls", expect.any(String));
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("should support starting collapsed", () => {
      render(<ActivityTray defaultExpanded={false}>{twoTasks}</ActivityTray>);
      expect(screen.getByRole("button", { expanded: false })).toBeVisible();
      // `hidden` takes the list out of the accessibility tree while its rows
      // stay mounted and their work keeps running.
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("should collapse and expand on press", async () => {
      const onExpandedChange = vi.fn();
      const { user } = render(
        <ActivityTray onExpandedChange={onExpandedChange}>
          {twoTasks}
        </ActivityTray>,
      );
      await userClick(user, screen.getByRole("button", { expanded: true }));
      expect(onExpandedChange).toHaveBeenCalledWith(false);
      expect(screen.queryByRole("list")).not.toBeInTheDocument();

      await userClick(user, screen.getByRole("button", { expanded: false }));
      expect(onExpandedChange).toHaveBeenLastCalledWith(true);
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("should stay put when controlled", async () => {
      const onExpandedChange = vi.fn();
      const { user } = render(
        <ActivityTray isExpanded onExpandedChange={onExpandedChange}>
          {twoTasks}
        </ActivityTray>,
      );
      await userClick(user, screen.getByRole("button", { expanded: true }));
      expect(onExpandedChange).toHaveBeenCalledWith(false);
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("should collapse on escape without dismissing anything", async () => {
      const onDismiss = vi.fn();
      const { user } = render(
        <ActivityTray>
          <ActivityTray.Task
            title="Buying labels"
            status="running"
            onDismiss={onDismiss}
          />
          <ActivityTray.Task title="Generating manifest" status="running" />
        </ActivityTray>,
      );
      await userTab(user);
      await userKeyboard(user, "{Escape}");
      expect(screen.getByRole("button", { expanded: false })).toBeVisible();
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("should keep a single task's list open", async () => {
      const { user } = render(
        <ActivityTray defaultExpanded={false}>
          <ActivityTray.Task title="Buying labels" status="running">
            <ActivityTray.Action onPress={vi.fn()}>Cancel</ActivityTray.Action>
          </ActivityTray.Task>
        </ActivityTray>,
      );
      // With no header there's no `defaultExpanded` to honor, and escape has
      // nothing to collapse.
      expect(screen.getByRole("list")).toBeVisible();
      await userTab(user);
      await userKeyboard(user, "{Escape}");
      expect(screen.getByRole("list")).toBeVisible();
    });
  });

  describe("dismissal", () => {
    it("should offer no dismiss button while the work is running", () => {
      render(
        <ActivityTray>
          <ActivityTray.Task
            title="Buying labels"
            status="running"
            onDismiss={vi.fn()}
          />
        </ActivityTray>,
      );
      expect(
        screen.queryByRole("button", { name: "Dismiss Buying labels" }),
      ).not.toBeInTheDocument();
    });

    it("should dismiss a terminal task on press", async () => {
      const onDismiss = vi.fn();
      const { user } = render(
        <ActivityTray autoDismissDelay={null}>
          <ActivityTray.Task
            title="January report"
            status="failed"
            onDismiss={onDismiss}
          />
        </ActivityTray>,
      );
      await userClick(
        user,
        screen.getByRole("button", { name: "Dismiss January report" }),
      );
      expect(onDismiss).toHaveBeenCalled();
    });

    it("should hand focus to the tray when a row dismisses itself", async () => {
      const { user } = render(
        <ActivityTray autoDismissDelay={null}>
          <ActivityTray.Task
            title="January report"
            status="failed"
            onDismiss={vi.fn()}
          />
          <ActivityTray.Task title="Buying labels" status="running" />
        </ActivityTray>,
      );
      await userClick(
        user,
        screen.getByRole("button", { name: "Dismiss January report" }),
      );
      // The app controls the task list, so the row is still here in this test;
      // what matters is that focus left the button that was about to unmount.
      expect(screen.getByRole("region")).toHaveFocus();
    });

    it("should auto-dismiss a succeeded task", () => {
      const onDismiss = vi.fn();
      render(
        <ActivityTray>
          <ActivityTray.Task
            title="Bought 40 labels"
            status="succeeded"
            onDismiss={onDismiss}
          />
        </ActivityTray>,
      );
      expect(onDismiss).not.toHaveBeenCalled();
      act(() => {
        vi.advanceTimersByTime(DEFAULT_AUTO_DISMISS_DELAY);
      });
      expect(onDismiss).toHaveBeenCalled();
    });

    it("should keep its auto-dismiss timer across re-renders", () => {
      const onDismiss = vi.fn();
      const renderTray = (completed: number) => (
        <ActivityTray>
          <ActivityTray.Task
            title="Bought 40 labels"
            status="succeeded"
            onDismiss={() => onDismiss()}
          />
          <ActivityTray.Task
            title="Buying labels"
            status="running"
            completed={completed}
            total={250}
          />
        </ActivityTray>
      );
      const { rerender } = render(renderTray(0));
      for (let completed = 1; completed <= 10; completed++) {
        act(() => {
          vi.advanceTimersByTime(DEFAULT_AUTO_DISMISS_DELAY / 10);
        });
        rerender(renderTray(completed));
      }
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("should hold a failed task until the user dismisses it", () => {
      const onDismiss = vi.fn();
      render(
        <ActivityTray>
          <ActivityTray.Task
            title="January report"
            status="failed"
            description="The report timed out"
            onDismiss={onDismiss}
          />
        </ActivityTray>,
      );
      act(() => {
        vi.advanceTimersByTime(DEFAULT_AUTO_DISMISS_DELAY * 10);
      });
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("should hold a partial task until the user dismisses it", () => {
      const onDismiss = vi.fn();
      render(
        <ActivityTray>
          <ActivityTray.Task
            title="Bought 247 of 250 labels"
            status="partial"
            onDismiss={onDismiss}
          />
        </ActivityTray>,
      );
      act(() => {
        vi.advanceTimersByTime(DEFAULT_AUTO_DISMISS_DELAY * 10);
      });
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("should support disabling auto-dismissal", () => {
      const onDismiss = vi.fn();
      render(
        <ActivityTray autoDismissDelay={null}>
          <ActivityTray.Task
            title="Bought 40 labels"
            status="succeeded"
            onDismiss={onDismiss}
          />
        </ActivityTray>,
      );
      act(() => {
        vi.advanceTimersByTime(DEFAULT_AUTO_DISMISS_DELAY * 10);
      });
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("should support a per-task auto-dismiss delay", () => {
      const onDismiss = vi.fn();
      render(
        <ActivityTray autoDismissDelay={null}>
          <ActivityTray.Task
            title="Bought 40 labels"
            status="succeeded"
            autoDismissDelay={1000}
            onDismiss={onDismiss}
          />
        </ActivityTray>,
      );
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(onDismiss).toHaveBeenCalled();
    });

    it("should hold the timer while the pointer is inside the tray", async () => {
      const onDismiss = vi.fn();
      const { user } = render(
        <ActivityTray>
          <ActivityTray.Task
            title="Bought 40 labels"
            status="succeeded"
            onDismiss={onDismiss}
          />
        </ActivityTray>,
      );
      await userHover(user, screen.getByRole("region"));
      act(() => {
        vi.advanceTimersByTime(DEFAULT_AUTO_DISMISS_DELAY * 2);
      });
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("should hold the timer while the pointer is over a row", async () => {
      const onDismiss = vi.fn();
      const { user } = render(
        <ActivityTray>
          <ActivityTray.Task
            title="Bought 40 labels"
            status="succeeded"
            onDismiss={onDismiss}
          />
        </ActivityTray>,
      );
      // The row, not the tray the hover handlers sit on: reading a row means
      // pointing at one, and that has to count as being inside the tray.
      await userHover(user, screen.getByRole("listitem"));
      act(() => {
        vi.advanceTimersByTime(DEFAULT_AUTO_DISMISS_DELAY * 2);
      });
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("should hold the timer while focus is inside the tray", async () => {
      const onDismiss = vi.fn();
      const { user } = render(
        <ActivityTray>
          <ActivityTray.Task
            title="Bought 40 labels"
            status="succeeded"
            onDismiss={onDismiss}
          />
        </ActivityTray>,
      );
      await userTab(user);
      act(() => {
        vi.advanceTimersByTime(DEFAULT_AUTO_DISMISS_DELAY * 2);
      });
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("should render no dismiss button without an onDismiss", () => {
      render(
        <ActivityTray>
          <ActivityTray.Task title="Bought 40 labels" status="succeeded" />
        </ActivityTray>,
      );
      expect(
        screen.queryByRole("button", { name: /^Dismiss/ }),
      ).not.toBeInTheDocument();
    });
  });

  describe("announcements", () => {
    it("should announce a terminal transition", () => {
      const { rerender } = render(
        <ActivityTray>
          <ActivityTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
          />
        </ActivityTray>,
      );
      expect(getAnnouncement()).toBe("");

      rerender(
        <ActivityTray>
          <ActivityTray.Task
            title="Bought 247 of 250 labels"
            status="partial"
            description="3 shipments were missing a rate"
          />
        </ActivityTray>,
      );
      act(() => {
        vi.advanceTimersByTime(0);
      });
      expect(getAnnouncement()).toBe(
        "Bought 247 of 250 labels finished with errors. 3 shipments were missing a rate.",
      );
    });

    it("should not announce progress", () => {
      const { rerender } = render(
        <ActivityTray>
          <ActivityTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
          />
        </ActivityTray>,
      );
      rerender(
        <ActivityTray>
          <ActivityTray.Task
            title="Buying labels"
            status="running"
            completed={200}
            total={250}
          />
        </ActivityTray>,
      );
      act(() => {
        vi.advanceTimersByTime(0);
      });
      expect(getAnnouncement()).toBe("");
    });

    it("should coalesce transitions landing in the same tick", () => {
      const { rerender } = render(
        <ActivityTray autoDismissDelay={null}>
          <ActivityTray.Task title="Buying labels" status="running" />
          <ActivityTray.Task title="Generating manifest" status="running" />
        </ActivityTray>,
      );
      rerender(
        <ActivityTray autoDismissDelay={null}>
          <ActivityTray.Task title="Buying labels" status="succeeded" />
          <ActivityTray.Task title="Generating manifest" status="failed" />
        </ActivityTray>,
      );
      act(() => {
        vi.advanceTimersByTime(0);
      });
      expect(getAnnouncement()).toBe(
        "Buying labels finished. Generating manifest failed.",
      );
    });
  });

  it("should keep announcing while a modal hides the rest of the page", () => {
    const task = (status: "running" | "succeeded") => (
      <>
        <ActivityTray>
          <ActivityTray.Task title="Buying labels" status={status} />
        </ActivityTray>
        <ModalContainer>
          <Modal>
            <Modal.Header>Something else</Modal.Header>
            <Modal.Body>Content</Modal.Body>
          </Modal>
        </ModalContainer>
      </>
    );
    const restoreIntersectionObserver = mockIntersectionObserver();
    const { rerender } = render(task("running"));
    act(() => {
      vi.advanceTimersByTime(100);
    });
    // The modal has hidden the tray itself from assistive technology.
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    rerender(task("succeeded"));
    act(() => {
      vi.advanceTimersByTime(0);
    });
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).toHaveTextContent("Buying labels finished.");
    expect(liveRegion?.closest('[aria-hidden="true"]')).toBeNull();
    restoreIntersectionObserver();
  });

  it("should render actions", async () => {
    const onPress = vi.fn();
    const { user } = render(
      <ActivityTray>
        <ActivityTray.Task title="Buying labels" status="running">
          <ActivityTray.Action onPress={onPress}>Cancel</ActivityTray.Action>
        </ActivityTray.Task>
      </ActivityTray>,
    );
    await userClick(user, screen.getByRole("button", { name: "Cancel" }));
    expect(onPress).toHaveBeenCalled();
  });

  it("should render a link action", () => {
    render(
      <ActivityTray autoDismissDelay={null}>
        <ActivityTray.Task title="Bought 247 of 250 labels" status="partial">
          <ActivityTray.Action href="/shipments">Review</ActivityTray.Action>
        </ActivityTray.Task>
      </ActivityTray>,
    );
    // An `<a>` carrying `role="button"`—`UnstyledButton` runs `useButton()` over
    // the anchor, the same as `Button` does with an `href`. See the spec's open
    // question about whether an action that navigates should read as a link.
    const action = screen.getByRole("button", { name: "Review" });
    expect(action.tagName).toBe("A");
    expect(action).toHaveAttribute("href", "/shipments");
  });

  it("should render a description", () => {
    render(
      <ActivityTray autoDismissDelay={null}>
        <ActivityTray.Task
          title="January report"
          status="failed"
          description="The report timed out"
        />
      </ActivityTray>,
    );
    expect(screen.getByText("The report timed out")).toBeInTheDocument();
  });

  it("should portal into a custom container", () => {
    const container = document.createElement("div");
    container.setAttribute("data-testid", "custom-container");
    document.body.append(container);

    render(
      <ActivityTray getContainer={() => container}>
        <ActivityTray.Task title="Buying labels" status="running" />
      </ActivityTray>,
    );
    expect(container).toContainElement(screen.getByRole("region"));
    container.remove();
  });

  it("should wait for a custom container rather than falling back to the body", () => {
    // A getter that reads a ref returns null on the first render. Falling back
    // to the body would dock the tray to the viewport corner and then move the
    // portal once the ref filled in, jumping the tray across the screen.
    function Frame() {
      const [frame, setFrame] = useState<HTMLDivElement | null>(null);
      return (
        <div ref={setFrame} data-testid="frame">
          <ActivityTray getContainer={() => frame}>
            <ActivityTray.Task title="Buying labels" status="running" />
          </ActivityTray>
        </div>
      );
    }
    render(<Frame />);
    expect(screen.getByTestId("frame")).toContainElement(
      screen.getByRole("region"),
    );
  });

  it("should render nothing while a custom container is unavailable", () => {
    render(
      <ActivityTray getContainer={() => null}>
        <ActivityTray.Task title="Buying labels" status="running" />
      </ActivityTray>,
    );
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("should ignore children that aren't tasks", () => {
    render(
      <ActivityTray>
        <div>Not a task</div>
      </ActivityTray>,
    );
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
});

/**
 * The live region is deliberately unlabeled and visually hidden, so it's read
 * off the DOM rather than through a role query.
 */
function getAnnouncement() {
  const liveRegion = document.querySelector("[aria-live='polite']");
  return liveRegion?.textContent ?? null;
}
