# `PillGroup` Component Specification

## Overview

A `<PillGroup />` displays a focusable list of labels, categories, keywords, or filters; individual pills can be dismissed as well as accompanied by an icon.

### Use Cases

- Display selections or options made by the user or system

### Features

- Supports icons
- Supports dismissal

### Risks and Challenges

- Ensuring ease of use

### Prior Art

Not a 1 to 1, but similar:

- [MUI `<Chip />`](https://mui.com/material-ui/react-chip/)
- [Polaris `<Tag />`](https://polaris.shopify.com/components/selection-and-input/tag?example=tag-removable)
- [React Aria `<TagGroup />`](https://react-spectrum.adobe.com/react-aria/TagGroup.html)

---

## Design

A `<PillGroup />` is a compound component and individual pills will render via `<PillGroup.Pill />`. It will make use of `react-aria-components`, specifically `TagGroup`, `TagList`, `Tag`, `Label`, and `Button`.

For icons and dismissal support, this component will follow existing patterns in Easy UI.

### API

```ts
export type PillBackground = ThemeTokenNamespace<"color">;

type horizontalStackContainerProps = {
  /** Horizontal alignment of children */
  align?: Align;
  /** Vertical alignment of children */
  blockAlign?: BlockAlign;
  /** Whether or not the horizontal stack uses inline-flex instead of flex. */
  inline?: boolean;
  /**
   * The spacing between elements. Accepts a spacing token or an object of spacing tokens for different screen sizes.
   * @example
   * gap='2'
   * gap={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
   */
  gap?: ResponsiveSpaceScale;
  /**
   * Wrap stack elements to additional rows as needed on small screens
   * @default true
   */
  wrap?: boolean;
};

// onRemove (keys: Set<Key>) => void
export type PillGroupProps<T> = Pick<TagGroupProps, "onRemove"> &
  Pick<TagListProps<T>, "items" | "children"> & {
    /** Label for grouping */
    label: string;
    /** HorizontalStack props except children and as */
    horizontalStackContainerProps?: Omit<
      HorizontalStackProps,
      "children" | "as"
    >;
    /** The background of individual pills. Maps to token theme colors. */
    background?: PillBackground;
    /**
     * Whether or not individual pills have a border.
     *
     * @default false
     */
    isBorderless?: boolean;
  };

export type PillProps = {
  /** Left aligned icon */
  icon?: IconSymbol;
  /** Visual label for individual pill */
  label: string;
};
```

### Example Usage

_With icon:_

```tsx
import { PillGroup } from "@easypost/easy-ui/PillGroup";
import SettingsIcon from "@easypost/easy-ui-icons/Settings";

function Component() {
  return (
    <PillGroup label="Orders">
      <PillGroup.Pill label="First Last #123" icon={SettingsIcon} />
      <PillGroup.Pill label="First Last #456" icon={SettingsIcon} />
      <PillGroup.Pill label="First Last #789" icon={SettingsIcon} />
    </PillGroup>
  );
}
```

_With image:_

```tsx
import { PillGroup } from "@easypost/easy-ui/Pill";

function Component({ carrier }) {
  const CarrierImage = () => <Image src={`/${carrier}.png`} />;
  return (
    <PillGroup label="Orders">
      <PillGroup.Pill label="First Last #123" icon={CarrierImage} />
      <PillGroup.Pill label="First Last #456" icon={CarrierImage} />
      <PillGroup.Pill label="First Last #789" icon={CarrierImage} />
    </PillGroup>
  );
}
```

_Dismissal:_

```tsx
import { PillGroup, usePillListState } from "@easypost/easy-ui/PillGroup";

function Component() {
  const list = usePillListState([
    { id: 1, name: "Food" },
    { id: 2, name: "Travel" },
    { id: 3, name: "Gaming" },
    { id: 4, name: "Shopping" },
  ]);

  return (
    <PillGroup
      items={list.items}
      horizontalStackContainerProps={{
        gap: "2",
      }}
      onRemove={(keys) => list.remove(...keys)}
      label="News Categories"
    >
      {(item) => <PillGroup.Pill label={item.name} />}
    </PillGroup>
  );
}
```

### Anatomy

```tsx
export function PillGroup<T extends object>(props: PillGroupProps<T>) {
  const { label, items, children, horizontalStackContainerProps = {} } = props;
  const {
    align,
    blockAlign,
    gap,
    wrap = true,
    inline,
  } = horizontalStackContainerProps;

  // compute styles
  const style = {} as React.CSSProperties;

  return (
    <TagGroup {...props}>
      <Text visuallyHidden>
        <Label>{label}</Label>
      </Text>
      <TagList items={items} style={style}>
        {children}
      </TagList>
    </TagGroup>
  );
}

function Pill(props: PillProps) {
  const { label, icon } = props;

  return (
    <Tag textValue={label} {...props}>
      {(renderProps: TagRenderProps) => {
        return (
          <>
            {icon && <Icon size="xs" symbol={icon} color="primary.700" />}
            <Text color="primary.800" variant="subtitle2">
              {label}
            </Text>
            {renderProps.allowsRemoving && (
              <Button slot="remove">
                <Icon size="xs" symbol={CloseIcon} color="primary.600" />
              </Button>
            )}
          </>
        );
      }}
    </Tag>
  );
}
```

---

## Behavior

### Accessibility

- **Keyboard navigation**: Individual pills can be navigated using the arrow keys, along with page up/down, home/end, etc.
- **Removal**: Individual pills can be removed from the tag group by clicking a remove button or pressing the backspace key.
- **ARIA**: Follows [ARIA grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) with additional selection announcements via an ARIA live region

### Dependencies

- `react-aria-components`
