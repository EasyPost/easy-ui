import { createContext, useContext } from "react";

export type TabsContextType = {
  setIndicatorPosition: (value: number) => void;
  setIndicatorWidth: (value: number) => void;
};

export const TabsContext = createContext<TabsContextType | null>(null);

export const useTabs = () => {
  const tabsContext = useContext(TabsContext);
  if (!tabsContext) {
    throw new Error("useTabs must be used within a Tabs");
  }
  return tabsContext;
};
