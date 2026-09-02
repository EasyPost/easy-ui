import ExpandMore400 from "@easypost/easy-ui-icons/ExpandMore400";
import { Key } from "@react-types/shared";
import React, { useId } from "react";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { Text } from "../Text";
import { UnstyledButton } from "../UnstyledButton";

import styles from "./RowsPerPageMenu.module.scss";

export type DataGridRowsPerPageMenuProps = {
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

  /** Whether the menu should be disabled. */
  isDisabled?: boolean;
};

/**
 * A fully controlled menu for choosing how many rows a data grid page shows.
 *
 * @remarks
 * Intended for the end region of a `<DataGrid.Footer />`, though it carries no
 * dependency on the footer and can be placed anywhere.
 *
 * @example
 * ```tsx
 * <DataGrid.RowsPerPageMenu
 *   rowsPerPage={rowsPerPage}
 *   options={[25, 50, 100]}
 *   onChange={setRowsPerPage}
 * />
 * ```
 */
export function DataGridRowsPerPageMenu(props: DataGridRowsPerPageMenuProps) {
  const {
    rowsPerPage,
    options,
    onChange,
    label = "Rows Per Page:",
    isDisabled,
  } = props;

  const labelId = useId();
  const valueId = useId();

  // The trigger's own text is just the count, so the label is stitched onto it
  // to keep the accessible name meaningful
  const triggerLabelledBy = `${labelId} ${valueId}`;

  return (
    <div className={styles.RowsPerPageMenu}>
      <Text id={labelId} variant="body2" color="neutral.900">
        {label}
      </Text>
      <Menu isDisabled={isDisabled}>
        <Menu.Trigger>
          <UnstyledButton
            className={styles.trigger}
            aria-labelledby={triggerLabelledBy}
            isDisabled={isDisabled}
          >
            <span id={valueId}>{rowsPerPage}</span>
            <Icon symbol={ExpandMore400} size="xs" />
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

DataGridRowsPerPageMenu.displayName = "DataGrid.RowsPerPageMenu";
