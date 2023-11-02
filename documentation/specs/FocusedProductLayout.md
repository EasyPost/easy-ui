# `FocusedProductLayout` Component Specification

## Overview

`FocusedProductLayout` defines the areas of a product page in a focused state.

### Prior Art

- [Primer `<PageLayout />`](https://primer.style/design/components/page-layout/react)

---

## Design

`FocusedProductLayout` will be a compound component consisting of `FocusedProductLayout`, either `FocusedProductLayout.Content` or `FocusedProductLayout.WizardContent`, and optionally a `FocusedProductLayout.SidePanel`.

`FocusedProductLayout` will be concerned with the presentational page structure and ensuring it folds properly across breakpoints. This includes rendering of the help menu. It won't include the items for the help menu (as those can be context dependent), nor any business logic of its own. `FocusedProductLayout` is intended to be wrapped by an app-specific layout that includes app-specific business logic and configuration.

`FocusedProductLayout` can render either an empty content section using `FocusedProductLayout.Content`, or a wizard content section using `FocusedProductLayout.WizardContent`.

`FocusedProductLayout.WizardContent` utilizes the `Stepper` component to provide accessible step visualization across a defined number of wizard steps. It also includes buttons below the primary content area for navigating between steps.

`FocusedProductLayout` accepts a `sidePanel` prop to optionally render an inverse background side panel within the main content area. The side panel can be positioned to be at the `start` or `end` of the main content area. It defaults to the `end`.

`FocusedProductLayout.Header` accepts a title, help menu items, and [render props](https://react.dev/reference/react/cloneElement#passing-data-with-a-render-prop) for a back button and a logo. Utilizing render props allows for the rendering of each item to remain flexibile while passing in any unique design constraint. `renderBackArrow`, for instance, can support the back button being a true `button` or a framework-specific `Link` component.

### API

```ts
export type HeaderProps = {
  helpMenuItems: MenuOverlayProps<object>["children"];
  onHelpMenuAction?: MenuOverlayProps<object>["onAction"];
  renderBackArrow: (props: { children: ReactNode }) => ReactNode;
  renderLogo: () => ReactNode;
  title: ReactNode;
};

export type FocusedProductLayoutProps = HeaderProps & {
  content: ReactNode;
  sidePanel?: ReactNode;
  sidePanelPosition?: "start" | "end";
};

export type ContentProps = {
  children: ReactNode;
};

export type WizardContentProps = {
  activeStepIndex: StepperProps["activeStepIndex"];
  children: ReactNode;
  nextAction: WizardContentActionProps;
  previousAction: WizardContentActionProps;
  steps: StepperProps["children"];
};

type WizardContentActionProps = {
  content: string;
  onAction: () => void;
  isDisabled?: boolean;
};
```

### Example Usage

_Simple content:_

```tsx
import { FocusedProductLayout } from "@easypost/easy-ui/ProductLayout";

function App() {
  return (
    <FocusedProductLayout
      helpMenuItems={[
        <Menu.Item key="1" href="https://easypost.com" target="_blank">
          Documentation
        </Menu.Item>,
        // etc
      ]}
      renderBackArrow={(props) => {
        // pass props that represent any unique design constraints
        // in this case, they are `BackArrowIcon` as `children`
        return (
          <Link href="/account/settings" passHref>
            <a>{props.children}</a>
          </Link>
        );
      }}
      renderLogo={() => <EasyPostLogo />}
      title="Page title"
      content={
        <FocusedProductLayout.Content>
          <div>Content</div>
        </FocusedProductLayout.Content>
      }
    />
  );
}
```

_With side panel:_

```tsx
import { FocusedProductLayout } from "@easypost/easy-ui/ProductLayout";

function App() {
  return (
    <FocusedProductLayout
      helpMenuItems={[
        <Menu.Item key="1" href="https://easypost.com" target="_blank">
          Documentation
        </Menu.Item>,
        // etc
      ]}
      renderBackArrow={(props) => {
        // pass props that represent any unique design constraints
        // in this case, they are `BackArrowIcon` as `children`
        return (
          <Link href="/account/settings" passHref>
            <a>{props.children}</a>
          </Link>
        );
      }}
      renderLogo={() => <EasyPostLogo />}
      title="Page title"
      content={
        <FocusedProductLayout.Content>
          <div>Content</div>
        </FocusedProductLayout.Content>
      }
      sidePanel={
        <FocusedProductLayout.SidePanel>
          <div>Content</div>
        </FocusedProductLayout.SidePanel>
      }
    />
  );
}
```

_Wizard content and with back "button":_

```tsx
import { FocusedProductLayout } from "@easypost/easy-ui/ProductLayout";

function App() {
  return (
    <FocusedProductLayout
      helpMenuItems={[
        <Menu.Item key="1" href="https://easypost.com" target="_blank">
          Documentation
        </Menu.Item>,
        // etc
      ]}
      renderBackArrow={(props) => {
        // spread props that represent any unique design constraints
        // in this case, they are `BackArrowIcon` as `children`
        // note that usually this should be a `Link`
        return (
          <button
            {...props}
            onClick={() => {
              // change state to previous app state to go back
            }}
          />
        );
      }}
      renderLogo={() => <EasyPostLogo />}
      title="Page title"
      content={
        <FocusedProductLayout.WizardContent
          activeStepIndex={activeStep}
          steps={["Step 1", "Step 2", "Step 3", "Step 4"].map((step, index) => (
            <Stepper.Step
              key={step}
              stepIndex={index}
              onPress={() => {}}
              isComplete={false}
              isAccessible={false}
            >
              {step}
            </Stepper.Step>
          ))}
          previousAction={{
            content: "Back",
            onAction: () => {
              // change stepper state
            },
          }}
          nextAction={{
            content: "Next",
            onAction: () => {
              // change stepper state
            },
          }}
        >
          <div>Content</div>
        </FocusedProductLayout.WizardContent>
      }
    />
  );
}
```

---

## Behavior

### Accessibility

- `FocusedProductLayout.Header` will be rendered as a `header` element with the title wrapped in an `h2`
- `FocusedProductLayout.Content` will be rendered as a `main` element.
