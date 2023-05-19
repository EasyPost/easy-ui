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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { notification } = useNotification();

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

export const CustomPlacement: Story = {
  render: () => {
    return (
      <EasyUIProvider
        colorScheme="system"
        notificationPlacementOffset={{
          top: "50px",
          left: "0px",
          right: "0px",
          bottom: "0px",
        }}
      >
        <SimulatedNotificationTrigger message="Hello World" />
      </EasyUIProvider>
    );
  },
};

function SimulatedNotificationTrigger(props: NotificationProps) {
  const { message } = props;
  const { notification } = useNotification();

  return (
    <Button onPress={() => notification.showSuccessToast({ message })}>
      Success Toast
    </Button>
  );
}
