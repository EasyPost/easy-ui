import { createContext, useContext } from "react";

export type TabNavContextType = {
  setIndicatorPosition: (value: number) => void;
  setIndicatorWidth: (value: number) => void;
};

export const TabNavContext = createContext<TabNavContextType | null>(null);

export const useTabNav = () => {
  const tabNavContext = useContext(TabNavContext);
  if (!tabNavContext) {
    throw new Error("useTabNav must be used within a TabNav");
  }
  return tabNavContext;
};
