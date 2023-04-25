---
status: Approved
date: 2023-04-25
deciders: stephenjwatkins, OskiTheCoder, ldewald
---

# Support UnstyledButton component

## Context and Problem Statement

Easy UI needs to support a button that does the heavy lifting with regards to behavior and accessibility while not being opinionated with styling and the content it renders.

## Decision Drivers

- Non-disruptive to existing components
- Accessibility
- Easy to maintain
- Easy to use
- Reusable across multiple components

## Options Considered

- Create an `UnstyledButton` component that is internal to Easy UI.
- Extend existing `IconButton` to support `UnstyledButton` functionality.

## Decision Outcome

After consideration, we have decided to move forward with creating an `UnstyledButton` component that is internal to Easy UI. Extending the `IconButton` would require additional thought into how to maintain a minimal and sensible API with additional complexity; also, we would likely be limited in the kind of content the variant would be able to support. With an internal `UnstyledButton` component, we don't have to disrupt any existing components and we can configure it to suit our needs without needing to consider outside use. To that point, since we wouldn't need to consider outside consumption, it should be slightly easier to maintain and handle breaking changes.

## Design

Similar to the `Button`, `DropdownButton`, and `IconButton` components, the `UnstyledButton` component will make use of React Aria's `useButton` hook to manage behavior and accessibility concerns.

### API

```ts
export type UnstyledButtonProps = AriaButtonProps<"button"> & {
  /** Content to render */
  children?: ReactNode;
  /* Classname to apply styles to button */
  className?: string;
  /**
   * Disables button
   * @default false
   */
  isDisabled?: boolean;
};
```

### Anatomy

```tsx
import { useButton } from "react-aria";
import { classNames } from "../utilities/css";

export function UnstyledButton(props: UnstyledButtonProps) {
  const { className, isDisabled = false, children = "Button" } = props;

  const ref = useRef(null);
  const { buttonProps } = useButton(props, ref);

  return (
    <button
      disabled={isDisabled}
      ref={ref}
      className={classNames(className)}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
```

### Example

One common use case for the `UnstyledButton` is to render a clickable icon.

```tsx
import CloseIcon from "@easypost/easy-ui-icons/Close";
import { UnstyledButton } from "../UnstyledButton";
import { Icon } from "../Icon";
import styles from "./EasyUIComponent.module.scss";

export function EasyUIComponent() {
  const handleClose = () => {
    /** callback */
  };

  return (
    <div>
      {/** EasyUIComponent markup/logic  */}
      <UnstyledButton className={styles.closeButton} onPress={handleClose}>
        <Icon symbol={CloseIcon} />
      </UnstyledButton>
    </div>
  );
}
```
