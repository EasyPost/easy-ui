import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  Notification,
  NotificationProps,
  useNotification,
} from "./Notification";
import { Provider as EasyUIProvider } from "../Provider";
import { Button } from "../Button";
import { InlineStoryDecorator } from "../utilities/storybook";

type Story = StoryObj;

const meta: Meta<typeof Notification> = {
  title: "Components/Notification",
  argTypes: {},
};

export default meta;

export const Notifications: Story = {
  render: () => {
    const notification = useNotification();

    return (
      <>
        <Button
          onPress={() => notification.showSuccessToast({ message: "Success" })}
        >
          Success Toast
        </Button>
        <Button
          onPress={() => notification.showSuccessAlert({ message: "Success" })}
        >
          Success Alert
        </Button>
        <Button
          onPress={() =>
            notification.showPromotionalToast({ message: "Promotional" })
          }
        >
          Promotional Toast
        </Button>
        <Button
          onPress={() =>
            notification.showPromotionalAlert({ message: "Promotional" })
          }
        >
          Promotional Alert
        </Button>
        <Button
          onPress={() => notification.showNeutralToast({ message: "Neutral" })}
        >
          Neutral Toast
        </Button>
        <Button
          onPress={() => notification.showNeutralAlert({ message: "Neutral" })}
        >
          Neutral Alert
        </Button>
        <Button
          onPress={() => notification.showWarningToast({ message: "Warning" })}
        >
          Warning Toast
        </Button>
        <Button
          onPress={() => notification.showWarningAlert({ message: "Warning" })}
        >
          Warning Alert
        </Button>
        <Button
          onPress={() => notification.showErrorToast({ message: "Error" })}
        >
          Error Toast
        </Button>
        <Button
          onPress={() => notification.showErrorAlert({ message: "Error" })}
        >
          Error Alert
        </Button>
        <Button
          onPress={() =>
            notification.showSuccessToast({
              message: "Success",
              hasIcon: false,
            })
          }
        >
          Without icon
        </Button>
        <Button
          onPress={() =>
            notification.showSuccessAlert({
              message: "Success",
              onDismiss: () => alert("alert has been dismissed"),
            })
          }
        >
          Dismiss callback
        </Button>
      </>
    );
  },

  decorators: [InlineStoryDecorator],
};

export const ProgrammaticDismissal: Story = {
  render: () => {
    const notification = useNotification();

    return (
      <>
        <Button
          onPress={() => notification.showSuccessAlert({ message: "Success" })}
          color="neutral"
        >
          Trigger Alert
        </Button>
        <Button
          onPress={() => notification.closeActiveNotification()}
          color="neutral"
        >
          Click to dismiss
        </Button>
      </>
    );
  },

  decorators: [InlineStoryDecorator],
};

export const CustomPlacement: Story = {
  render: () => {
    return (
      <EasyUIProvider
        colorScheme="system"
        notificationPlacement={{
          offset: { top: "80px", left: "0px" },
        }}
      >
        <SimulatedNotificationTrigger message="Hello World" />
      </EasyUIProvider>
    );
  },
};

export const CustomPlacementWithinContainer: Story = {
  render: () => {
    return (
      <EasyUIProvider
        colorScheme="system"
        notificationPlacement={{
          offset: { top: "50px", left: "0px" },
          position: "absolute",
          getContainer: () => document.getElementById("test-container"),
        }}
      >
        <>
          <div
            id="test-container"
            style={{
              position: "relative",
              border: "1px solid black",
              padding: "16px 8px",
              minHeight: "104px",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            Container
          </div>
          <SimulatedNotificationTrigger message="Hello World" />
        </>
      </EasyUIProvider>
    );
  },
};

function SimulatedNotificationTrigger(props: NotificationProps) {
  const { message } = props;
  const notification = useNotification();

  return (
    <Button
      color="secondary"
      onPress={() => notification.showNeutralToast({ message })}
    >
      Neutral Toast
    </Button>
  );
}
