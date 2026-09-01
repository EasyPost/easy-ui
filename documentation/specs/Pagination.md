# `Pagination` Component Specification

## Overview

A `Pagination` component enabled the user to divide large amounts of content into multiple pages, and navigate between pages.

### Prior Art

- [Paste `<Pagination />`](https://paste.twilio.design/components/pagination)
- [Polaris `<Pagination />`](https://polaris.shopify.com/components/navigation/pagination)

---

## Design

The design of the `Pagination` component consists of a next and a previous button for navigation, and a dropdown menu for users to select specific page.

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

export type PaginationSize = "sm" | "md";

// `PaginationProps` is a discriminated union: the basic (previous/next, optional
// dropdown) variant and the numbered variant are mutually exclusive. Each variant
// marks the other's props `?: never`, so mixing them is a type error.

type PaginationCommonProps = {
  /** Accessible label for Pagination, used for aria-label. */
  label: string;
  /** Whether the Pagination component should be disabled. */
  isDisabled?: boolean;
};

export type PaginationBasicProps = PaginationCommonProps & {
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
  /** Callback when previous button is clicked. */
  onPrevious?: () => void;
  /** Callback when next button is clicked. */
  onNext?: () => void;
  /** Only accepts `<Pagination.Dropdown />`. */
  children?: ReactElement<PaginationDropdownProps>;
  page?: never;
  count?: never;
  onPageChange?: never;
  showFirstLast?: never;
  visiblePageCount?: never;
  rowsPerPage?: never;
  rowsPerPageOptions?: never;
  onRowsPerPageChange?: never;
  size?: never;
};

export type PaginationNumberedProps = PaginationCommonProps & {
  /**
   * The current page, 1-indexed. The consumer owns this value — pass a page
   * within `[1, count]`; out-of-range values are clamped for display, not
   * corrected upstream.
   */
  page: number;
  /**
   * The total number of pages. A count below 1 renders nothing.
   */
  count: number;
  /**
   * Callback when a page is selected — fired by the page numbers,
   * previous/next, and First/Last controls.
   */
  onPageChange: (page: number) => void;
  /**
   * Whether to render First and Last jump buttons.
   * @default false
   */
  showFirstLast?: boolean;
  /**
   * How many page-number buttons the window shows. The window stays centered
   * on the active page (just left of center for even counts); hidden pages
   * collapse behind a static ellipsis.
   * @default 5
   */
  visiblePageCount?: number;
  /**
   * The current rows-per-page value. Provide with `onRowsPerPageChange` to
   * render the Rows Per Page control.
   */
  rowsPerPage?: number;
  /**
   * The selectable rows-per-page values.
   * @default [10, 25, 50, 100]
   */
  rowsPerPageOptions?: number[];
  /** Callback when a rows-per-page value is selected. */
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  /**
   * Size of the pagination controls.
   * @default md
   */
  size?: PaginationSize;
  hasPrevious?: never;
  hasNext?: never;
  onPrevious?: never;
  onNext?: never;
  children?: never;
};

export type PaginationProps = PaginationBasicProps | PaginationNumberedProps;
```

_Numbered:_

When `page`, `count`, and `onPageChange` are provided, `<Pagination />` renders numbered
pages with previous/next controls. The window stays centered on the active page and collapses
hidden pages behind a static ellipsis; `visiblePageCount` sizes the window. `showFirstLast`
adds First/Last jump buttons, and `rowsPerPage`/`onRowsPerPageChange` add a Rows Per Page
control.

```tsx
import { Pagination } from "@easypost/easy-ui/Pagination";

export function Component() {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  return (
    <Pagination
      label="Example Numbered Pagination"
      page={page}
      count={20}
      onPageChange={setPage}
      showFirstLast
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={(next) => {
        setRowsPerPage(next);
        setPage(1);
      }}
    />
  );
}
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
      <Icon symbol={symbol} size="md" />
    </UnstyledButton>
  );
}

export function PaginationDropdown(props: PaginationDropdownProps) {
  const { page, count, onSelect, isDisabled } = props;
  return (
    <Menu isDisabled={isDisabled}>
      <Menu.Trigger>
        <UnstyledButton
          aria-label="dropdown"
          className={styles.menuButton}
          isDisabled={isDisabled}
        >
          <HorizontalStack blockAlign="center">
            <Text variant="body2">{`${page} of ${count}`}</Text>
            <Icon symbol={ExpandMoreIcon400} size="2xs" />
          </HorizontalStack>
        </UnstyledButton>
      </Menu.Trigger>
      <Menu.Overlay onAction={(key) => onSelect(Number(key))}>
        {Array.from({ length: count }, (_, i) => i + 1).map((pageNumber) => (
          <Menu.Item key={pageNumber} aria-label={`page ${pageNumber}`}>
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
