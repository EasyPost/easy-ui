# Icon

```typescript
interface IconSymbol extends SVGProps<SVGSVGElement> {}

type IconSize = TokenNamespace<"size-icon">;
type ResponsiveIconSize = {
  [key in TokenNamespace<"breakpoint">]: IconSize;
};
type IconColor = TokenNamespace<"color">;

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
  size={{ sm: "sm", md: "md", lg: "lg" }}
  // color: default to currentColor, uses token color space
  color="status.info"
  accessibilityLabel="Add to cart"
/>;
```
