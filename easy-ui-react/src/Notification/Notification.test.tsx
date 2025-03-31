import { act, screen } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import React from "react";
import { vi } from "vitest";
import { Button } from "../Button";
import {
  NotificationProps,
  useNotification,
  NotificationProvider,
} from "./Notification";
import { TOAST_TIMEOUT_DURATION } from "./NotificationQueue";
import {
  disableReactTransitionGroup,
  enableReactTransitionGroup,
  mockGetComputedStyle,
  render,
  userClick,
} from "../utilities/test";

describe("<Notification />", () => {
  let restoreGetComputedStyle: () => void;

  beforeEach(() => {
    disableReactTransitionGroup();
    restoreGetComputedStyle = mockGetComputedStyle();
    vi.useFakeTimers();
  });

  afterEach(() => {
    enableReactTransitionGroup();
    vi.useRealTimers();
    restoreGetComputedStyle();
  });

  it("should render an alert notification", async () => {
    const { user } = render(
      <NotificationProvider>
        <SimulatedNotificationTrigger type="alert" message="Hello World" />
      </NotificationProvider>,
    );
    await clickNotification(user, screen.getByRole("button"));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("should render a toast notification", async () => {
    const { user } = render(
      <NotificationProvider>
        <SimulatedNotificationTrigger message="Hello World" />
      </NotificationProvider>,
    );
    await clickNotification(user, screen.getByRole("button"));
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should render a notification with a visible message", async () => {
    const { user } = render(
      <NotificationProvider>
        <SimulatedNotificationTrigger message="Hello World" />
      </NotificationProvider>,
    );
    await clickNotification(user, screen.getByRole("button"));
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("checks that toast notifications disappear after 4000ms", async () => {
    const { user } = render(
      <NotificationProvider>
        <SimulatedNotificationTrigger message="Hello World" />
      </NotificationProvider>,
    );
    await clickNotification(user, screen.getByRole("button"));
    act(() => {
      vi.advanceTimersByTime(TOAST_TIMEOUT_DURATION);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("checks that alert notifications can be dismissed", async () => {
    const { user } = render(
      <NotificationProvider>
        <SimulatedNotificationTrigger type="alert" message="Hello World" />
      </NotificationProvider>,
    );
    await clickNotification(user, screen.getByRole("button"));
    await clickNotification(user, screen.getAllByRole("button")[1]);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("should render a notification with appropriate status styles applied", async () => {
    const { user } = render(
      <NotificationProvider>
        <SimulatedNotificationTrigger
          type="alert"
          message="Hello World"
          status="promotional"
        />
      </NotificationProvider>,
    );
    await clickNotification(user, screen.getByRole("button"));
    expect(screen.getByRole("alertdialog")).toHaveAttribute(
      "class",
      expect.stringContaining("statusPromotional"),
    );
  });

  it("should render a notification with appropriate type styles applied", async () => {
    const { user } = render(
      <NotificationProvider>
        <SimulatedNotificationTrigger type="alert" message="Hello World" />
      </NotificationProvider>,
    );
    await clickNotification(user, screen.getByRole("button"));
    expect(screen.getByRole("alertdialog")).toHaveAttribute(
      "class",
      expect.stringContaining("typeAlert"),
    );
  });

  it("should render a notification with an icon", async () => {
    const { user } = render(
      <NotificationProvider>
        <SimulatedNotificationTrigger message="Hello World" />
      </NotificationProvider>,
    );
    await clickNotification(user, screen.getByRole("button"));
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should render a notification without an icon", async () => {
    const { user } = render(
      <NotificationProvider>
        <SimulatedNotificationTrigger message="Hello World" hasIcon={false} />
      </NotificationProvider>,
    );
    await clickNotification(user, screen.getByRole("button"));
    expect(screen.queryByRole("img", { hidden: true })).not.toBeInTheDocument();
  });
});

async function clickNotification(user: UserEvent, el: HTMLElement) {
  await userClick(user, el);
}

function SimulatedNotificationTrigger(props: NotificationProps) {
  const {
    type = "toast",
    message,
    status = "success",
    hasIcon = true,
    onDismiss,
  } = props;
  const notification = useNotification();
  const handlePress = () => {
    if (type === "toast") {
      if (status === "promotional") {
        notification.showPromotionalToast({ message, hasIcon });
      } else {
        notification.showSuccessToast({ message, hasIcon });
      }
    } else {
      if (status === "promotional") {
        notification.showPromotionalAlert({ message, hasIcon, onDismiss });
      } else {
        notification.showSuccessAlert({ message, hasIcon, onDismiss });
      }
    }
  };

  return <Button onPress={handlePress}>Trigger</Button>;
}
