import { createContext, useContext } from "react";
import { TabListState } from "react-stately";

export type TabPanelsContextType = {
  tabListState: TabListState<object> | null;
  setTabListState: (state: TabListState<object>) => void;
};

export const TabPanelsContext = createContext<TabPanelsContextType | null>(
  null,
);

export const useTabPanels = () => {
  const tabPanelsContext = useContext(TabPanelsContext);
  if (!tabPanelsContext) {
    throw new Error("useTabPanels must be used within a TabPanels");
  }
  return tabPanelsContext;
};
