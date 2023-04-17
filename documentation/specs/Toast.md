# `Toast` Component Specification

## Overview

The `Toast` component displays a brief non-disruptive message to the user as a result of an action taken. The displayed message is accompanied by an associated `status` icon and cannot be manually dismissed. **Not** to be used to display critical information such as a system failure, see the `Alert` component for such behavior.

### Use Cases

- Inform user of a completed action such as an account creation.
- Inform user that an asynchronous process has been triggered based on their action.

### Features

- ARIA `role="status"`

### Risks and Challenges

- Unlike other components, `Toast` components are unique in that they may be quite opinionated with regards to how they display and the kind of control they give consumers.
- Building for the shipper's experience at EasyPost according to internal specs while maintaining a pleasant DX for outside consumers.

---

## Design

### API

```typescript
export type ToastStatus =
  | "primary"
  | "success"
  | "secondary"
  | "error"
  | "warning";
export type ToastProps = {
  /**
   * Toast status color
   * @default "success"
   */
  status?: ToastStatus;
  /**
   * Toast content
   */
  children?: ReactNode;
};
```

### Example Usage

The `Toast` component on its own is not concerned with application architecture and is purely presentational. Although this is essentially true for all of Easy UI's components and in general is a feature of all component libraries, the `Toast` component requires more consideration given its use in practice. That is to say, toasts are displayed as a result of some action, and the rendering strategy to display a `Toast` or perhaps a list of toasts, may be intertwined with the application's architecture or state management system.

Below is a basic example for how to import and use the `Toast` component:

_Default_

```tsx
import Toast from "@easypost/easy-ui/Toast";

<Toast>Account Created</Toast>;
```

As mentioned above, it is unlikely the `Toast` component will be used in this way. Below is a relatively detailed example for how one might use the `Toast` component. Note that this is **not** production ready, nor is it the best solution, but it is a viable starting point.

For this example, we will want to render toasts that dismiss automatically after 4000 ms and can be triggered after a user action. Typically we want toasts to render at a specific place in the application and be reusable across multiple components. To accomplish this, we will use `createPortal` from `react-dom`. We will also want to ensure when unmounting, we are appropriately cleaning up the DOM. The rendering of multiple toasts will be handled by the `ToastList` component; of course, wherever we use `ToastList` we want to ensure the immediate parent does **not** have to handle maintaining a list of toasts. There are several ways to accomplish this, we could reach for a state management solution such as `redux`, we could use `context` or as is done below for simplicity, making use of `forwardRef` and `useImperativeHandler`. Putting these ideas together, we get:

```tsx
import Toast from "@easypost/easy-ui/Toast";
import { uniqueIdGenerator } from "your-favorite-library-for-unique-ids";
import ReactDOM from "react-dom";
import { useState, forwardRef, useImperativeHandle } from "react";

// Hook
export const useToastContainer = () => {
  const [isReady, setIsReady] = useState(false);
  const [containerId] = useState(`a-toast-container-${uniqueIdGenerator()}`);

  useEffect(() => {
    const div = document.createElement("div");
    div.id = containerId;
    div.setAttribute("style", "position: fixed; top: 0%; right: 50%");
    document.getElementsByTagName("body")[0].prepend(div);

    setIsReady(true);

    //Clean up
    return () => {
      document.getElementsByTagName("body")[0].removeChild(div);
    };
  }, [containerId]);

  return { isReady, containerId };
};

// Hook
export const useToastDismiss = ({ toasts, setToasts, duration }) => {
  const [dismissing, setDismissing] = useState("");

  useEffect(() => {
    if (dismissing) {
      setToasts((t) => t.filter((_t) => _t.id !== dismissing));
    }
  }, [dismissing, setToasts]);

  useEffect(() => {
    if (toasts.length) {
      const id = toasts[toasts.length - 1].id;
      setTimeout(() => setDismissing(id), duration);
    }
  }, [toasts, duration]);
};

// ToastList, typing omitted
export const ToastList = forwardRef(({ duration = 4000 }, ref) => {
  const [toasts, setToasts] = useState([]);
  const { isReady, containerId } = useToastContainer();

  useToastDismiss({
    toasts,
    setToasts,
    duration,
  });

  useImperativeHandle(ref, () => ({
    queue(toast) {
      setToasts([...toasts, { ...toast, id: uniqueIdGenerator() }]);
    },
  }));

  return isReady
    ? ReactDOM.createPortal(
        <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
          {toasts.map((t) => (
            <Toast key={t.id} status={t.status}>
              {t.message}
            </Toast>
          ))}
        </div>,

        document.getElementById(containerId),
      )
    : null;
});
```

To use, we now just need to import `ToastList` somewhere in our application where we want to display a toast and we can queue a message:

```tsx
import Button from "@easypost/easy-ui/Button";
import ToastList from "a-place-in-your-app";
import { useRef } from "react";

function Component() {
  const toastRef = useRef();

  const handleSignUp = () => {
    // inform user of successful account creation
    toastRef.current.queue({ message: "Account Created", status: "success" });
  };

  return (
    <>
      <Button onPress={handleSignUp}>Sign up</Button>
      <ToastList ref={toastRef} />
    </>
  );
}
```

## Behavior

### Accessibility

The `Toast` component has an ARIA `role="status"` and elements with the role status have an implicit `aria-live` value of `polite` and an implicit `aria-atomic` value of `true`. Toasts are **not** suitable for dynamically changing content, consider using the `Alert` component for such a use case.

The `Toast` component does not provide a way for the user to manually dismiss the message, hence toasts should timeout after some time. When making decisions on the timeout duration, consider that users have different reading speeds, vision levels, and literacy levels. Avoid messages longer than a sentence and avoid rendering interactive elements within toasts that require the user to act.
