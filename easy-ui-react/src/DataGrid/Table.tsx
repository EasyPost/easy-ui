import React, { CSSProperties, ReactElement, useMemo, useRef } from "react";
import { useTable } from "react-aria";
import { useTableState } from "react-stately";
import { classNames, getComponentToken, variationName } from "../utilities/css";
import { Cell, StaticCell } from "./Cell";
import { ColumnHeader } from "./ColumnHeader";
import { ExpandedRowContent } from "./ExpandedRowContent";
import { HeaderRow } from "./HeaderRow";
import { Row, StaticRow } from "./Row";
import { RowGroup } from "./RowGroup";
import {
  ACTIONS_COLUMN_KEY,
  DEFAULT_MAX_ROWS,
  DEFAULT_SIZE,
  EXPAND_COLUMN_KEY,
} from "./constants";
import { DataGridTableContext } from "./context";
import { Column, DataGridProps, Row as RowType } from "./types";
import { useEdgeInterceptors } from "./useEdgeInterceptors";
import { useExpandedRow } from "./useExpandedRow";
import { Spinner } from "../Spinner";

import styles from "./DataGrid.module.scss";

type TableProps<C extends Column, R extends RowType> = Omit<
  DataGridProps<C, R>,
  "children"
> & {
  children?: [ReactElement, ReactElement];
};

export function Table<C extends Column, R extends RowType>(
  props: TableProps<C, R>,
) {
  const {
    headerVariant,
    maxRows = DEFAULT_MAX_ROWS,
    renderExpandedRow = (r) => r,
    selectionMode,
    size = DEFAULT_SIZE,
    renderEmptyState = () => "No Data",
    isLoading = false,
  } = props;

  const outerContainerRef = useRef<HTMLDivElement | null>(null);
  const innerContainerRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const state = useTableState({
    ...props,
    selectionMode,
    selectionBehavior: "toggle",
    showSelectionCheckboxes: selectionMode !== "none",
  });
  const { gridProps } = useTable(props, state, tableRef);

  const { expandedRow, expandedRowStyle } = useExpandedRow({
    containerRef: innerContainerRef,
    state,
  });
  const [
    renderInterceptors,
    { isTopEdgeUnderScroll, isLeftEdgeUnderScroll, isRightEdgeUnderScroll },
  ] = useEdgeInterceptors(outerContainerRef);

  const { collection } = state;
  const { columns } = collection;

  const hasSelection = columns.some((c) => c.props.isSelectionCell);
  const hasExpansion = columns.some((c) => c.key === EXPAND_COLUMN_KEY);
  const hasRowActions = columns.some((c) => c.key === ACTIONS_COLUMN_KEY);
  const hasOnRowAction = !!props.onRowAction;

  const dataGridClassName = classNames(
    styles.DataGrid,
    styles[variationName("size", size)],
  );

  const tableClassName = classNames(
    styles.table,
    headerVariant && styles[variationName("header", headerVariant)],
    hasSelection && styles.hasSelection,
    hasExpansion && styles.hasExpansion,
    hasRowActions && styles.hasRowActions,
    isTopEdgeUnderScroll && styles.topEdgeUnderScroll,
    isLeftEdgeUnderScroll && styles.leftEdgeUnderScroll,
    isRightEdgeUnderScroll && styles.rightEdgeUnderScroll,
  );

  const style = {
    ...getComponentToken("data-grid", "max-rows", String(maxRows)),
    ...expandedRowStyle,
  } as CSSProperties;

  const context = useMemo(() => {
    return {
      headerVariant,
      hasSelection,
      hasExpansion,
      hasRowActions,
      hasOnRowAction,
      isTopEdgeUnderScroll,
      isLeftEdgeUnderScroll,
      isRightEdgeUnderScroll,
    };
  }, [
    headerVariant,
    hasSelection,
    hasExpansion,
    hasRowActions,
    hasOnRowAction,
    isTopEdgeUnderScroll,
    isLeftEdgeUnderScroll,
    isRightEdgeUnderScroll,
  ]);

  return (
    <DataGridTableContext.Provider value={context}>
      <div ref={outerContainerRef} className={dataGridClassName} style={style}>
        <div ref={innerContainerRef} className={styles.innerContainer}>
          <table {...gridProps} ref={tableRef} className={tableClassName}>
            <RowGroup as="thead">
              {collection.headerRows.map((headerRow) => (
                <HeaderRow key={headerRow.key} item={headerRow} state={state}>
                  {[...headerRow.childNodes].map((column) => (
                    <ColumnHeader
                      key={column.key}
                      column={column}
                      state={state}
                    />
                  ))}
                </HeaderRow>
              ))}
            </RowGroup>
            <RowGroup as="tbody">
              {collection.size === 0 || isLoading ? (
                <StaticRow>
                  <StaticCell colSpan={collection.columnCount}>
                    {isLoading ? (
                      <Spinner isIndeterminate size="sm">
                        Loading..
                      </Spinner>
                    ) : (
                      renderEmptyState()
                    )}
                  </StaticCell>
                </StaticRow>
              ) : (
                [...collection.body.childNodes].map((row) => (
                  <Row
                    key={row.key}
                    item={row}
                    state={state}
                    isExpanded={
                      expandedRow ? expandedRow.key === row.key : false
                    }
                  >
                    {[...row.childNodes].map((cell) => (
                      <Cell key={cell.key} cell={cell} state={state} />
                    ))}
                  </Row>
                ))
              )}
            </RowGroup>
          </table>
          {expandedRow && (
            <ExpandedRowContent>
              {renderExpandedRow(expandedRow.key)}
            </ExpandedRowContent>
          )}
          {renderInterceptors()}
        </div>
      </div>
    </DataGridTableContext.Provider>
  );
}
