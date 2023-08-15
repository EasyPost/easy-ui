# `DisplayTable` Component Specification

## Overview

A `DisplayTable` is used for presenting information displayed across columns and rows.

---

## Design

`DisplayTable` is only for presentational concerns. It doesn't support advanced capabilities such as selection, sorting, and row expansion. With that in mind, complexities are primarily shifted to surfacing a simple component API, structuring the table properly to support the style requirements, and ensuring that accessibility markup is applied correctly.

Even though `DisplayTable` doesn't do much in terms of functionality, because accessibility concerns can be non-trivial, we will use `useTable` from React Aria to ensure that we have our accessibility bases covered.

### API

```ts

```

### Example Usage

_Simple_:

```tsx
import { Modal } from "@easypost/easy-ui/Modal";

function PageWithModal() {
  return <DisplayTable />;
}
```
