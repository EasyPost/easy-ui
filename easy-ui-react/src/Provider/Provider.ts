import { ReactElement } from "react";

import "../styles/global.scss";

export interface ProviderProps {
  children: ReactElement;
}

export function Provider({ children }: ProviderProps) {
  return children;
}
