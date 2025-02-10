# `ForgeLayout` Component Specification

## Overview

`ForgeLayout` defines the header, nav, and main content areas of a Forge product page.

### Prior Art

- [Primer `<PageLayout />`](https://primer.style/design/components/page-layout/react)
- [Paste `<SidebarNavigation /`>](https://paste.twilio.design/components/sidebar-navigation)

---

## Design

`ForgeLayout` will be a compound component consisting of `ForgeLayout`, `ForgeLayout.Nav`, `ForgeLayout.Header`, and `ForgeLayout.Content`.

`ForgeLayout` is highly composable. Subcomponents within a `ForgeLayout` can be replaced as needed. Subcomponents are lightweight wrappers with built-in styles and constraints.

`ForgeLayout` is concerned only with presentational structure. It is meant to be wrapped by an app layout that may include app-specific business logic and configuration.

`ForgeLayout` can be in an `expanded` or `collapsed` navigational state by using the `navState` prop. When `expanded`, the navigation is present, along with any relevant header controls. When `collapsed`, the navigation is hidden, and the relevant controls are presented in the header.

`ForgeLayout` is aware of a global `mode` prop. When passed `test`, the shell is decorated with a color to indicate a non-production environment. The `mode` can be changed with the `ModeSwitcher` control.

### API

```tsx
import { ForgeLayout } from "@easypost/easy-ui/ForgeLayout";

function App() {
  return (
    <ForgeLayout mode="test" navState="expanded">
      <ForgeLayout.Nav>
        <ForgeLayout.NavLink href="/1" iconSymbol={Icon}>
          Item 1
        </ForgeLayout.NavLink>
        <ForgeLayout.NavSection title={<>Title</>}>
          <ForgeLayout.NavLink href="/2" iconSymbol={Icon}>
            Item 2
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/3" iconSymbol={Icon}>
            Item 3
          </ForgeLayout.NavLink>
        </ForgeLayout.NavSection>
        <ForgeLayout.NavSection title={<>Title</>}>
          <ForgeLayout.NavLink href="/4" iconSymbol={Icon}>
            Item 4
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/5" iconSymbol={Icon}>
            Item 5
          </ForgeLayout.NavLink>
        </ForgeLayout.NavSection>
      </ForgeLayout.Nav>
      <ForgeLayout.Header>
        <ForgeLayout.Controls visibleWhenNavStateIs="collapsed">
          <ForgeLayout.BreadrumbsNavigation>
            <ForgeLayout.BackButton onClick={() => {}}>
              Back
            </ForgeLayout.BackButton>
            <ForgeLayout.Breadrumbs>
              <ForgeLayout.Breadrumb>Breadcrumb</ForgeLayout.Breadrumb>
              <ForgeLayout.Breadrumb>Breadcrumb</ForgeLayout.Breadrumb>
            </ForgeLayout.Breadrumbs>
          </ForgeLayout.BreadrumbsNavigation>
        </ForgeLayout.Controls>
        <ForgeLayout.Controls visibleWhenNavStateIs="expanded">
          <ForgeLayout.ModeSwitcher onModeChange={action("Mode changed!")} />
          <ForgeLayout.Search value={"search"} onChange={() => {}} />
        </ForgeLayout.Controls>
        <ForgeLayout.Actions>
          <ForgeLayout.MenuAction
            accessibilityLabel="Action 1"
            iconSymbol={AlarmIcon}
            renderBadge={() => <ForgeLayout.ActionBadge />}
          >
            <Menu.Overlay onAction={action("Menu item clicked!")}>
              <Menu.Item>Action 1:1</Menu.Item>
              <Menu.Item>Action 1:2</Menu.Item>
            </Menu.Overlay>
          </ForgeLayout.MenuAction>
          <ForgeLayout.MenuAction
            accessibilityLabel="Action 2"
            iconSymbol={SupportIcon}
          >
            <Menu.Overlay onAction={action("Menu item clicked!")}>
              <Menu.Item>Action 2:1</Menu.Item>
              <Menu.Item>Action 2:2</Menu.Item>
            </Menu.Overlay>
          </ForgeLayout.MenuAction>
          <ForgeLayout.LinkAction
            href="/4"
            accessibilityLabel="Action 3"
            iconSymbol={SettingsIcon}
          />
        </ForgeLayout.Actions>
      </ForgeLayout.Header>
      <ForgeLayout.Content>Page Content</ForgeLayout.Content>
    </ForgeLayout>
  );
}
```

---

## Behavior

### Accessibility

- `ForgeLayout.Header` will render as `header`
- `ForgeLayout.Content` will render as `main`
- `ForgeLayout.Nav` will be rendered as `nav` with associated `aria-label`
- `ForgeLayout.NavLink` will render as `<a>`
- Selected nav links will be decorated as `aria-current="page"`

### Dependencies

- `Text`
- `useLink`
- Will use `EasyUIProvider`'s navigation hooks to support client-side links. See [client side routing](https://react-spectrum.adobe.com/react-aria/routing.html#routerprovider). This was added as part of `NexusLayout`.
