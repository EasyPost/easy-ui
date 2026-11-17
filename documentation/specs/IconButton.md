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
export type IconButtonSize = "xs" | "sm" | "md";
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
  /**
   * Button size. `sm` and `md` match `<Button />`'s heights (32px and
   * 48px). `xs` is 24px, a 24px icon with no padding, the height of a
   * line of `body1` text, for actions inline with text or in a table
   * row. `xs` is only supported with the `ghost` variant.
   * @default "md"
   */
  size?: IconButtonSize;
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
// Ghost: transparent and borderless at rest, light neutral fill on hover,
// solid primary.700 fill while a menu or popover it triggers is open
// (aria-expanded). Supports primary, secondary, and support.
<IconButton color="primary" variant="ghost" icon={ArrowBackIcon} accessibilityLabel="Back" />
<IconButton color="support" variant="ghost" size="sm" icon={ArrowBackIcon} accessibilityLabel="Back" />
// Ghost at text height (24px), inline beside a value or in a table row.
// <KebabButton /> and <DataGrid />'s row actions render this.
<IconButton color="support" variant="ghost" size="xs" icon={DeleteIcon} accessibilityLabel="Delete" />
// Click event
<IconButton  icon={ArrowBackIcon} accessibilityLabel="Back"  onPress={myEventHandler} />
```
