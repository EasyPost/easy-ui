import React, { CSSProperties, Fragment, useRef } from "react";
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
  ACTIONS_COLUMN_KEY,
  DEFAULT_MAX_ROWS,
  EXPAND_COLUMN_KEY,
} from "./constants";
import { Column, DataGridProps } from "./types";
import { useEdgeInterceptors } from "./useEdgeInterceptors";
import { useExpandedRow } from "./useExpandedRow";
import { useGridTemplate } from "./useGridTemplate";

import styles from "./DataGrid.module.scss";

export function Table<C extends Column>(props: DataGridProps<C>) {
  const {
    headerVariant,
    maxRows = DEFAULT_MAX_ROWS,
    renderExpandedRow = (r) => r,
    selectionMode,
    templateColumns,
  } = props;

  const containerRef = useRef<HTMLDivElement | null>(null);
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

  const {
    pendingExpandedRow,
    expandedRow,
    pendingExpandedRowStyle,
    expandedRowStyle,
  } = useExpandedRow({
    tableRef,
    state,
  });
  const { gridTemplateStyle } = useGridTemplate({ templateColumns, state });
  const [
    renderInterceptors,
    { isTopEdgeUnderScroll, isLeftEdgeUnderScroll, isRightEdgeUnderScroll },
  ] = useEdgeInterceptors(containerRef);

  const { collection } = state;
  const { columns } = collection;

  const hasSelection = columns.some((c) => c.props.isSelectionCell);
  const hasExpansion = columns.some((c) => c.key === EXPAND_COLUMN_KEY);
  const hasRowActions = columns.some((c) => c.key === ACTIONS_COLUMN_KEY);

  const className = classNames(
    styles.table,
    headerVariant && styles[variationName("header", headerVariant)],
    hasSelection && styles.hasSelection,
    hasExpansion && styles.hasExpansion,
    hasRowActions && styles.hasRowActions,
    isTopEdgeUnderScroll && styles.headerUnderScroll,
    isLeftEdgeUnderScroll && styles.leftEdgeUnderScroll,
    isRightEdgeUnderScroll && styles.rightEdgeUnderScroll,
  );

  const style = {
    ...getComponentToken("data-grid", "max-rows", String(maxRows)),
    ...gridTemplateStyle,
    ...pendingExpandedRowStyle,
    ...expandedRowStyle,
  } as CSSProperties;

  return (
    <div ref={containerRef} className={styles.DataGrid} style={style}>
      <div {...gridProps} ref={tableRef} className={className}>
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
            <Row
              key={row.key}
              item={row}
              state={state}
              isExpanded={expandedRow ? expandedRow.key === row.key : false}
            >
              {[...row.childNodes].map((cell) =>
                cell.props.isSelectionCell ? (
                  <SelectCell key={cell.key} cell={cell} state={state} />
                ) : (
                  <Cell key={cell.key} cell={cell} state={state} />
                ),
              )}
            </Row>
          ))}
        </RowGroup>
        {[pendingExpandedRow, expandedRow].map((row, i) => (
          <Fragment key={i}>
            {row && (
              <ExpandedRowContent isPending={i === 0}>
                {renderExpandedRow(row.key)}
              </ExpandedRowContent>
            )}
          </Fragment>
        ))}
        {renderInterceptors()}
      </div>
    </div>
  );
}
