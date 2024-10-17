# `Pill` Component Specification

## Overview

A `Pill` is a compact element that displays contextual text typically representing selections or options; they can be dismissed as well as accompanied by an icon.

### Use Cases

- Display selections or options made by the user or system

### Features

- Supports icons
- Supports dismissal

### Risks and Challenges

- Ensuring ease of use

### Prior Art

Not a 1 to 1, but similar:

- [MUI `<Chip />`](https://mui.com/material-ui/react-chip/)
- [Polaris `<Tag />`](https://polaris.shopify.com/components/selection-and-input/tag?example=tag-removable)
- [React Aria `<TagGroup />`](https://react-spectrum.adobe.com/react-aria/TagGroup.html)

---

## Design

A `Pill` is a fairly straightforward component with no external dependencies and it does not require the use of any React Aria primitives. For icons and dismissal support, this component will follow existing patterns in Easy UI.

### API

```ts
export type PillProps = {
  /** Text label */
  children: ReactNode;
  /** Left aligned icon */
  icon?: IconSymbol;
  /** Callback function when dismissing Pill */
  onDismiss?: () => void;
};
```

### Example Usage

_With icon:_

```tsx
import { Pill } from "@easypost/easy-ui/Pill";
import SettingsIcon from "@easypost/easy-ui-icons/Settings";

function Component() {
  return <Pill icon={SettingsIcon}>First Last #12345</Pill>;
}
```

_With image:_

```tsx
import { Pill } from "@easypost/easy-ui/Pill";

function Component({ carrier }) {
  const CarrierImage = () => <Image src={`/${carrier}.png`} />;
  return <Pill icon={CarrierImage}>First Last #12345</Pill>;
}
```

_Dismissal:_

```tsx
import { useState, useCallback } from "react";
import { Pill } from "@easypost/easy-ui/Pill";

function Component() {
  const [pills, setPills] = useState<{ id: number; text: string }[]>([
    { id: 0, text: "FooBar 123" },
    { id: 1, text: "FooBar 456" },
    { id: 2, text: "FooBar 789" },
  ]);

  const handleDismissal = useCallback((id: number) => {
    setPills((prevPills) => prevPills.filter((pill) => pill.id !== id));
  }, []);

  return (
    <>
      {pills.map((pill) => (
        <Pill key={pill.id} onDismiss={() => handleDismissal(pill.id)}>
          {pill.text}
        </Pill>
      ))}
    </>
  );
}
```

### Anatomy

```tsx
import CloseIcon from "@easypost/easy-ui-icons/Close";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { UnstyledButton } from "../UnstyledButton";

export function Pill(props: PillProps) {
  const { children, icon, onDismiss } = props;

  const className = classNames(styles.root);

  return (
    <span className={className}>
      {icon && <Icon size="xs" symbol={icon} />}
      <Text>{children}</Text>
      <UnstyledButton>
        <Icon size="xs" symbol={CloseIcon} />
      </UnstyledButton>
    </span>
  );
}
```

---

## Behavior

### Accessibility

There are no major accessibility concerns to highlight for this component

### Dependencies

There are no major dependencies to highlight for this component
