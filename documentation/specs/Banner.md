# `Banner` Component Specification

## Overview

The `Banner` component displays a prominent message above the navigation bar at the top of the page that cannot be dismissed.

### Use Cases

The primary use case of the `Banner` component is to inform the user of new features, promotions, and other offerings. **Not** to be used to call attention to the user as a result of interacting with the UI.

---

## Design

### API

```typescript
export type BannerColor = "primary" | "success" | "neutral";
export type BannerProps = {
  /**
   * Banner color color
   * @default "success"
   */
  color?: BannerColor;
  /** Banner emphasis text */
  emphasis?: ReactNode;
  /** Banner content */
  children?: ReactNode;
};
```

### Example Usage

_Default with emphasis and body_

```tsx
import Banner from "@easypost/easy-ui/Banner";
import Text from "@easypost/easy-ui/Text";

<Banner emphasis={<>Limited Time Only</>}>
  Get your first $250 of labels free!
</Banner>;
```

_Primary color with no emphasis_

```tsx
import Banner from "@easypost/easy-ui/Banner";
import Text from "@easypost/easy-ui/Text";

<Banner color="primary">No fees on 120,000 packages per year.</Banner>;
```

_Neutral color with emphasis_

```tsx
import Banner from "@easypost/easy-ui/Banner";
import Text from "@easypost/easy-ui/Text";

<Banner color="neutral" emphasis={<>Limited Time Only</>}>
  Get your first $250 of labels free!
</Banner>;
```

## Behavior

### Accessibility

The `Banner` component described above is not to be confused with the `banner` landmark and the ARIA `banner` role.

A [`banner` landmark](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/banner.html) identifies site-oriented content at the beginning of each page within a website. Site-oriented content typically includes things such as the logo or identity of the site sponsor, and site-specific search tool. By default, the HTML's `<header>` element has an identical meaning to the banner landmark, unless it is a descendant of `<aside>`, `<article>`, `<main>`, `<nav>`, or `<section>`, at which point `<header>` exposes a generic role, and not the equivalent of the site-wide banner. While it is best to use the `header` element and ensure it is not a descendant of any subsection of the page, sometimes you don't have access to the underlying HTML. If this is the case, you can add the [role of `banner`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/banner_role) to the element of the page which should be exposed as a `banner` with JavaScript.
