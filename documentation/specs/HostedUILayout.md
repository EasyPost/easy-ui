# `HostedUILayout` Component Specification

## Overview

`HostedUILayout` defines the header, main content, and multi-page content areas of a HostedUI product page.

### Prior Art

- [Primer `<PageLayout />`](https://primer.style/design/components/page-layout/react)
- [Paste `<SidebarNavigation /`>](https://paste.twilio.design/components/sidebar-navigation)

---

## Design

`HostedUILayout` will be a compound component consisting of several pieces including `HostedUILayout`, `HostedUILayout.Header`, `HostedUILayout.Content`, and `HostedUILayout.MultipageContainer`.

In structure and style, it will be very similar to the existing `NexusLayout` with some key differences. For instance, the default presentation for `HostedUILayout` will be the multi-page navigational layout.

An additional point worth highlighting is that the `MultipageContainer` will be constructed in a way where it can be exported as a stand-alone piece and usable in a non `HostedUILayout` context.

### API

```ts
type HostedUILayoutProps = {
  /** Layout children. */
  children: ReactNode;
};

type HostedUILayoutHeaderProps = {
  /** Header children */
  children: ReactNode;
};

type HostedUILayoutLogoGroupProps = {
  /** LogoGroup children */
  children: ReactNode;
};

type HostedUILayoutContentProps = {
  /** Content children */
  children: ReactNode;
};

type HostedUILayoutActionsProps = {
  /** Actions children. */
  children: ReactNode;
};

type HostedUILayoutActionBadgeProps = {
  /** Badge children. */
  children?: ReactNode;
};

type HostedUILayoutMenuActionProps = {
  /** Optional custom accessibility label describing the menu action. */
  accessibilityLabel?: string;
  /** Icon symbol for the action. */
  iconSymbol: IconSymbol;
  /** Slot for badge to be rendered. */
  renderBadge?: () => ReactNode;
  /** Slot for rendering the menu overlay. */
  children: ReactNode;
};

type HostedUILayoutLinkActionProps = {
  /** Optional custom accessibility label describing the menu action. */
  accessibilityLabel?: string;
  /** Action link icon symbol. */
  iconSymbol: IconSymbol;
  /** Whether or not action link is selected. */
  isSelected?: boolean;
  /** Badge for the action. */
  renderBadge?: () => ReactNode;
} & AriaLinkOptions;

type HostedUILayoutMultipageContainerProps = {
  /** Multipage container children. */
  children: ReactNode;
};

type HostedUILayoutMultipageInnerContainerProps = {
  /** Multipage inner container children. */
  children: ReactNode;
};

type HostedUILayoutMultipageBrandHeaderProps = {
  /** Multipage brand header children. */
  children: ReactNode;
};

type HostedUILayoutMultipageSidebarProps = {
  /** Multipage container sidebar children. */
  children: ReactNode;
};

type HostedUILayoutMultipageContentProps = {
  /** Multipage container content children. */
  children: ReactNode;
};

type HostedUILayoutMultipageHeaderProps = {
  /** Multipage container header children. */
  children: ReactNode;
};

type HostedUILayoutMultipageTitleProps = {
  /** Multipage container title text. */
  children: ReactNode;
};

type HostedUILayoutMultipageSidebarNavProps = {
  /** Sidebar nav title. */
  title: ReactNode;
  /** Selected href of sidebar nav link. */
  selectedHref?: AriaLinkOptions["href"];
  /** Multipage container children. */
  children: ReactNode;
};

type HostedUILayoutMultipageSidebarNavSectionProps = {
  /** Sidebar nav section title. */
  title: ReactNode;
  /** Sidebar nav section children. */
  children: ReactNode;
};

type HostedUILayoutMultipageSidebarNavLinkProps = {
  /** Nav link icon symbol. */
  iconSymbol: IconSymbol;
  /** Nav link children. */
  children: ReactNode;
} & AriaLinkOptions;
```

### Example Usage

_Basic setup:_

```tsx
import { HostedUILayout } from "@easypost/easy-ui/HostedUILayout";

function App() {
  return (
    <HostedUILayout>
      <HostedUILayout.Header>
        <HostedUILayout.LogoGroup>
          <EasyPostLogo />
          <OtherLogo />
        </HostedUILayout.LogoGroup>
        <HostedUILayout.Actions>
          <HostedUILayout.MenuAction
            accessibilityLabel="Label"
            iconSymbol={Icon}
            renderBadge={() => <Badge />}
          >
            <Menu.Overlay onAction={() => {}}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </HostedUILayout.MenuAction>
          <HostedUILayout.MenuAction
            accessibilityLabel="Label"
            iconSymbol={Icon}
          >
            <Menu.Overlay onAction={() => {}}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </HostedUILayout.MenuAction>
          <HostedUILayout.MenuAction
            accessibilityLabel="Label"
            iconSymbol={Icon}
          >
            <Menu.Overlay onAction={() => {}}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </HostedUILayout.MenuAction>
        </HostedUILayout.Actions>
      </HostedUILayout.Header>
      <HostedUILayout.Content>
        <HostedUILayout.MultipageContainer>
          <HostedUILayout.MultipageBrandHeader>
            <SomeOtherLogo />
          </HostedUILayout.MultipageBrandHeader>
          <HostedUILayout.MultipageInnerContainer>
            <HostedUILayout.MultipageSidebar>
              <HostedUILayout.MultipageSidebarNav
                title={<>Settings</>}
                selectedHref="/1"
              >
                <HostedUILayout.MultipageSidebarNavSection
                  title={<>General Account Settings</>}
                >
                  <HostedUILayout.MultipageSidebarNavLink
                    key="/1"
                    href="/1"
                    iconSymbol={Icon}
                  >
                    Wallet
                  </HostedUILayout.MultipageSidebarNavLink>
                  <HostedUILayout.MultipageSidebarNavLink
                    key="/2"
                    href="/2"
                    iconSymbol={Icon}
                  >
                    Carriers
                  </HostedUILayout.MultipageSidebarNavLink>
                </HostedUILayout.MultipageSidebarNavSection>
              </HostedUILayout.MultipageSidebarNav>
            </HostedUILayout.MultipageSidebar>
            <HostedUILayout.MultipageContent>
              <HostedUILayout.MultipageHeader>
                <HostedUILayout.MultipageTitle>
                  Wallet Settings
                </HostedUILayout.MultipageTitle>
                <Button size="sm" variant="outlined">
                  Edit Account Settings
                </Button>
              </HostedUILayout.MultipageHeader>
              <div>Content</div>
            </HostedUILayout.MultipageContent>
          </HostedUILayout.MultipageInnerContainer>
        </HostedUILayout.MultipageContainer>
      </HostedUILayout.Content>
    </HostedUILayout>
  );
}
```

---

## Behavior

### Accessibility

- `HostedUILayout.Header` will render as `header`
- `HostedUILayout.Content` will render as `main`
- `HostedUILayout.MultipageSidebarNav` will be rendered as `nav`
- `HostedUILayout.MultipageSidebarNavLink` will render as `<a>`
- Selected nav links will be decorated as `aria-current="page"`

### Dependencies

- `Card`
- `Text`
- `useLink`
- Will necessitate extending `EasyUIProvider` with navigation hooks to support client-side links. See [client side routing](https://react-spectrum.adobe.com/react-aria/routing.html#routerprovider).
