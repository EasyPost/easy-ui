# Icon

```typescript
interface IconSymbol extends SVGProps<SVGSVGElement> {}

type DesignTokens = keyof typeof designTokens;
type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
type IconSize = "sm" | "md";
type ResponsiveIconSize = {
  [key in Breakpoint]: IconSize;
};
type IconColor = StartsWith<DesignTokens, "color">;

interface Icon {
  symbol: ReactElement<IconSymbol>;
  size?: IconSize | ResponsiveIconSize;
  color?: IconColor;
  accessibilityLabel?: string;
}
```

## Example

```jsx
import Icon from "@easypost/easy-ui/Icon";
import ChevronIcon from "@easypost/easy-ui-icons/Chevron";

<Icon
  symbol={ChevronIcon}
  // size: uses t-shirt sizes. defaults to md
  size="lg"
  // size: as responsive size prop
  size={{ sm: "xs", md: "sm", ["arbitrary"]: "xl" }}
  // color: default to currentColor, uses token color space
  color="status.info"
  accessibilityLabel="Add to cart"
/>;
```
