# `ProductLayout` Component Specification

## Overview

`ProductLayout` defines the header, sidebar, and main areas of a product page.

### Prior Art

- [Primer `<PageLayout />`](https://primer.style/design/components/page-layout/react)

---

## Design

`ProductLayout` will be a compound component consisting of `ProductLayout`, `ProductLayout.Sidebar`, `ProductLayout.Header`, `ProductLayout.Content`, and `ProductLayout.TabbedContent`.

`ProductLayout` will use "slots" to render subcomponents into the appropriate nested HTML element. See an example `useSlots` reference [implementation](https://github.com/primer/react/blob/main/src/hooks/useSlots.ts#L16). This pattern allows the component surface area to map cleanly to the consumer concerns without having to know about the inner HTML tree.

`ProductLayout` will be concerned with the presentational page structure and ensuring it folds properly across breakpoints. This includes managing the positioning of the sidebar panel as it changes from desktop to mobile. It won't include any business logic of its own.

`ProductLayout` can render either an empty content section using `ProductLayout.Content`, or a tabbed content section using `ProductLayout.TabbedContent`.

`ProductLayout.Header` accepts a title, a primary CTA, and a secondary CTA. Both CTAs are optional. A help menu is always rendered to the left of the CTAs. On mobile, the primary CTA, or the help menu if no primary CTA is specified, is shown in the top-right bar. CTAs are specific button variants, so customization of the CTA buttons themselves are intentionally limited.

### API

```ts
type ProductLayoutProps = {
  children: ReactNode;
};

type ProductLayoutSidebarProps = {
  children: ReactNode;
};

type ProductLayoutHeaderProps = {
  title: ReactNode;
  primaryAction?: ProductLayoutHeaderActionProps;
  secondaryAction?: ProductLayoutHeaderActionProps;
};

type ProductLayoutHeaderActionProps = {
  content: string;
  onAction: () => void;
  isDisabled?: boolean;
};

type ProductLayoutContentProps = {
  children: ReactNode;
};

type ProductLayoutTabbedContentProps = AriaLabelingProps & {
  children: ReactNode;
  tabs: ReactElement[];
};
```

### Example Usage

_Basic content:_

```tsx
import { ProductLayout } from "@easypost/easy-ui/ProductLayout";

function App() {
  return (
    <ProductLayout>
      <ProductLayout.Sidebar>
        <ProductNav />
      </ProductLayout.Sidebar>
      <ProductLayout.Header
        title="Page title"
        primaryAction={{
          content: "CTA 1",
          onAction: () => {},
        }}
        secondaryAction={{
          content: "CTA 2",
          onAction: () => {},
        }}
      />
      <ProductLayout.Content>
        <div>Content</div>
      </ProductLayout.Content>
    </ProductLayout>
  );
}
```

_Tabbed content:_

```tsx
import { ProductLayout } from "@easypost/easy-ui/ProductLayout";

function App() {
  return (
    <ProductLayout>
      <ProductLayout.Sidebar>
        <ProductNav />
      </ProductLayout.Sidebar>
      <ProductLayout.Header title="Page title" />
      <ProductLayout.TabbedContent
        tabs={[
          <TabNav.Item key="1" href="/billing" isCurrentPage>
            Billing
          </TabNav.Item>,
          <TabNav.Item key="2" href="/members">
            Members
          </TabNav.Item>,
          <TabNav.Item key="3" href="/api-keys">
            API Keys
          </TabNav.Item>,
          <TabNav.Item key="4" href="/branded-tracker">
            Branded Tracker
          </TabNav.Item>,
          <TabNav.Item key="5" href="/shipping-settings">
            Shipping Settings
          </TabNav.Item>,
        ]}
      >
        <div style={{ marginTop: 24, padding: "0 16px" }}>
          {startCase(page)}
        </div>
      </ProductLayout.TabbedContent>
    </ProductLayout>
  );
}
```

---

## Behavior

### Accessibility

- `ProductLayout.Sidebar` will have `role="region"` and `aria-label="Sidebar"`
- `ProductLayout.Header` will be rendered as a `header` element with the title wrapped in an `h2`
- `ProductLayout.Content` will be rendered as a `main` element. `ProductLayout.TabbedContent` will render the content under the tab bar as a `main` element.
- `ProductLayout.TabbedContent` will accept an `aria-label` for labeling the tab navigation bar for assistive agents.
