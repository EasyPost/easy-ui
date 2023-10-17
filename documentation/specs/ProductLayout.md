# `ProductLayout` Component Specification

## Overview

`ProductLayout` defines the header, sidebar, and main areas of a product page.

### Prior Art

- [Primer `<PageLayout />`](https://primer.style/design/components/page-layout/react)

---

## Design

`ProductLayout` will be a compound component consisting of `ProductLayout`, `ProductLayout.Sidebar`, `ProductLayout.Header`, and either `ProductLayout.Content` or `ProductLayout.TabbedContent`.

`ProductLayout` will use "slots" to render subcomponents into the appropriate nested HTML element. See an example `useSlots` reference [implementation](https://github.com/primer/react/blob/main/src/hooks/useSlots.ts#L16). This pattern allows the component surface area to map cleanly to the consumer concerns without having to know about the inner HTML tree.

`ProductLayout` will be concerned with the presentational page structure and ensuring it folds properly across breakpoints. This includes managing the positioning of the sidebar panel as it changes from desktop to mobile. It also includes the rendering of the help menu. It won't include the actual navigation component, nor the items for the help menu (as those can be context dependent), nor any business logic of its own. `ProductLayout` is intended to be wrapped by an app-specific layout that includes app-specific business logic and configuration.

`ProductLayout` can render either an empty content section using `ProductLayout.Content`, or a tabbed content section using `ProductLayout.TabbedContent`. A tabbed content section utilizes the `TabNav` component to provide accessible navigation across subpages. Tabbed content is expected to navigate users to different URLs, either through the pathname or through query params.

`ProductLayout.Header` accepts a title, help menu items, a primary CTA, and a secondary CTA. Both CTAs are optional. A help menu is always rendered to the left of the CTAs. On mobile, only a single action is shown in the top-right bar. It will either be one of the primary CTA, secondary CTA, or help menu, depending on what's specified by the consumer. CTAs are specific button variants, so customization of the CTA buttons themselves are intentionally limited.

### API

```ts
type ProductLayoutProps = {
  children: ReactNode;
};

type ProductLayoutSidebarProps = {
  children: ReactNode;
};

type ProductLayoutHeaderProps = {
  helpMenuItems: MenuItemProps[];
  primaryAction?: ProductLayoutHeaderActionProps;
  renderLogo: () => ReactNode;
  secondaryAction?: ProductLayoutHeaderActionProps;
  title: ReactNode;
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

_Simple content:_

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
        helpMenuItems={[
          <Menu.Item href="https://www.easypost.com/docs/api">
            Documentation
          </Menu.Item>,
          <Menu.Item href="https://support.easypost.com/hc/en-us">
            Support
          </Menu.Item>,
          <Menu.Item href="https://www.easypost.com/getting-started">
            Guides
          </Menu.Item>,
        ]}
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
      <ProductLayout.Header
        title="Page title"
        helpMenuItems={[
          <Menu.Item href="https://www.easypost.com/docs/api">
            Documentation
          </Menu.Item>,
          <Menu.Item href="https://support.easypost.com/hc/en-us">
            Support
          </Menu.Item>,
          <Menu.Item href="https://www.easypost.com/getting-started">
            Guides
          </Menu.Item>,
        ]}
      />
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
