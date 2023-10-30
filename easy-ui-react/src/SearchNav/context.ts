import { createContext, useContext, ReactNode } from "react";
import { SearchNavOverlayMenuProps } from "./SearchNav";
import { IconSymbol } from "../types";

type InternalSearchNavContextType = {
  logo: ReactNode;
  title?: ReactNode;
  selector?: ReactNode;
  selectorChildren?: ReactNode[];
  primaryCTAItem?: ReactNode;
  secondaryCTAItems?: ReactNode[];
  search?: ReactNode;
  menuOverlayProps?: SearchNavOverlayMenuProps<object>;
  selectorLabel?: string;
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
