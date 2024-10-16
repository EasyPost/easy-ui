# `NexusLayout` Component Specification

## Overview

`NexusLayout` defines the header, main content, and multi-page content areas of a Nexus product page.

### Prior Art

- [Primer `<PageLayout />`](https://primer.style/design/components/page-layout/react)
- [Paste `<SidebarNavigation /`>](https://paste.twilio.design/components/sidebar-navigation)

---

## Design

`NexusLayout` will be a compound component consisting of `NexusLayout`, `NexusLayout.Header`, `NexusLayout.Content`, and `NexusLayout.MultipageContainer`. `NexusLayout` also provides components for building navigation with `NexusLayout.Nav` and `NexusLayout.SidebarNav`.

`NexusLayout` is highly composable. Subcomponents within a `NexusLayout` can be replaced as needed. Subcomponents are lightweight wrappers with built-in styles and constraints.

`NexusLayout` is concerned only with presentational structure. It is meant to be wrapped by an app layout that may include app-specific business logic and configuration.

`NexusLayout` can render an empty content container with `NexusLayout.Content`. It can render a multi-page navigational layout with `NexusLayout.MultipageContainer`.

### API

```ts
type NexusLayoutProps = {
  children: ReactNode;
};

type NexusLayoutHeaderProps = {
  /** Optional logo to render if different than EasyPost */
  logo?: ReactNode;
  children: ReactNode;
};

type NexusLayoutContentProps = {
  children: ReactNode;
};

// Header navigation components

type NexusLayoutNavProps = {
  /**
   * Optional label for the navigation.
   * @default Main
   */
  "aria-label"?: string;

  /**
   * The currently selected key in the navigation list.
   */
  selectedKey?: Key;

  children: ReactNode;
};

type NexusLayoutNavLinkProps = {
  /** Icon for nav link */
  iconSymbol: IconSymbol;

  /** Key for the link. Usually the href */
  key: Key;
} & ComponentProps<"a">;

// Header action components (buttons on the right side of header)

type NexusLayoutActionsProps = {
  children: ReactNode;
};

type NexusLayoutMenuActionProps = {
  /** Optional custom accessibility label describing the menu action. */
  accessibilityLabel?: string;

  /** Icon symbol for the action. */
  iconSymbol: IconSymbol;

  /** Slot for badge to be rendered. */
  renderBadge?: () => ReactNode;

  /** Slot for rendering the menu overlay. */
  children: ReactNode;
};

// Multi-page components

type NexusLayoutMultipageContainerProps = {
  children: ReactNode;
};

type NexusLayoutMultipageSidebarProps = {
  children: ReactNode;
};

// Multi-page sidebar nav components

type NexusLayoutMultipageSidebarNavProps = {
  /** Title of nav */
  title: ReactNode;

  /**
   * The currently selected key in the navigation list.
   */
  selectedKey?: Key;

  children: ReactNode;
};

type NexusLayoutMultipageSidebarNavSectionProps = {
  /** Title of nav section */
  title: ReactNode;
  children: ReactNode;
};

type NexusLayoutMultipageSidebarNavLinkProps = {
  /** Icon for link */
  iconSymbol: IconSymbol;

  /** Key for the link. Usually the href */
  key: Key;
} & ComponentProps<"a">;

type NexusLayoutMultipageContentProps = {
  children: ReactNode;
};

// Multi-page header components

type NexusLayoutMultipageHeaderProps = {
  children: ReactNode;
};

type NexusLayoutMultipageTitleProps = {
  children: ReactNode;
};
```

### Example Usage

_Basic page shell:_

```tsx
import { NexusLayout } from "@easypost/easy-ui/NexusLayout";

function App() {
  return (
    <NexusLayout>
      <NexusLayout.Header>
        <NexusLayout.Nav selectedKey="/1">
          <NexusLayout.NavLink key="/1" href="/1" iconSymbol={Icon}>
            Order Fulfillment
          </NexusLayout.NavLink>
          <NexusLayout.NavLink key="/2" href="/2" iconSymbol={Icon}>
            Post Delivery
          </NexusLayout.NavLink>
          <NexusLayout.NavLink key="/3" href="/3" iconSymbol={Icon}>
            Shipping
          </NexusLayout.NavLink>
          <NexusLayout.NavLink key="/4" href="/4" iconSymbol={Icon}>
            Analytics
          </NexusLayout.NavLink>
        </NexusLayout.Nav>
        <NexusLayout.Actions>
          <NexusLayout.MenuAction
            accessibilityLabel="Label"
            iconSymbol={Icon}
            renderBadge={() => <Badge />}
          >
            <Menu.Overlay onAction={() => {}}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
          <NexusLayout.MenuAction accessibilityLabel="Label" iconSymbol={Icon}>
            <Menu.Overlay onAction={() => {}}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
          <NexusLayout.MenuAction accessibilityLabel="Label" iconSymbol={Icon}>
            <Menu.Overlay onAction={() => {}}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
        </NexusLayout.Actions>
      </NexusLayout.Header>
      <NexusLayout.Content>
        <div>Content</div>
      </NexusLayout.Content>
    </NexusLayout>
  );
}
```

_Page with nested navigation:_

```tsx
import { NexusLayout } from "@easypost/easy-ui/NexusLayout";

function App() {
  return (
    <NexusLayout>
      <NexusLayout.Header>
        <NexusLayout.Nav selectedKey="/1">
          <NexusLayout.NavLink key="/1" href="/1" iconSymbol={Icon}>
            Order Fulfillment
          </NexusLayout.NavLink>
          <NexusLayout.NavLink key="/2" href="/2" iconSymbol={Icon}>
            Post Delivery
          </NexusLayout.NavLink>
          <NexusLayout.NavLink key="/3" href="/3" iconSymbol={Icon}>
            Shipping
          </NexusLayout.NavLink>
          <NexusLayout.NavLink key="/4" href="/4" iconSymbol={Icon}>
            Analytics
          </NexusLayout.NavLink>
        </NexusLayout.Nav>
        <NexusLayout.Actions>
          <NexusLayout.MenuAction
            accessibilityLabel="Label"
            iconSymbol={Icon}
            renderBadge={() => <Badge />}
          >
            <Menu.Overlay onAction={() => {}}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
          <NexusLayout.MenuAction accessibilityLabel="Label" iconSymbol={Icon}>
            <Menu.Overlay onAction={() => {}}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
          <NexusLayout.MenuAction accessibilityLabel="Label" iconSymbol={Icon}>
            <Menu.Overlay onAction={() => {}}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
        </NexusLayout.Actions>
      </NexusLayout.Header>
      <NexusLayout.Content>
        <NexusLayout.MultipageContainer>
          <NexusLayout.MultipageSidebar>
            <NexusLayout.MultipageSidebarNav
              title={<>Settings</>}
              selectedKey="/1"
            >
              <NexusLayout.MultipageSidebarNavSection
                title={<>General Account Settings</>}
              >
                <NexusLayout.MultipageSidebarNavLink
                  key="/1"
                  href="/1"
                  iconSymbol={Icon}
                >
                  Page
                </NexusLayout.MultipageSidebarNavLink>
                <NexusLayout.MultipageSidebarNavLink
                  key="/2"
                  href="/2"
                  iconSymbol={Icon}
                >
                  Page
                </NexusLayout.MultipageSidebarNavLink>
              </NexusLayout.MultipageSidebarNavSection>
            </NexusLayout.MultipageSidebarNav>
          </NexusLayout.MultipageSidebar>
          <NexusLayout.MultipageContent>
            <NexusLayout.MultipageHeader>
              <NexusLayout.MultipageTitle>
                Page Title
              </NexusLayout.MultipageTitle>
              <HorizontalStack gap="1">
                <Button size="sm" variant="outlined">
                  Contact Sales
                </Button>
                <Button size="sm">Manage Subscription</Button>
              </HorizontalStack>
            </NexusLayout.MultipageHeader>
            <div>Content</div>
          </NexusLayout.MultipageContent>
        </NexusLayout.MultipageContainer>
      </NexusLayout.Content>
    </NexusLayout>
  );
}
```

### Anatomy

The high-level anatomy shows how the pieces are deconstructed.

```tsx
export function NexusLayout(props: NexusLayoutProps) {
  const { children } = props;
  return <div>{children}</div>;
}

function NexusLayoutHeader(props: NexusLayoutNexusHeaderProps) {
  const { logo = <EasyPostLogo />, children } = props;
  return (
    <HorizontalStack as="header" blockAlign="center" align="space-between">
      {logo}
      {children}
    </HorizontalStack>
  );
}

function NexusLayoutActions(props: NexusLayoutActionsProps) {
  const { children } = props;
  return <HorizontalStack gap="0.5">{children}</HorizontalStack>;
}

function NexusLayoutMenuAction(props: MenuAction) {
  const {
    accessibilityLabel = "Actions",
    iconSymbol,
    children,
    renderBadge,
  } = props;
  return (
    <Menu>
      <Menu.Trigger>
        <UnstyledPressButton className={styles.menuActionButton}>
          <Text visuallyHidden>{accessibilityLabel}</Text>
          <Icon symbol={iconSymbol} />
          {renderBadge && <div>{renderBadge()}</div>}
        </UnstyledPressButton>
      </Menu.Trigger>
      {children}
    </Menu>
  );
}

function NexusLayoutNav(props: NexusLayoutNexusContentProps) {
  const { "aria-label": ariaLabel = "Main", children } = props;
  return <nav aria-label={ariaLabel}>{children}</nav>;
}

function NexusLayoutNavLink(props: NexusLayoutNexusNavLinkProps) {
  const ref = useRef(null);
  const { iconSymbol, children } = props;
  const { linkProps } = useLink(props, ref);
  return (
    <a ref={ref} {...linkProps}>
      <Icon symbol={iconSymbol} />
      <Text variant="subtitle2">{children}</Text>
    </a>
  );
}

function NexusLayoutContent(props: NexusLayoutNexusContentProps) {
  const { children } = props;
  return <main>{children}</main>;
}

function NexusLayoutMultipageContainer(props: NexusLayoutNexusContentProps) {
  const { children } = props;
  return <div>{children}</div>;
}

function NexusLayoutMultipageSidebar(props: NexusLayoutNexusContentProps) {
  const { children } = props;
  return <div role="region">{children}</div>;
}

function NexusLayoutMultipageSidebarNav(props: any) {
  const { title, children } = props;
  const titleId = useId();
  return (
    <VerticalStack gap="2" as="nav" aria-labelledBy={titleId}>
      <Text as="h2" variant="heading4" id={titleId}>
        {title}
      </Text>
      {children}
    </VerticalStack>
  );
}

function NexusLayoutMultipageSidebarNavSection(props: any) {
  const { title, children } = props;
  return (
    <VerticalStack gap="2">
      <Text variant="overline">{title}</Text>
      {children}
    </VerticalStack>
  );
}

function NexusLayoutMultipageSidebarNavLink(props: any) {
  const ref = useRef(null);
  const { iconSymbol, children } = props;
  const { linkProps } = useLink(props, ref);
  return (
    <a ref={ref} {...linkProps}>
      <Icon symbol={iconSymbol} />
      <Text variant="body2">{children}</Text>
    </a>
  );
}

function NexusLayoutMultipageContent(props: NexusLayoutNexusContentProps) {
  const { children } = props;
  return <VerticalStack gap="2">{children}</VerticalStack>;
}

function NexusLayoutMultipageHeader(props: NexusLayoutNexusContentProps) {
  const { children } = props;
  return (
    <HorizontalStack blockAlign="center" align="space-between">
      {children}
    </HorizontalStack>
  );
}

function NexusLayoutMultipageTitle(props: NexusLayoutNexusContentProps) {
  const { children } = props;
  return (
    <Text as="h3" variant="heading5">
      {children}
    </Text>
  );
}

NexusLayout.Header = NexusLayoutHeader;
NexusLayout.Actions = NexusLayoutActions;
NexusLayout.MenuAction = NexusLayoutMenuAction;
NexusLayout.Header = NexusLayoutHeader;
NexusLayout.Nav = NexusLayoutNav;
NexusLayout.NavLink = NexusLayoutNavLink;
NexusLayout.Content = NexusLayoutContent;
NexusLayout.MultipageContainer = NexusLayoutMultipageContainer;
NexusLayout.MultipageSidebar = NexusLayoutMultipageSidebar;
NexusLayout.MultipageSidebarNav = NexusLayoutMultipageSidebarNav;
NexusLayout.MultipageSidebarNavSection = NexusLayoutMultipageSidebarNavSection;
NexusLayout.MultipageSidebarNavLink = NexusLayoutMultipageSidebarNavLink;
NexusLayout.MultipageContent = NexusLayoutMultipageContent;
NexusLayout.MultipageHeader = NexusLayoutMultipageHeader;
NexusLayout.MultipageTitle = NexusLayoutMultipageTitle;
```

---

## Behavior

### Accessibility

- `NexusLayout.Header` will render as `header`
- `NexusLayout.Content` will render as `main`
- `NexusLayout.Nav` and `NexusLayout.MultipageSidebarNav` will be rendered as `nav` with associated `aria-label`
- `NexusLayout.MultipageSidebarNav` title will render as `h2`
- `NexusLayout.MultipageTitle` will render as `h3`
- `NexusLayout.NavLink` and `NexusLayout.MultipageSidebarNavLink` will render as `<a>`
- Selected nav links will be decorated as `aria-current="page"`

### Dependencies

- `Card`
- `Text`
- `useLink`
- Will necessitate extending `EasyUIProvider` with navigation hooks to support client-side links. See [client side routing](https://react-spectrum.adobe.com/react-aria/routing.html#routerprovider).
