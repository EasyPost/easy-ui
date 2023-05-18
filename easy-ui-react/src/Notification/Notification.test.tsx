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
import { mockGetComputedStyle, render } from "../utilities/test";

describe("<Notification />", () => {
  let restoreGetComputedStyle: () => void;

  beforeEach(() => {
    restoreGetComputedStyle = mockGetComputedStyle();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    restoreGetComputedStyle();
  });

  it("should render an alert notification", async () => {
    const { user } = render(
      <NotificationProvider>
        <SimulatedNotificationTrigger type="alert" />
      </NotificationProvider>,
    );
    await clickNotificationTrigger(user, screen.getByRole("button"));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should render a toast notification", async () => {
    const { user } = render(
      <NotificationProvider>
        <SimulatedNotificationTrigger />
      </NotificationProvider>,
    );
    await clickNotificationTrigger(user, screen.getByRole("button"));
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should check that toasts disappear after 4000ms", async () => {
    const { user } = render(
      <NotificationProvider>
        <SimulatedNotificationTrigger />
      </NotificationProvider>,
    );
    await clickNotificationTrigger(user, screen.getByRole("button"));
    act(() => {
      vi.advanceTimersByTime(TOAST_TIMEOUT_DURATION);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

async function clickNotificationTrigger(user: UserEvent, el: HTMLElement) {
  await act(async () => {
    await user.click(el);
    vi.runAllTimers();
  });
}

function SimulatedNotificationTrigger(props: NotificationProps) {
  const {
    type = "toast",
    message = "Hello World",
    status = "success",
    hasIcon = true,
    onDismiss,
  } = props;
  const { notification } = useNotification();
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
