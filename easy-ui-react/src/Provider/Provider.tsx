import { RouterProvider as ReactAriaRouterProvider } from "@react-aria/utils";
import { Href, RouterOptions } from "@react-types/shared";
import React, { ReactElement, ReactNode } from "react";
import { NotificationPlacement, NotificationProvider } from "../Notification";
import type { ColorScheme, ThemeCreator } from "../Theme";
import { ThemeProvider } from "../Theme";

import "../styles/global.scss";

export type EasyUIRouterProviderProps = {
  /**
   * A function received from your router for performing a client side
   * navigation programmatically.
   */
  navigate?: (path: Href, routerOptions: RouterOptions | undefined) => void;

  /**
   * An optional prop that converts a router-specific href to a native HTML
   * href, e.g. prepending a base path.
   */
  useHref?: (href: Href) => string;

  /**
   * RouterProvider children.
   */
  children: ReactNode;
};

export type ProviderProps = {
  /** Component tree  */
  children: ReactElement;
  /** Theme to apply to Easy UI. Use `createTheme()` to build theme object.  */
  theme?: ThemeCreator;
  /** Color scheme to apply to Easy UI.  */
  colorScheme?: ColorScheme;
  /** Notification placement props. */
  notificationPlacement?: NotificationPlacement;
} & Omit<EasyUIRouterProviderProps, "children">;

/**
 * Easy UI's Provider
 *
 * @remarks
 * The provider should be rendered at the root of an application. It can accept props to configure the theme,
 * color scheme, and notification placement.
 *
 * @example
 * _Custom notification placement_
```tsx
* import { Provider as EasyUIProvider } from "@easypost/easy-ui/Provider";
*
* function App() {
*
*  return (
*      <EasyUIProvider
*        colorScheme="system"
*        notificationPlacement={{
*          offset: { top: "80px", left: "0px" },
*        }}
*      >
*        {children}
*      </EasyUIProvider>
*  );
*}
*```
* @example
* _Custom notification placement with container_
```tsx
* import { Provider as EasyUIProvider } from "@easypost/easy-ui/Provider";
*
* function App() {
*  // notifications will render into a container with id="nav-container"
*  return (
*      <EasyUIProvider
*        colorScheme="system"
*        notificationPlacement={{
*          offset: { top: "0px", left: "0px" },
*          position: "absolute",
*          getContainer: () => document.getElementById("nav-container")
*        }}
*      >
*        {children}
*      </EasyUIProvider>
*  );
*}
*```
 */
export function Provider({
  children,
  theme,
  colorScheme,
  notificationPlacement,
  navigate,
  useHref,
}: ProviderProps) {
  return (
    <EasyUIRouterProvider navigate={navigate} useHref={useHref}>
      <ThemeProvider theme={theme} colorScheme={colorScheme}>
        <NotificationProvider notificationPlacement={notificationPlacement}>
          {children}
        </NotificationProvider>
      </ThemeProvider>
    </EasyUIRouterProvider>
  );
}

/**
 * Lightweight wrapper around React Aria's RouterProvider that renders as a
 * noop if no `navigate` function is provided.
 *
 * @param props router options
 * @returns children wrapped in router provider
 */
function EasyUIRouterProvider(props: EasyUIRouterProviderProps) {
  const { navigate, useHref, children } = props;
  if (navigate) {
    return (
      <ReactAriaRouterProvider navigate={navigate} useHref={useHref}>
        {children}
      </ReactAriaRouterProvider>
    );
  }
  return children;
}
