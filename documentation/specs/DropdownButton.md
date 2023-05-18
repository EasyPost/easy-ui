# `DropdownButton` Component Specification

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
export type DropdownButtonVariant = "filled" | "outlined";
export type DropdownButtonProps = {
  /**
   * Button color
   * @default "primary"
   */
  color?: ButtonColor;
  /**
   * Button variant
   * @default "filled"
   */
  variant?: DropdownButtonVariant;
  /**
   * Disables button
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Content inside button
   * @default "Button"
   */
  children?: ReactNode;
};
```

### Example Usage

```tsx
import { DropdownButton } from "@easypost/easy-ui/DropdownButton";
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
