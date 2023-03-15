# DropdownButton

```typescript
export type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "neutral"
  | "support"
  | "inverse";
export type ButtonVariant = "filled" | "outlined";

export type DropdownButtonProps = {
  /** Button color */
  // Defaults to primary
  color?: ButtonColor;
  /** Button variant */
  // Defaults to filled
  variant?: ButtonVariant;
  /** Disables button */
  // Defaults to false
  isDisabled?: boolean;
  /** Content inside button  */
  // Defaults to "Button"
  children?: ReactNode;
};
```

## Example

```jsx
import DropdownButton from "@easypost/easy-ui/Button";
// Filled
<DropdownButton color="primary" />
<DropdownButton color="secondary" />
<DropdownButton color="success" />
<DropdownButton color="warning" />
<DropdownButton color="neutral" />
// Outlined
<DropdownButton color="primary" variant="outlined" />
<DropdownButton color="secondary" variant="outlined" />
<DropdownButton color="success" variant="outlined" />
<DropdownButton color="support" variant="outlined" />
<DropdownButton color="inverse" variant="outlined" />
// Custom text
<DropdownButton>Login</DropdownButton>
// Click event
<DropdownButton onPress={myEventHandler} />
```
