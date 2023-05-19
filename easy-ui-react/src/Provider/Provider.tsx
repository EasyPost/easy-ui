import React, { ReactElement } from "react";
import { ThemeProvider } from "../Theme";
import {
  NotificationProvider,
  NotificationPlacementOffset,
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
  /** Notification placement offset */
  notificationPlacementOffset?: NotificationPlacementOffset;
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
*    <EasyUIProvider notificationPlacementOffset={{top: "100px"}}>
*      <Nav />
*      <Content />
*      <Footer />
*    </EasyUIProvider>
*  );
*}
*```
 */
export function Provider({
  children,
  theme,
  colorScheme,
  notificationPlacementOffset,
}: ProviderProps) {
  return (
    <ThemeProvider theme={theme} colorScheme={colorScheme}>
      <NotificationProvider
        notificationPlacementOffset={notificationPlacementOffset}
      >
        {children}
      </NotificationProvider>
    </ThemeProvider>
  );
}
