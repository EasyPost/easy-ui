# `IconButton` Component Specification

## Design

### API

```ts
export type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "neutral"
  | "support"
  | "inverse";
export type IconButtonVariant = "filled" | "outlined" | "ghost";
export type IconButtonProps = {
  /**
   * Button color
   * @default "primary"
   */
  color?: ButtonColor;
  /**
   * Button variant
   * @default "filled"
   */
  variant?: IconButtonVariant;
  /** Icon symbol */
  icon: IconSymbol;
  /** Description of icon */
  accessibilityLabel: string;
  /**
   * Disables button
   * @default false
   */
  isDisabled?: boolean;
};
```

### Example Usage

```tsx
import { IconButton } from "@easypost/easy-ui/IconButton";
import Icon from "@easypost/easy-ui/Icon"
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
// Filled
<IconButton color="primary"  icon={ArrowBackIcon} accessibilityLabel="Back" />
<IconButton color="secondary"  icon={ArrowBackIcon} accessibilityLabel="Back"  />
<IconButton color="success"  icon={ArrowBackIcon} accessibilityLabel="Back"  />
<IconButton color="warning"  icon={ArrowBackIcon} accessibilityLabel="Back"  />
<IconButton color="neutral"  icon={ArrowBackIcon} accessibilityLabel="Back"  />
// Outlined
<IconButton color="primary" variant="outlined"  icon={ArrowBackIcon} accessibilityLabel="Back"  />
<IconButton color="secondary" variant="outlined"  icon={ArrowBackIcon} accessibilityLabel="Back"  />
<IconButton color="success" variant="outlined"  icon={ArrowBackIcon} accessibilityLabel="Back"  />
<IconButton color="support" variant="outlined"  icon={ArrowBackIcon} accessibilityLabel="Back"  />
<IconButton color="inverse" variant="outlined"  icon={ArrowBackIcon} accessibilityLabel="Back"  />
// Ghost: transparent and borderless at rest, light neutral fill on hover.
// Supports primary, secondary, and support.
<IconButton color="primary" variant="ghost" icon={ArrowBackIcon} accessibilityLabel="Back" />
<IconButton color="secondary" variant="ghost" icon={ArrowBackIcon} accessibilityLabel="Back" />
<IconButton color="support" variant="ghost" icon={ArrowBackIcon} accessibilityLabel="Back" />
// Click event
<IconButton  icon={ArrowBackIcon} accessibilityLabel="Back"  onPress={myEventHandler} />
```
