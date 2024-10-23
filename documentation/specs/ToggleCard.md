# `ToggleCard` Component Specification

## Overview

A `ToggleCard` is a styled container with an interactive header featuring a toggle control.

### Use Cases

- Use when displaying grouped and related content where an "on/off" or "yes/no" input is needed to signify activation.

### Features

- Toggle control supports all features of the `<Toggle />` component
- Header alignment can be flipped
- Header and body are broken into composable pieces

## Design

A `ToggleCard` is a simple compound component consisting of`ToggleCard.Header` and `ToggleCard.Body`. It is built on top of the existing `Toggle` and `Card` components.

The `ToggleCard.Header` will be responsible for rendering the `Toggle` as well as header content passed by the consumer. The `ToggleCard.Body` will be responsible for rendering the body content passed by the consumer. Note, the consumer will **not** need to pass in the `Toggle` component directly, they will only need to pass in the custom header content to render alongside the toggle control in the header.

No new external dependencies will be introduced.

### API

```ts
export type ToggleCardProps = {
  /**
   * The children of the <ToggleCard> element. Should render
   * `<ToggleCard.Header>` and `<ToggleCard.Body>`
   */
  children: ReactNode;
};

export type ToggleCardHeaderProps = ToggleProps & {
  /**
   * Flips alignment for header content. By default,
   * the toggle control is right aligned.
   * @default false
   */
  isAligmentFlipped?: boolean;
  /**
   * Header content of card
   */
  children: ReactNode;
};

export type ToggleCardBodyProps = {
  /**
   * Body content of card
   */
  children: ReactNode;
};
```

### Example Usage

_Controlled:_

```tsx
import { ToggleCard } from "@easypost/easy-ui/ToggleCard";
import { Text } from "@easypost/easy-ui/Text";

function Component() {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <ToggleCard>
      <ToggleCard.Header
        isSelected={isSelected}
        onChange={(isSelected) => setIsSelected(isSelected)}
        aria-labelledby="some id"
      >
        <Text id="some id" variant="subtitle1" color="primary.900">
          Header
        </Text>
      </ToggleCard.Header>
      <ToggleCard.Body>Content</ToggleCard.Body>
    </ToggleCard>
  );
}
```

_Flipped alignment:_

```tsx
import { ToggleCard } from "@easypost/easy-ui/ToggleCard";
import { Icon } from "../Icon";


function Component() {
  const PoweredByEasyPostLogo = () => <Image src="./logo.png" />;
  return (
    <ToggleCard>
      <ToggleCard.Header aria-label="carrier activation" isAligmentFlipped>
        <Icon size="sm" symbol={PoweredByEasyPostLogo}>
      </ToggleCard.Header>
      <ToggleCard.Body>
        <button>
          <Image src="./carrier.png" />;
        </button>
      </ToggleCard.Body>
    </ToggleCard>
  );
}
```

_Disabled:_

```tsx
import { ToggleCard } from "@easypost/easy-ui/ToggleCard";
import { Text } from "@easypost/easy-ui/Text";

function Component() {
  return (
    <ToggleCard>
      <ToggleCard.Header isDisabled aria-labelledby="some id">
        <Text id="some id" variant="subtitle1" color="primary.900">
          Header
        </Text>
      </ToggleCard.Header>
      <ToggleCard.Body>Content</ToggleCard.Body>
    </ToggleCard>
  );
}
```

_Read only:_

```tsx
import { ToggleCard } from "@easypost/easy-ui/ToggleCard";
import { Text } from "@easypost/easy-ui/Text";

function Component() {
  return (
    <ToggleCard>
      <ToggleCard.Header isSelected isReadOnly aria-labelledby="some id">
        <Text id="some id" variant="subtitle1" color="primary.900">
          Header
        </Text>
      </ToggleCard.Header>
      <ToggleCard.Body>Content</ToggleCard.Body>
    </ToggleCard>
  );
}
```

### Anatomy

```tsx
import { Toggle } from "../Toggle";
import { Card } from "../Card";
import { HorizontalGrid } from "../HorizontalGrid";

export function ToggleCard(props: ToggleCardProps) {
  const { children } = props;

  return (
      <Card.Container>{children}</Card.Container>
  );
}

function ToggleCardHeader(props: ToggleCardHeaderProps) {
  const { children, isAligmentFlipped = false, ...toggleProps } = props;

  return (
    <HorizontalStack>
      <Card.Area>
        {isAlignmentFlipped ? (
          <>
            <Toggle {...toggleProps} />
            {children}
          </>
        ) : (
          {children}
          <Toggle {...toggleProps} />
        )}
      </Card.Area>
    </HorizontalStack>
  );
}

function ToggleCardBody(props: ToggleCardBodyProps) {
  const { children } = props;

  return (
    <Card.Area>
      {children}
    </Card.Area>
  );
}

ToggleCard.Header = ToggleCardHeader;


ToggleCard.Body = ToggleCardBody;
```

---

## Behavior

### Accessibility

There are no major accessibility concerns to highlight for this component

### Dependencies

There are no major dependencies to highlight for this component
