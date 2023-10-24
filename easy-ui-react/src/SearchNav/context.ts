import { createContext, useContext, ReactNode } from "react";
import { SearchNavOverlayMenuProps } from "./SearchNav";
import { IconSymbol } from "../types";

type InternalSearchNavContextType = {
  selectChildren?: ReactNode[];
  ctaGroupChildren?: ReactNode[];
  searchNode?: ReactNode;
  onlyLogoGroup: boolean;
  menuOverlayProps?: SearchNavOverlayMenuProps<object>;
  selectLabel?: string;
  ctaMenuSymbol?: IconSymbol;
};

export const InternalSearchNavContext =
  createContext<InternalSearchNavContextType | null>(null);

export function useInternalSearchNavContext() {
  const searchNavContext = useContext(InternalSearchNavContext);
  if (!searchNavContext) {
    throw new Error(
      "InternalSearchNavContext must be used inside a <SearchNav />",
    );
  }
  return searchNavContext;
}
