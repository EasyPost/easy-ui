import React, { ReactElement } from "react";
import { ThemeProvider } from "../Theme";
import {
  NotificationProvider,
  NotificationPositionOffset,
} from "../Notification";
import type { ColorScheme, ThemeCreator } from "../Theme";

import "../styles/global.scss";

export interface ProviderProps {
  children: ReactElement;
  theme?: ThemeCreator;
  colorScheme?: ColorScheme;
  notificationPlacementOffset?: NotificationPositionOffset;
}

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
