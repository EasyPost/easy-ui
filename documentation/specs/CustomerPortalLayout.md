# `CustomerPortalLayout` Component Specification

## Overview

`CustomerPortalLayout` defines a header and main content area for a CustomerPortal product page.

### Prior Art

- [Primer `<PageLayout />`](https://primer.style/design/components/page-layout/react)
- [Paste `<SidebarNavigation /`>](https://paste.twilio.design/components/sidebar-navigation)

---

## Design

`CustomerPortalLayout` will be a compound component consisting of several pieces including `CustomerPortalLayout`, `CustomerPortalLayout.Header`, and `CustomerPortalLayout.Content`.

In structure and style, it will be very similar to the existing `NexusLayout`.

In addition to creating a `CustomerPortalLayout` component, a `MultipageSection` component will also be built to
support multi-page navigational layout. The `MultipageSection` component will be designed to be a stand-alone
component capable of being layered into other product layouts.

### API

```ts
// CustomerPortal

export type CustomerPortalLayoutProps = {
  /**
   * Displays a prominent message with an icon when in test mode.
   *
   * @default production
   */
  mode?: Mode;
  /**
   * Controls whether the EasyPost logo displays.
   *
   * @default true
   */
  shouldDisplayEasyPostLogo?: boolean;
  /** Layout children. */
  children: ReactNode;
};

type CustomerPortalLayoutHeaderProps = {
  /** Header children. */
  children: ReactNode;
};

type CustomerPortalLayoutLogoContainerProps = {
  /** Logo container children */
  children: ReactNode;
};

type CustomerPortalLayoutLogoProps = {
  /** Logo children. */
  children: ReactNode;
};

type CustomerPortalLayoutContentProps = {
  /** Content children. */
  children: ReactNode;
};

type CustomerPortalLayoutActionsProps = {
  /** Actions children. */
  children: ReactNode;
};

type CustomerPortalLayoutActionBadgeProps = {
  /** Badge children. */
  children?: ReactNode;
};

type CustomerPortalLayoutMenuActionProps = {
  /** Optional custom accessibility label describing the menu action. */
  accessibilityLabel?: string;
  /** Icon symbol for the action. */
  iconSymbol: IconSymbol;
  /** Badge for the action. */
  renderBadge?: () => ReactNode;
  /** Render the menu overlay. */
  children: ReactNode;
};

type CustomerPortalLayoutLinkActionProps = {
  /** Optional custom accessibility label describing the menu action. */
  accessibilityLabel?: string;
  /** Action link icon symbol. */
  iconSymbol: IconSymbol;
  /** Whether or not action link is selected. */
  isSelected?: boolean;
  /** Badge for the action. */
  renderBadge?: () => ReactNode;
} & AriaLinkOptions;

type CustomerPortalLayoutButtonActionProps = {
  /** Optional custom accessibility label describing the menu action. */
  accessibilityLabel?: string;
  /** Action button icon symbol. */
  iconSymbol: IconSymbol;
  /** Whether or not action button is selected. */
  isSelected?: boolean;
  /** Badge for the action. */
  renderBadge?: () => ReactNode;
} & ButtonProps &
  React.RefAttributes<HTMLButtonElement>;

// MultipageSection

type MultipageSectionProps = {
  /** MultipageSection children. */
  children: ReactNode;
};

type MultipageSectionContainerProps = {
  /** MultipageSection container children. */
  children: ReactNode;
};

type MultipageSectionSplitContainerProps = {
  /** MultipageSection split container children. */
  children: ReactNode;
};

type MultipageSectionSidebarProps = {
  /** MultipageSection sidebar children. */
  children: ReactNode;
};

type MultipageSectionBrandHeaderProps = {
  /** MultipageSection brand header children. */
  children: ReactNode;
};

type MultipageSectionBrandHeaderLogoProps = {
  /** MultipageSection brand header logo children. */
  children: ReactNode;
};

type MultipageSectionBrandHeaderTitleProps = {
  /** MultipageSection brand header title children. */
  children: ReactNode;
};

type MultipageSectionContentProps = {
  /** MultipageSection content children. */
  children: ReactNode;
};

type MultipageSectionContentHeaderProps = {
  /** MultipageSection container header children. */
  children: ReactNode;
};

type MultipageSectionContentTitleProps = {
  /** MultipageSection content title icon. */
  titleIcon?: IconSymbol;
  /** MultipageSection content title text. */
  children: ReactNode;
};

type MultipageSectionSidebarNavProps = {
  /** Selected href of sidebar nav link. */
  selectedHref?: AriaLinkOptions["href"];
  /** Multipage container children. */
  children: ReactNode;
};

type MultipageSectionSidebarNavLinkProps = {
  /** Nav link icon symbol. */
  iconSymbol: IconSymbol;
  /** Nav link children. */
  children: ReactNode;
} & AriaLinkOptions;
```

### Example Usage

_Basic setup:_

```tsx
import { CustomerPortalLayout } from "@easypost/easy-ui/CustomerPortalLayout";
import { MultipageSection } from "@easypost/easy-ui/MultipageSection";

function App() {
  return (
    <CustomerPortalLayout mode="test">
      <CustomerPortalLayout.Header>
        <CustomerPortalLayout.LogoContainer>
          <CustomerPortalLayout.Logo>
            <SomeLogo />
          </CustomerPortalLayout.Logo>
        </CustomerPortalLayout.LogoContainer>
        <CustomerPortalLayout.Actions>
          <CustomerPortalLayout.MenuAction
            accessibilityLabel="Menu Action"
            iconSymbol={Icon}
            renderBadge={() => <CustomerPortalLayout.ActionBadge />}
          >
            <Menu.Overlay onAction={() => {}}>
              <Menu.Item>Action 1:1</Menu.Item>
              <Menu.Item>Action 1:2</Menu.Item>
            </Menu.Overlay>
          </CustomerPortalLayout.MenuAction>
          <CustomerPortalLayout.ButtonAction
            accessibilityLabel="Button Action"
            iconSymbol={Icon}
            onPress={() => {}}
          />
        </CustomerPortalLayout.Actions>
      </CustomerPortalLayout.Header>
      <CustomerPortalLayout.Content>
        <MultipageSection>
          <MultipageSection.Container>
            <MultipageSection.BrandHeader>
              <MultipageSection.BrandHeaderLogo>
                <SomeLogo />
              </MultipageSection.BrandHeaderLogo>
              <MultipageSection.BrandHeaderTitle>
                Brand Title
              </MultipageSection.BrandHeaderTitle>
            </MultipageSection.BrandHeader>
            <MultipageSection.SplitContainer>
              <MultipageSection.Sidebar>
                <MultipageSection.SidebarNav selectedHref="/1">
                  <MultipageSection.SidebarNavLink href="/1" iconSymbol={Icon}>
                    Link 1
                  </MultipageSection.SidebarNavLink>
                  <MultipageSection.SidebarNavLink href="/2" iconSymbol={Icon}>
                    Link 2
                  </MultipageSection.SidebarNavLink>
                </MultipageSection.SidebarNav>
              </MultipageSection.Sidebar>
              <MultipageSection.Content>
                <MultipageSection.ContentHeader>
                  <MultipageSection.ContentTitle titleIcon={Icon}>
                    Content Title
                  </MultipageSection.ContentTitle>
                </MultipageSection.ContentHeader>
                <div>Content</div>
              </MultipageSection.Content>
            </MultipageSection.SplitContainer>
          </MultipageSection.Container>
        </MultipageSection>
      </CustomerPortalLayout.Content>
    </CustomerPortalLayout>
  );
}
```

---

## Behavior

### Accessibility

- `CustomerPortalLayout.Header` will render as `header`
- `CustomerPortalLayout.Content` will render as `main`
- `MultipageSection.SidebarNav` will be rendered as `nav`
- `MultipageSection.SidebarNavLink` will render as `<a>`
- Selected nav links will be decorated as `aria-current="page"`

### Dependencies

- Easy UI components including `Text`, `Icon`, `VerticalStack`, `HorizontalStack`, and `Menu`
- Helper hooks from `react-aria` including `useFocusRing`, `useLink`, and `usePress`
