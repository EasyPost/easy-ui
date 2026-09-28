import { act, screen } from "@testing-library/react";
import React, { useState } from "react";
import { vi } from "vitest";
import {
  mockGetComputedStyle,
  render,
  userClick,
  userHover,
  userKeyboard,
  userTab,
} from "../utilities/test";
import { TaskTray } from "./TaskTray";
import { DEFAULT_AUTO_DISMISS_DELAY } from "./utilities";

describe("<TaskTray />", () => {
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
    render(<TaskTray>{null}</TaskTray>);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("should render a named landmark region", () => {
    render(
      <TaskTray>
        <TaskTray.Task title="Buying labels" status="running" />
      </TaskTray>,
    );
    expect(
      screen.getByRole("region", { name: "Background tasks" }),
    ).toBeInTheDocument();
  });

  it("should support a custom accessible name", () => {
    render(
      <TaskTray aria-label="Label purchases">
        <TaskTray.Task title="Buying labels" status="running" />
      </TaskTray>,
    );
    expect(
      screen.getByRole("region", { name: "Label purchases" }),
    ).toBeInTheDocument();
  });

  it("should name itself after its only task", () => {
    render(
      <TaskTray>
        <TaskTray.Task title="Buying labels" status="running" />
      </TaskTray>,
    );
    // Once in the header summary, once as the row's title.
    expect(screen.getAllByText("Buying labels")).toHaveLength(2);
  });

  it("should summarize by count past one task", () => {
    render(
      <TaskTray>
        <TaskTray.Task title="Buying labels" status="running" />
        <TaskTray.Task title="Generating manifest" status="running" />
      </TaskTray>,
    );
    expect(screen.getByText("2 tasks running")).toBeInTheDocument();
  });

  it("should distinguish running tasks from finished ones in the summary", () => {
    render(
      <TaskTray autoDismissDelay={null}>
        <TaskTray.Task title="Buying labels" status="running" />
        <TaskTray.Task title="Bought 40 labels" status="succeeded" />
      </TaskTray>,
    );
    expect(screen.getByText("1 of 2 tasks running")).toBeInTheDocument();
  });

  it("should support a custom summary", () => {
    render(
      <TaskTray renderSummary={(running, total) => `${running}/${total} busy`}>
        <TaskTray.Task title="Buying labels" status="running" />
        <TaskTray.Task title="Generating manifest" status="running" />
      </TaskTray>,
    );
    expect(screen.getByText("2/2 busy")).toBeInTheDocument();
  });

  describe("progress", () => {
    it("should expose a determinate progress bar", () => {
      render(
        <TaskTray>
          <TaskTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
            unit="labels"
          />
        </TaskTray>,
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
        <TaskTray>
          <TaskTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
          />
        </TaskTray>,
      );
      expect(
        screen.getByRole("progressbar", { name: "Buying labels" }),
      ).toBeInTheDocument();
    });

    it("should render no progress bar without a total", () => {
      render(
        <TaskTray>
          <TaskTray.Task title="Generating manifest" status="running" />
        </TaskTray>,
      );
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("should drop the progress bar once the task is terminal", () => {
      render(
        <TaskTray autoDismissDelay={null}>
          <TaskTray.Task
            title="Bought 247 of 250 labels"
            status="partial"
            completed={250}
            total={250}
          />
        </TaskTray>,
      );
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  describe("expansion", () => {
    it("should be expanded by default", () => {
      render(
        <TaskTray>
          <TaskTray.Task title="Buying labels" status="running" />
        </TaskTray>,
      );
      const toggle = screen.getByRole("button", { expanded: true });
      expect(toggle).toHaveAttribute("aria-controls", expect.any(String));
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("should support starting collapsed", () => {
      render(
        <TaskTray defaultExpanded={false}>
          <TaskTray.Task title="Buying labels" status="running" />
        </TaskTray>,
      );
      expect(screen.getByRole("button", { expanded: false })).toBeVisible();
      // `hidden` takes the list out of the accessibility tree while its rows
      // stay mounted and their work keeps running.
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("should collapse and expand on press", async () => {
      const onExpandedChange = vi.fn();
      const { user } = render(
        <TaskTray onExpandedChange={onExpandedChange}>
          <TaskTray.Task title="Buying labels" status="running" />
        </TaskTray>,
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
        <TaskTray isExpanded onExpandedChange={onExpandedChange}>
          <TaskTray.Task title="Buying labels" status="running" />
        </TaskTray>,
      );
      await userClick(user, screen.getByRole("button", { expanded: true }));
      expect(onExpandedChange).toHaveBeenCalledWith(false);
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("should collapse on escape without dismissing anything", async () => {
      const onDismiss = vi.fn();
      const { user } = render(
        <TaskTray>
          <TaskTray.Task
            title="Buying labels"
            status="running"
            onDismiss={onDismiss}
          />
        </TaskTray>,
      );
      await userTab(user);
      await userKeyboard(user, "{Escape}");
      expect(screen.getByRole("button", { expanded: false })).toBeVisible();
      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe("dismissal", () => {
    it("should offer no dismiss button while the work is running", () => {
      render(
        <TaskTray>
          <TaskTray.Task
            title="Buying labels"
            status="running"
            onDismiss={vi.fn()}
          />
        </TaskTray>,
      );
      expect(
        screen.queryByRole("button", { name: "Dismiss Buying labels" }),
      ).not.toBeInTheDocument();
    });

    it("should dismiss a terminal task on press", async () => {
      const onDismiss = vi.fn();
      const { user } = render(
        <TaskTray autoDismissDelay={null}>
          <TaskTray.Task
            title="January report"
            status="failed"
            onDismiss={onDismiss}
          />
        </TaskTray>,
      );
      await userClick(
        user,
        screen.getByRole("button", { name: "Dismiss January report" }),
      );
      expect(onDismiss).toHaveBeenCalled();
    });

    it("should auto-dismiss a succeeded task", () => {
      const onDismiss = vi.fn();
      render(
        <TaskTray>
          <TaskTray.Task
            title="Bought 40 labels"
            status="succeeded"
            onDismiss={onDismiss}
          />
        </TaskTray>,
      );
      expect(onDismiss).not.toHaveBeenCalled();
      act(() => {
        vi.advanceTimersByTime(DEFAULT_AUTO_DISMISS_DELAY);
      });
      expect(onDismiss).toHaveBeenCalled();
    });

    it("should hold a failed task until the user dismisses it", () => {
      const onDismiss = vi.fn();
      render(
        <TaskTray>
          <TaskTray.Task
            title="January report"
            status="failed"
            description="The report timed out"
            onDismiss={onDismiss}
          />
        </TaskTray>,
      );
      act(() => {
        vi.advanceTimersByTime(DEFAULT_AUTO_DISMISS_DELAY * 10);
      });
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("should hold a partial task until the user dismisses it", () => {
      const onDismiss = vi.fn();
      render(
        <TaskTray>
          <TaskTray.Task
            title="Bought 247 of 250 labels"
            status="partial"
            onDismiss={onDismiss}
          />
        </TaskTray>,
      );
      act(() => {
        vi.advanceTimersByTime(DEFAULT_AUTO_DISMISS_DELAY * 10);
      });
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("should support disabling auto-dismissal", () => {
      const onDismiss = vi.fn();
      render(
        <TaskTray autoDismissDelay={null}>
          <TaskTray.Task
            title="Bought 40 labels"
            status="succeeded"
            onDismiss={onDismiss}
          />
        </TaskTray>,
      );
      act(() => {
        vi.advanceTimersByTime(DEFAULT_AUTO_DISMISS_DELAY * 10);
      });
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("should support a per-task auto-dismiss delay", () => {
      const onDismiss = vi.fn();
      render(
        <TaskTray autoDismissDelay={null}>
          <TaskTray.Task
            title="Bought 40 labels"
            status="succeeded"
            autoDismissDelay={1000}
            onDismiss={onDismiss}
          />
        </TaskTray>,
      );
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(onDismiss).toHaveBeenCalled();
    });

    it("should hold the timer while the pointer is inside the tray", async () => {
      const onDismiss = vi.fn();
      const { user } = render(
        <TaskTray>
          <TaskTray.Task
            title="Bought 40 labels"
            status="succeeded"
            onDismiss={onDismiss}
          />
        </TaskTray>,
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
        <TaskTray>
          <TaskTray.Task
            title="Bought 40 labels"
            status="succeeded"
            onDismiss={onDismiss}
          />
        </TaskTray>,
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
        <TaskTray>
          <TaskTray.Task
            title="Bought 40 labels"
            status="succeeded"
            onDismiss={onDismiss}
          />
        </TaskTray>,
      );
      await userTab(user);
      act(() => {
        vi.advanceTimersByTime(DEFAULT_AUTO_DISMISS_DELAY * 2);
      });
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("should render no dismiss button without an onDismiss", () => {
      render(
        <TaskTray>
          <TaskTray.Task title="Bought 40 labels" status="succeeded" />
        </TaskTray>,
      );
      expect(
        screen.queryByRole("button", { name: /^Dismiss/ }),
      ).not.toBeInTheDocument();
    });
  });

  describe("announcements", () => {
    it("should announce a terminal transition", () => {
      const { rerender } = render(
        <TaskTray>
          <TaskTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
          />
        </TaskTray>,
      );
      expect(getAnnouncement()).toBe("");

      rerender(
        <TaskTray>
          <TaskTray.Task
            title="Bought 247 of 250 labels"
            status="partial"
            description="3 shipments were missing a rate"
          />
        </TaskTray>,
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
        <TaskTray>
          <TaskTray.Task
            title="Buying labels"
            status="running"
            completed={127}
            total={250}
          />
        </TaskTray>,
      );
      rerender(
        <TaskTray>
          <TaskTray.Task
            title="Buying labels"
            status="running"
            completed={200}
            total={250}
          />
        </TaskTray>,
      );
      act(() => {
        vi.advanceTimersByTime(0);
      });
      expect(getAnnouncement()).toBe("");
    });

    it("should coalesce transitions landing in the same tick", () => {
      const { rerender } = render(
        <TaskTray autoDismissDelay={null}>
          <TaskTray.Task title="Buying labels" status="running" />
          <TaskTray.Task title="Generating manifest" status="running" />
        </TaskTray>,
      );
      rerender(
        <TaskTray autoDismissDelay={null}>
          <TaskTray.Task title="Buying labels" status="succeeded" />
          <TaskTray.Task title="Generating manifest" status="failed" />
        </TaskTray>,
      );
      act(() => {
        vi.advanceTimersByTime(0);
      });
      expect(getAnnouncement()).toBe(
        "Buying labels finished. Generating manifest failed.",
      );
    });
  });

  it("should render actions", async () => {
    const onPress = vi.fn();
    const { user } = render(
      <TaskTray>
        <TaskTray.Task title="Buying labels" status="running">
          <TaskTray.Action onPress={onPress}>Cancel</TaskTray.Action>
        </TaskTray.Task>
      </TaskTray>,
    );
    await userClick(user, screen.getByRole("button", { name: "Cancel" }));
    expect(onPress).toHaveBeenCalled();
  });

  it("should render a link action", () => {
    render(
      <TaskTray autoDismissDelay={null}>
        <TaskTray.Task title="Bought 247 of 250 labels" status="partial">
          <TaskTray.Action href="/shipments">Review</TaskTray.Action>
        </TaskTray.Task>
      </TaskTray>,
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
      <TaskTray autoDismissDelay={null}>
        <TaskTray.Task
          title="January report"
          status="failed"
          description="The report timed out"
        />
      </TaskTray>,
    );
    expect(screen.getByText("The report timed out")).toBeInTheDocument();
  });

  it("should portal into a custom container", () => {
    const container = document.createElement("div");
    container.setAttribute("data-testid", "custom-container");
    document.body.append(container);

    render(
      <TaskTray getContainer={() => container}>
        <TaskTray.Task title="Buying labels" status="running" />
      </TaskTray>,
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
          <TaskTray getContainer={() => frame}>
            <TaskTray.Task title="Buying labels" status="running" />
          </TaskTray>
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
      <TaskTray getContainer={() => null}>
        <TaskTray.Task title="Buying labels" status="running" />
      </TaskTray>,
    );
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("should ignore children that aren't tasks", () => {
    render(
      <TaskTray>
        <div>Not a task</div>
      </TaskTray>,
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
