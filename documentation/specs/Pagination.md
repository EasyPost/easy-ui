# `Pagination` Component Specification

## Overview

A `Pagination` component enabled the user to divide large amounts of content into multiple pages, and navigate between pages.

### Prior Art

- [Paste `<Pagination />`](https://paste.twilio.design/components/pagination)
- [Polaris `<Pagination />`](https://polaris.shopify.com/components/navigation/pagination)

---

## Design

The design of the `Pagination` component consists of a next and a previous button for navigation, and a dropdown for the user to select specific page. This component will rely on React Aria's `useFocusRing` and `useKeyboard` hooks to handle keyboard interactions.

### API

```ts
export type PaginationButtonProps = UnstyledButtonProps & {
  symbol: IconSymbol;
};

export type PaginationDropdownProps = {
  /**
   * The current page.
   */
  page: number;
  /**
   * The total number of pages.
   */
  count: number;
  /**
   * Callback when select page from dropdown.
   */
  onSelect: (key: number) => void;
  /**
   * Whether the PaginationDropdown should be disabled.
   */
  isDisabled?: boolean;
};

export type PaginationProps = {
  /**
   * Whether there is a previous page to show.
   * @default false
   */
  hasPrevious?: boolean;
  /**
   * Whether there is a next page to show.
   * @default false
   */
  hasNext?: boolean;
  /**
   * Callback when previous button is clicked.
   */
  onPrevious?: () => void;
  /**
   * Callback when next button is clicked.
   */
  onNext?: () => void;
  /**
   * Accessible label for Pagination, used as the
   * aria-label.
   */
  label: string;
  /**
   * Whether the Pagination component should be disabled.
   */
  isDisabled?: boolean;
  /**
   * The children of `<Pagination />` component only
   * accept `<Pagination.Dropdown />`.
   */
  children?: ReactElement<PaginationDropdownProps>;
};
```

### Example Usage

_Basic:_

```tsx
import { Pagination } from "@easypost/easy-ui/Pagination";

export function Component() {
  return (
    <Pagination
      label="Example"
      onPrevious={() => {}}
      onNext={() => {}}
      hasPrevious
      hasNext
    />
  );
}
```

_Pagination with Dropdown:_

```tsx
import { Pagination } from "@easypost/easy-ui/Pagination";

export function Component() {
  const [page, setPage] = React.useState(1);
  const totalPage = 10;
  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrevious = () => setPage((prev) => prev - 1);
  const hasPrevious = page > 1;
  const hasNext = totalPage > page;
  const handleSelect = (key: number) => setPage(key);
  return (
    <Pagination
      label="Example Pagination with Dropdown"
      onPrevious={handlePrevious}
      onNext={handleNext}
      hasPrevious={hasPrevious}
      hasNext={hasNext}
    >
      <Pagination.Dropdown
        count={totalPage}
        page={page}
        onSelect={handleSelect}
      />
    </Pagination>
  );
}
```

_Disabled:_

```tsx
import { Pagination } from "@easypost/easy-ui/Pagination";

export function Component() {
  return <Pagination label="Example" isDisabled />;
}
```

### Anatomy

```tsx
export function PaginationButton(props: PaginationButtonProps) {
  const { symbol, ...buttonProps } = props;
  return (
    <UnstyledButton {...buttonProps}>
      <Icon
        symbol={symbol}
        color={!buttonProps.isDisabled ? "primary.700" : "neutral.400"}
        size="md"
      />
    </UnstyledButton>
  );
}

export function PaginationDropdown(props: PaginationDropdownProps) {
  const { page, count, onSelect, isDisabled } = props;
  function numberToArray(num: number) {
    return Array.from({ length: num }, (_, i) => i + 1);
  }
  return (
    <Menu isDisabled={isDisabled}>
      <Menu.Trigger>
        <UnstyledButton className={styles.menuButton}>
          <HorizontalStack blockAlign="center">
            <Text
              variant="body2"
              color={isDisabled ? "neutral.400" : "neutral.900"}
            >
              {`${page} of ${count}`}
            </Text>
            <Icon
              symbol={ExpandMoreIcon400}
              size="2xs"
              color={isDisabled ? "neutral.400" : "neutral.900"}
            />
          </HorizontalStack>
        </UnstyledButton>
      </Menu.Trigger>
      <Menu.Overlay onAction={(key) => onSelect(Number(key))}>
        {numberToArray(count).map((pageNumber) => (
          <Menu.Item key={pageNumber} arial-label={`page ${pageNumber}`}>
            <Text
              variant="body2"
              color="neutral.900"
            >{`${pageNumber} of ${count}`}</Text>
          </Menu.Item>
        ))}
      </Menu.Overlay>
    </Menu>
  );
}

export function Pagination(props: PaginationProps) {
  const {
    hasPrevious = false,
    hasNext = false,
    onPrevious,
    onNext,
    label,
    isDisabled,
    children,
  } = props;
  const className = classNames(
    styles.pagination,
    isDisabled && styles.disabled,
  );

  return (
    <nav aria-label={label} className={className}>
      <HorizontalStack>
        <PaginationButton
          aria-label="Previous"
          onPress={onPrevious}
          isDisabled={!hasPrevious || isDisabled}
          symbol={KeyboardDoubleArrowLeft}
        />
        {children && cloneElement(children, { isDisabled })}
        <PaginationButton
          aria-label="Next"
          onPress={onNext}
          isDisabled={!hasNext || isDisabled}
          symbol={KeyboardDoubleArrowRight}
        />
      </HorizontalStack>
    </nav>
  );
}
```

---

## Behavior

### Accessibility

- Use a wrapping `<nav>` element to identify Pagination as a navigation section.
- An appropriate `aria-label` should be provided through `label` props.
