# `Pagination` Component Specification

## Overview

A `Pagination` component enabled the user to divide large amounts of content into multiple pages, and navigate bwteen pages.

### Prior Art

- [Paste `<Pagination />`](https://paste.twilio.design/components/pagination)
- [Polaris `<Pagination />`](https://polaris.shopify.com/components/navigation/pagination)

---

## Design

The design of the `Pagination` component consists of a next and a previous button for navigation, and a dropdown for the user to select specific page. This component will rely on React Aria's `useFocusRing` and `useKeyboard` hooks to handle keyboard interactions.

### API

```ts
export type PaginationProps = {
  /**
   * Whether there is a previous page to show.
   * @default false
   */
  hasPreviouse?: boolean;
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
   * Callback when select page from dropdown.
   */
  onSelect?: () => void;
  /**
   * Accessible label for Pagination, used as the
   * aria-label.
   */
  label: ReactNode;
  /**
   * Whether the Pagination component should be disabled.
   */
  isDisabled?: boolean;
  /**
   * The current page.
   */
  page?: number;
  /**
   * The total number of pages.
   */
  count?: number;
};
```

### Example Usage

_Basic useage:_

```tsx
import { Pagination } from "@easypost/easy-ui/Pagination";

export function Component() {
  const pageRef = React.useRef(1);
  const handleNext = () => (pageRef.current += 1);
  const handlePrevious = () => (pageRef.current -= 1);
  const hasPrevious = pageRef.current > 1;
  const hadNext = count > pageRef.current;
  return (
    <Pagination
      label="Example"
      page={pageRef.current}
      onPrevious={handlePrevious}
      onNext={handleNext}
      hasPrevious={hasPrevious}
      hadNext={hadNext}
    />
  );
}
```

_Pagination with known total pages:_

```tsx
import { Pagination } from "@easypost/easy-ui/Pagination";

export function Component() {
  const pageRef = React.useRef(1);
  const totalPages = 5;
  const handleNext = () => (pageRef.current += 1);
  const handlePrevious = () => (pageRef.current -= 1);
  const hasPrevious = pageRef.current > 1;
  const hadNext = count > pageRef.current;
  const handleSelect = (page) => (pageRef.current = page);
  return (
    <Pagination
      label="Example"
      page={pageRef.current}
      onPrevious={handlePrevious}
      onNext={handleNext}
      hasPrevious={hasPrevious}
      hadNext={hadNext}
      count={totalPages}
      onSelect={handleSelect}
    />
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
export function Pagination(props: PaginationProps) {
  const {
    label,
    page,
    onPrevious,
    onNext,
    hasPrevious,
    hasNext,
    count,
    onSelect,
  } = props;
  const className = classNames(
    styles.pagination,
    isDisabled && styles.disabled,
  );
  function numberToArray(num) {
    return Array.from({ length: num }, (_, i) => i + 1);
  }

  return (
    <nav aria-label={label} className={className}>
      <button
        aria-label="Previous"
        onClick={onPrevious}
        className={!hasPrevious && styles.buttonDisabled}
      />
      {count && (
        <Select selectedKey={page}>
          {numberToArray(count).map((number) => (
            <Select.Option
              key={number}
              arial-label={`page ${number}`}
              onSelectionChange={onSelect}
            >
              <Text>{`${number} of ${count}`}</Text>
            </Select.Option>
          ))}
        </Select>
      )}
      <button
        aria-label="Next"
        onClick={onNext}
        className={!hasNext && styles.buttonDisabled}
      />
    </nav>
  );
}
```

---

## Behavior

### Accessibility

- Use a wrapping `<nav>` element to identify Pagination as a navigation section.
- An appropriate `aria-label` should be provided through `label` props.

### Dependencies

- React Aria's `useFocusRing` and `useKeyboard` for keyboard control.
