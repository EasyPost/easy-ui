import React, { CSSProperties, useRef } from "react";
import { useTable } from "react-aria";
import { useTableState } from "react-stately";
import { classNames, getComponentToken, variationName } from "../utilities/css";
import { Cell } from "./Cell";
import { ColumnHeader } from "./ColumnHeader";
import { HeaderRow } from "./HeaderRow";
import { Row } from "./Row";
import { RowGroup } from "./RowGroup";
import { SelectAllColumnHeader } from "./SelectAllColumnHeader";
import { SelectCell } from "./SelectCell";
import { EXPAND_ROW_COLUMN_KEY, ROW_ACTIONS_COLUMN_KEY } from "./constants";
import { Column, DataGridProps } from "./types";
import { ExpandedRow } from "./ExpandedRow";

import styles from "./DataGrid.module.scss";

export function Table<C extends Column>(props: DataGridProps<C>) {
  const { headerVariant, renderExpandedRow, selectionMode, templateColumns } =
    props;

  const state = useTableState({
    ...props,
    selectionMode,
    selectionBehavior: "toggle",
    showSelectionCheckboxes: selectionMode !== "none",
  });

  const tableRef = useRef(null);

  const { collection } = state;
  const { gridProps } = useTable(
    { ...props, focusMode: "cell" },
    state,
    tableRef,
  );
  const firstColumn = collection.columns[0];
  const lastColumn = collection.columns[collection.columns.length - 1];
  const isInteractiveLeft =
    firstColumn.props.isSelectionCell ||
    firstColumn.key === EXPAND_ROW_COLUMN_KEY;
  const isInteractiveRight = lastColumn.key === ROW_ACTIONS_COLUMN_KEY;

  const className = classNames(
    styles.DataGrid,
    headerVariant && styles[variationName("header", headerVariant)],
    isInteractiveLeft && styles.interactiveLeft,
    isInteractiveRight && styles.interactiveRight,
  );

  const cols = collection.columnCount;
  const offset = collection.columns.filter(
    (c) =>
      c.props.isSelectionCell ||
      c.key === EXPAND_ROW_COLUMN_KEY ||
      c.key === ROW_ACTIONS_COLUMN_KEY,
  ).length;

  const areas = Array.from({ length: cols - offset }, () => ".").join(" ");
  const columns = templateColumns
    ? templateColumns
    : Array.from({ length: cols - offset }, () => "1fr").join(" ");

  const prefixAreas = [];
  const prefixColumns = [];
  if (collection.columns.find((c) => c.props.isSelectionCell)) {
    prefixAreas.push("select");
    prefixColumns.push("min-content");
  }
  if (collection.columns.find((c) => c.key === EXPAND_ROW_COLUMN_KEY)) {
    prefixAreas.push("expand");
    prefixColumns.push("min-content");
  }

  const suffixAreas = [];
  const suffixColumns = [];
  if (collection.columns.find((c) => c.key === ROW_ACTIONS_COLUMN_KEY)) {
    suffixAreas.push("actions");
    suffixColumns.push("min-content");
  }

  const style = {
    ...getComponentToken(
      "data-grid",
      "template-areas",
      `"${`${prefixAreas.join(" ")} ${areas} ${suffixAreas.join(
        " ",
      )}`.trim()}"`,
    ),
    ...getComponentToken(
      "data-grid",
      "template-columns",
      `${prefixColumns.join(" ")} ${columns} ${suffixColumns.join(" ")}`.trim(),
    ),
  } as CSSProperties;

  const expandedRow = [...collection.body.childNodes].find((r) => {
    return r.value
      ? r.value[EXPAND_ROW_COLUMN_KEY as keyof typeof r.value] === true
      : false;
  });

  return (
    <div {...gridProps} ref={tableRef} className={className} style={style}>
      <div role="presentation" className={styles.contentWrapper}>
        <RowGroup>
          {collection.headerRows.map((headerRow) => (
            <HeaderRow key={headerRow.key} item={headerRow} state={state}>
              {[...headerRow.childNodes].map((column) =>
                column.props.isSelectionCell ? (
                  <SelectAllColumnHeader
                    key={column.key}
                    column={column}
                    state={state}
                  />
                ) : (
                  <ColumnHeader
                    key={column.key}
                    column={column}
                    state={state}
                  />
                ),
              )}
            </HeaderRow>
          ))}
        </RowGroup>
        <RowGroup>
          {[...collection.body.childNodes].map((row) => (
            <Row key={row.key} item={row} state={state}>
              {[...row.childNodes].map((cell) => {
                return cell.props.isSelectionCell ? (
                  <SelectCell key={cell.key} cell={cell} state={state} />
                ) : (
                  <Cell key={cell.key} cell={cell} state={state} />
                );
              })}
            </Row>
          ))}
        </RowGroup>
        {expandedRow && renderExpandedRow && (
          <ExpandedRow>{renderExpandedRow(expandedRow.key)}</ExpandedRow>
        )}
      </div>
    </div>
  );
}
