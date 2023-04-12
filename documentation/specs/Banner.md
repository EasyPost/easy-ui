# `Banner` Component Specification

## Overview

The `Banner` component displays a prominent message above the navigation bar at the top of the page that cannot be dismissed.

### Use Cases

The primary use case of the `Banner` component is to inform the user of promotions and other offerings. **Not** to be used to call attention to the user as a result of interacting with the UI.

---

## Design

### API

```typescript
export type BannerStatus = "primary" | "success" | "neutral";
export type BannerProps = {
  /**
   * Banner status color
   * @default "success"
   */
  status?: BannerColor;
  /**
   * Banner title text
   * @default null
   */
  title?: Text;
  /**
   * Banner body text
   */
  body: Text;
};
```

### Example Usage

_Default with title and body_

```tsx
import Banner from "@easypost/easy-ui/Banner";
import Text from "@easypost/easy-ui/Text";

<Banner
  title={<Text>Limited Time Only:</Text>}
  body={<Text>Get your first $250 of labels free!</Text>}
/>;
```

_Status with no title_

```tsx
import Banner from "@easypost/easy-ui/Banner";
import Text from "@easypost/easy-ui/Text";

<Banner
  status="primary"
  body={<Text>No fees on 120,000 packages per year.</Text>}
/>;
```

_Status with title_

```tsx
import Banner from "@easypost/easy-ui/Banner";
import Text from "@easypost/easy-ui/Text";

<Banner
  status="neutral"
  title={<Text>Limited Time Only:</Text>}
  body={<Text>Get your first $250 of labels free!</Text>}
/>;
```

## Behavior

### Accessibility

A `banner` landmark identifies site-oriented content at the beginning of each page within a website. Site-oriented content typically includes things such as the logo or identity of the site sponsor, and site-specific search tool. A banner usually appears at the top of the page and typically spans the full width.

By default, the HTML's `<header>` element has an identical meaning to the banner landmark, unless it is a descendant of `<aside>`, `<article>`, `<main>`, `<nav>`, or `<section>`, at which point `<header>` exposes a generic role, and not the equivalent of the site-wide banner.

Each page may have a `banner` landmark, but each page should generally be limited to a single element with the role of banner. In the case of a page containing nested `document` and/or `application` roles, each nested `document` or `application` role may also have one `banner` landmark. If a page includes more than one `banner` landmark, each should have a unique accessible name.

### Further reading on accessibility

- [W3](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/banner.html)
- [MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/banner_role)
