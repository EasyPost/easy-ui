import ExpandMore400 from "@easypost/easy-ui-icons/ExpandMore400";
import { Key } from "@react-types/shared";
import React, { useId } from "react";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { Text } from "../Text";
import { UnstyledButton } from "../UnstyledButton";
import { classNames, variationName } from "../utilities/css";
import type { PaginationSize } from "./Pagination";

import styles from "./PaginationRowsPerPage.module.scss";

export type PaginationRowsPerPageProps = {
  /** The number of rows currently shown per page. */
  rowsPerPage: number;

  /** The rows per page counts to choose from. */
  options: number[];

  /** Handler that is called when another count is selected. */
  onChange: (rowsPerPage: number) => void;

  /**
   * Label rendered alongside the menu trigger.
   * @default Rows Per Page:
   */
  label?: string;

  /**
   * Size of the control. Matches the sizes of the numbered `<Pagination />`
   * scheme so the two can sit side by side.
   * @default md
   */
  size?: PaginationSize;

  /** Whether the menu should be disabled. */
  isDisabled?: boolean;
};

/**
 * A fully controlled menu for choosing how many rows a page shows.
 *
 * @remarks
 * Rendered on its own rather than as a child of `<Pagination />`, which only
 * accepts a scheme. It lives here because page size is a pagination concern and
 * its sizes are drawn to match the numbered scheme's.
 *
 * @example
 * ```tsx
 * <Pagination.RowsPerPage
 *   rowsPerPage={rowsPerPage}
 *   options={[25, 50, 100]}
 *   onChange={setRowsPerPage}
 * />
 * ```
 */
export function PaginationRowsPerPage(props: PaginationRowsPerPageProps) {
  const {
    rowsPerPage,
    options,
    onChange,
    label = "Rows Per Page:",
    size = "md",
    isDisabled,
  } = props;

  const labelId = useId();
  const valueId = useId();

  // The trigger's own text is just the count, so the label is stitched onto it
  // to keep the accessible name meaningful
  const triggerLabelledBy = `${labelId} ${valueId}`;

  return (
    <div className={styles.RowsPerPage}>
      <Text
        id={labelId}
        variant={size === "sm" ? "body2" : "body1"}
        color="neutral.800"
      >
        {label}
      </Text>
      <Menu isDisabled={isDisabled}>
        <Menu.Trigger>
          <UnstyledButton
            className={classNames(
              styles.trigger,
              styles[variationName("size", size)],
            )}
            aria-labelledby={triggerLabelledBy}
            isDisabled={isDisabled}
          >
            <span id={valueId}>{rowsPerPage}</span>
            {/* Design holds the chevron at 24px in both sizes, which is the
                icon's own default */}
            <Icon symbol={ExpandMore400} size="md" />
          </UnstyledButton>
        </Menu.Trigger>
        <Menu.Overlay
          selectionMode="single"
          selectedKeys={[String(rowsPerPage)]}
          onSelectionChange={(keys) => {
            const key = getSelectedKey(keys);
            if (key != null) {
              onChange(Number(key));
            }
          }}
        >
          {options.map((option) => (
            <Menu.Item key={String(option)}>{String(option)}</Menu.Item>
          ))}
        </Menu.Overlay>
      </Menu>
    </div>
  );
}

/**
 * Pulls the single key out of a selection, which single selection mode
 * still models as a set.
 *
 * @param keys the menu's selection
 * @returns the selected key, or `null` when nothing is selected
 */
function getSelectedKey(keys: "all" | Set<Key>): Key | null {
  if (keys === "all") {
    return null;
  }
  const [key] = keys;
  return key ?? null;
}

PaginationRowsPerPage.displayName = "Pagination.RowsPerPage";
