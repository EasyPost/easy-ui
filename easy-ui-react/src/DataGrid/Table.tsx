import React, { CSSProperties, useRef } from "react";
import { useTable } from "react-aria";
import { useTableState } from "react-stately";
import { useIntersectionDetection } from "../Modal/useIntersectionDetection";
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
  EXPAND_COLUMN_KEY,
  ACTION_COLUMN_KEY,
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

  const headerInterceptorRef = useRef<HTMLDivElement | null>(null);
  const isHeaderUnderScroll = useIntersectionDetection(
    headerInterceptorRef,
    containerRef,
  );
  const leftColumnInterceptorRef = useRef<HTMLDivElement | null>(null);
  const isLeftEdgeUnderScroll = useIntersectionDetection(
    leftColumnInterceptorRef,
    containerRef,
  );
  const rightColumnInterceptorRef = useRef<HTMLDivElement | null>(null);
  const isRightEdgeUnderScroll = useIntersectionDetection(
    rightColumnInterceptorRef,
    containerRef,
  );

  const { collection } = state;
  const { columns } = collection;

  const hasSelection = columns.some((c) => c.props.isSelectionCell);
  const hasExpansion = columns.some((c) => c.key === EXPAND_COLUMN_KEY);
  const hasRowActions = columns.some((c) => c.key === ACTION_COLUMN_KEY);

  const className = classNames(
    styles.DataGrid,
    headerVariant && styles[variationName("header", headerVariant)],
    hasSelection && styles.hasSelection,
    hasExpansion && styles.hasExpansion,
    hasRowActions && styles.hasRowActions,
    isHeaderUnderScroll && styles.headerUnderScroll,
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
    <div ref={containerRef} className={styles.container} style={style}>
      <div {...gridProps} ref={tableRef} className={className}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
          }}
          ref={headerInterceptorRef}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: 1,
          }}
          ref={leftColumnInterceptorRef}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: 1,
          }}
          ref={rightColumnInterceptorRef}
        />
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
        {pendingExpandedRow && renderExpandedRow && (
          <ExpandedRowContent isPending>
            {renderExpandedRow(pendingExpandedRow.key)}
          </ExpandedRowContent>
        )}
        {expandedRow && renderExpandedRow && (
          <ExpandedRowContent>
            {renderExpandedRow(expandedRow.key)}
          </ExpandedRowContent>
        )}
      </div>
    </div>
  );
}
