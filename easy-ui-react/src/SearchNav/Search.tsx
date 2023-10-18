import React, { ReactNode } from "react";
import { classNames } from "../utilities/css";
import styles from "./Search.module.scss";

export type SearchProps = {
  /**
   * The children of the <SearchNav.Search> element. Should render
   * a search component.
   */
  children: ReactNode;
};

export function Search(props: SearchProps) {
  const { children } = props;

  return <div className={classNames(styles.search)}>{children}</div>;
}

Search.displayName = "Search";
