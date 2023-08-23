import React, { CSSProperties, useRef } from "react";
import { useTable } from "react-aria";
import { useTableState } from "react-stately";
import { classNames, getComponentToken, variationName } from "../utilities/css";
import { Cell } from "./Cell";
import { ColumnHeader } from "./ColumnHeader";
import { ExpandedRowContent } from "./ExpandedRowContent";
import { HeaderRow } from "./HeaderRow";
import { Row } from "./Row";
import { RowGroup } from "./RowGroup";
import { SelectAllColumnHeader } from "./SelectAllColumnHeader";
import { SelectCell } from "./SelectCell";
import {
  DEFAULT_MAX_ROWS,
  EXPAND_ROW_COLUMN_KEY,
  ROW_ACTIONS_COLUMN_KEY,
} from "./constants";
import { Column, DataGridProps } from "./types";
import { useExpandedRow } from "./useExpandedRow";
import { useGridTemplate } from "./useGridTemplate";

import styles from "./DataGrid.module.scss";

export function Table<C extends Column>(props: DataGridProps<C>) {
  const {
    headerVariant,
    maxRows = DEFAULT_MAX_ROWS,
    renderExpandedRow,
    selectionMode,
    templateColumns,
  } = props;

  const tableRef = useRef<HTMLDivElement | null>(null);
  const state = useTableState({
    ...props,
    selectionMode,
    selectionBehavior: "toggle",
    showSelectionCheckboxes: selectionMode !== "none",
  });
  const { gridProps } = useTable(
    { ...props, focusMode: "cell" },
    state,
    tableRef,
  );

  const { expandedRow, expandedRowStyle } = useExpandedRow({ tableRef, state });
  const { gridTemplateStyle } = useGridTemplate({ templateColumns, state });

  const { collection } = state;
  const { columns } = collection;

  const hasSelection = columns.some((c) => c.props.isSelectionCell);
  const hasExpansion = columns.some((c) => c.key === EXPAND_ROW_COLUMN_KEY);
  const hasRowActions = columns.some((c) => c.key === ROW_ACTIONS_COLUMN_KEY);

  const className = classNames(
    styles.DataGrid,
    headerVariant && styles[variationName("header", headerVariant)],
    hasSelection && styles.hasSelection,
    hasExpansion && styles.hasExpansion,
    hasRowActions && styles.hasRowActions,
  );

  const style = {
    ...getComponentToken("data-grid", "max-rows", String(maxRows)),
    ...gridTemplateStyle,
    ...expandedRowStyle,
  } as CSSProperties;

  return (
    <div {...gridProps} ref={tableRef} className={className} style={style}>
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
                <ColumnHeader key={column.key} column={column} state={state} />
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
        <ExpandedRowContent>
          {renderExpandedRow(expandedRow.key)}
        </ExpandedRowContent>
      )}
    </div>
  );
}
