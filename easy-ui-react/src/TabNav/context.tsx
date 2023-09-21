import { createContext, useContext } from "react";

type TabNavContextType = {
  setLeft: (value: number | null) => void;
  setWidth: (value: number | null) => void;
};

export const TabNavContext = createContext<TabNavContextType | null>(null);

export const useTabNav = () => {
  const tabNavContext = useContext(TabNavContext);
  if (!tabNavContext) {
    throw new Error("useTabNav must be used within a TabNav");
  }
  return tabNavContext;
};
