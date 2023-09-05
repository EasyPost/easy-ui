import React, { ComponentProps } from "react";
import { SortDirection } from "react-stately";
import { classNames } from "../utilities/css";

import styles from "./DataGrid.module.scss";

export type SortIndicatorProps = {
  isColumnSorted: boolean;
  sortDirection?: SortDirection;
};

export function SortIndicator({
  isColumnSorted,
  sortDirection,
}: SortIndicatorProps) {
  return (
    <span
      aria-hidden="true"
      className={classNames(
        styles.sortIcon,
        isColumnSorted && styles.sortIconIsSorted,
      )}
    >
      {isColumnSorted && sortDirection === "ascending" ? <Asc /> : <Desc />}
    </span>
  );
}

function Desc() {
  return <Arrow style={{ transform: "rotate(0deg)" }} />;
}

function Asc() {
  return <Arrow style={{ transform: "rotate(180deg)" }} />;
}

function Arrow(props: ComponentProps<"svg">) {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0.344238L0 0.344238L6 7.561L12 0.344238Z"
      />
    </svg>
  );
}
