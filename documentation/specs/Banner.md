# Banner Component Specification

## Overview

The `Banner` component displays a prominent message above the navigation bar at the top of the page that cannot be dismissed.

### Use Cases

The primary use case of the `Banner` component is to inform the user of promotions and other offerings on the marketing (logged out) site. **Not** to be used to call attention to the user as a result of interacting with the UI.

---

## Design

### API

```typescript
export type BannerColor = "primary" | "success" | "neutral";
export type BannerProps = {
  /**
   * Banner color
   * @default "primary"
   */
  color?: BannerColor;
  /**
   * Content to display
   */
  children: ReactNode;
};
```

### Example Usage

```tsx
import Banner from "@easypost/easy-ui/Banner";
import Text from "@easypost/easy-ui/Text";

<Banner color="success">
  <Text variant="subtitle1">
    Limited Time Only:
  <Text>
  <Text variant="body1">
    Get your first $250 of labels free!
  <Text>
</Banner>
```
