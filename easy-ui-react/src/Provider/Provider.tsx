import React, { ReactElement } from "react";
import { ThemeProvider } from "../Theme";
import {
  NotificationProvider,
  NotificationPlacementProps,
} from "../Notification";
import type { ColorScheme, ThemeCreator } from "../Theme";

import "../styles/global.scss";

export interface ProviderProps {
  /** Component tree  */
  children: ReactElement;
  /** Theme to apply to Easy UI. Use `createTheme()` to build theme object.  */
  theme?: ThemeCreator;
  /** Color scheme to apply to Easy UI.  */
  colorScheme?: ColorScheme;
  /** Notification placement props */
  notificationPlacementProps?: NotificationPlacementProps;
}

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
*        notificationPlacementProps={{
*          positionPlacement: { top: "80px", left: "0px" },
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
*        notificationPlacementProps={{
*          positionPlacement: { top: "0px", left: "0px" },
*          positionType: "absolute",
*          htmlId: "nav-container",
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
  notificationPlacementProps,
}: ProviderProps) {
  return (
    <ThemeProvider theme={theme} colorScheme={colorScheme}>
      <NotificationProvider
        notificationPlacementProps={notificationPlacementProps}
      >
        {children}
      </NotificationProvider>
    </ThemeProvider>
  );
}
