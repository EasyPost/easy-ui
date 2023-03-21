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
  // Defaults to primary
  color?: ButtonColor;
  /** Button variant */
  // Defaults to filled
  variant?: IconButtonVariant;
  /** Icon symbol SVG source from @easypost/easy-ui-icons */
  // Required
  symbol: IconSymbol;
  /** Disables button */
  // Defaults to false
  isDisabled?: boolean;
};
```

## Example

```jsx
import IconButton from "@easypost/easy-ui/IconButton";
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
// Filled
<IconButton color="primary" symbol={ArrowBackIcon} />
<IconButton color="secondary" symbol={ArrowBackIcon} />
<IconButton color="success" symbol={ArrowBackIcon} />
<IconButton color="warning" symbol={ArrowBackIcon} />
<IconButton color="neutral" symbol={ArrowBackIcon} />
// Outlined
<IconButton color="primary" variant="outlined" symbol={ArrowBackIcon} />
<IconButton color="secondary" variant="outlined" symbol={ArrowBackIcon} />
<IconButton color="success" variant="outlined" symbol={ArrowBackIcon} />
<IconButton color="support" variant="outlined" symbol={ArrowBackIcon} />
<IconButton color="inverse" variant="outlined" symbol={ArrowBackIcon} />
// Click event
<IconButton symbol={ArrowBackIcon} onPress={myEventHandler} />
```
