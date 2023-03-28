# IconButton

```typescript
export type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "neutral"
  | "support"
  | "inverse";
export type IconButtonVariant = "filled" | "outlined";
export type IconButtonProps = {
  /** Button color */
  /** @default "primary" */
  color?: ButtonColor;
  /** Button variant */
  /** @default "filled" */
  variant?: IconButtonVariant;
  /** Icon symbol */
  iconSymbol: IconSymbol;
  /** Description of icon */
  accessibilityLabel: string;
  /** Disables button */
  /** @default false */
  isDisabled?: boolean;
};
```

## Example

```jsx
import IconButton from "@easypost/easy-ui/IconButton";
import Icon from "@easypost/easy-ui/Icon"
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
// Filled
<IconButton color="primary"  icon={<Icon symbol={ArrowBackIcon} accessibilityLabel="arrow back" />} />
<IconButton color="secondary"  icon={<Icon symbol={ArrowBackIcon} accessibilityLabel="arrow back" />} />
<IconButton color="success"  icon={<Icon symbol={ArrowBackIcon} accessibilityLabel="arrow back" />} />
<IconButton color="warning"  icon={<Icon symbol={ArrowBackIcon} accessibilityLabel="arrow back" />} />
<IconButton color="neutral"  icon={<Icon symbol={ArrowBackIcon} accessibilityLabel="arrow back" />} />
// Outlined
<IconButton color="primary" variant="outlined"  icon={<Icon symbol={ArrowBackIcon} accessibilityLabel="arrow back" />} />
<IconButton color="secondary" variant="outlined"  icon={<Icon symbol={ArrowBackIcon} accessibilityLabel="arrow back" />} />
<IconButton color="success" variant="outlined"  icon={<Icon symbol={ArrowBackIcon} accessibilityLabel="arrow back" />} />
<IconButton color="support" variant="outlined"  icon={<Icon symbol={ArrowBackIcon} accessibilityLabel="arrow back" />} />
<IconButton color="inverse" variant="outlined"  icon={<Icon symbol={ArrowBackIcon} accessibilityLabel="arrow back" />} />
// Click event
<IconButton  icon={<Icon symbol={ArrowBackIcon} accessibilityLabel="arrow back" />} onPress={myEventHandler} />
```
