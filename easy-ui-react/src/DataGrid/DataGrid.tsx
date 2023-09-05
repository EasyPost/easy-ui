import React, { Key, useCallback, useMemo, useState } from "react";
import { Cell, Row, Column, TableBody, TableHeader } from "react-stately";
import { ActionsCellContent } from "./ActionsCellContent";
import { ExpansionCellContent } from "./ExpansionCellContent";
import { Table } from "./Table";
import { EXPAND_COLUMN_KEY, ACTION_COLUMN_KEY } from "./constants";
import { DataGridContext } from "./context";
import { Column as ColumnType, DataGridProps } from "./types";
import { VisuallyHiddenCell } from "./VisuallyHiddenCell";

export function DataGrid<C extends ColumnType = ColumnType>(
  props: DataGridProps<C>,
) {
  const {
    columns: unprocessedColumns,
    columnKeysAllowingSort = [],
    defaultExpandedKey,
    renderColumnCell,
    renderRowCell,
    rowActions,
  } = props;

  if (!Array.isArray(unprocessedColumns) || unprocessedColumns.length === 0) {
    throw new Error("DataGrid must contain a non-empty array of columns");
  }

  // TODO: Support a dynamic row header key via props
  const rowHeaderColumnKey = unprocessedColumns[0].key;

  const [expandedKey, setExpandedKey] = useState(() => {
    return defaultExpandedKey ? defaultExpandedKey : null;
  });

  const toggleExpandedRow = useCallback((rowKey: Key) => {
    setExpandedKey((prevKey) => (prevKey === rowKey ? null : rowKey));
  }, []);

  const columns = useProcessedColumns(props);
  const rows = useProcessedRows(props, expandedKey);

  const context = useMemo(() => {
    return { expandedKey, setExpandedKey };
  }, [expandedKey]);

  return (
    <DataGridContext.Provider value={context}>
      <Table {...props}>
        <TableHeader columns={columns}>
          {(column) => (
            <Column
              isRowHeader={column.key === rowHeaderColumnKey}
              allowsSorting={
                column.key === EXPAND_COLUMN_KEY ||
                column.key === ACTION_COLUMN_KEY
                  ? false
                  : columnKeysAllowingSort.includes(column.key)
              }
            >
              {column.key === EXPAND_COLUMN_KEY ? (
                <VisuallyHiddenCell>Expand row</VisuallyHiddenCell>
              ) : column.key === ACTION_COLUMN_KEY ? (
                <VisuallyHiddenCell>Row actions</VisuallyHiddenCell>
              ) : (
                renderColumnCell(column)
              )}
            </Column>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(row) => (
            <Row>
              {(columnKey) => (
                <Cell>
                  {columnKey === EXPAND_COLUMN_KEY ? (
                    <ExpansionCellContent
                      isExpanded={row.key === expandedKey}
                      toggleExpanded={() => toggleExpandedRow(row.key)}
                    />
                  ) : columnKey === ACTION_COLUMN_KEY && rowActions ? (
                    <ActionsCellContent rowActions={rowActions} />
                  ) : (
                    renderRowCell(
                      row[columnKey as keyof typeof row],
                      row,
                      columnKey,
                    )
                  )}
                </Cell>
              )}
            </Row>
          )}
        </TableBody>
      </Table>
    </DataGridContext.Provider>
  );
}

/**
 * Modifies the passed in columns to include support for Easy UI requirements.
 * This is done before being passed into React Stately's Column interface.
 *
 * @param props data grid props
 * @returns processed columns
 */
function useProcessedColumns<C extends ColumnType>(
  props: Pick<DataGridProps<C>, "renderExpandedRow" | "columns" | "rowActions">,
) {
  const { renderExpandedRow, columns, rowActions } = props;
  const hasExpandableRows = Boolean(renderExpandedRow);
  const hasRowActions = Boolean(rowActions);
  return useMemo(() => {
    let c = columns;
    if (hasExpandableRows) {
      c = [{ key: EXPAND_COLUMN_KEY } as C, ...c];
    }
    if (hasRowActions) {
      c = [...c, { key: ACTION_COLUMN_KEY } as C];
    }
    return c;
  }, [columns, hasExpandableRows, hasRowActions]);
}

/**
 * Modifies the passed in rows to include support for Easy UI requirements.
 * This is done before being passed into React Stately's Row interface.
 *
 * @param props data grid props
 * @param expandedKey the currently expanded row key
 * @returns processed rows
 */
function useProcessedRows<C extends ColumnType>(
  props: Pick<DataGridProps<C>, "renderExpandedRow" | "rows" | "rowActions">,
  expandedKey: Key | null,
) {
  const { renderExpandedRow, rows, rowActions } = props;

  const hasExpandableRows = Boolean(renderExpandedRow);
  const hasRowActions = Boolean(rowActions);

  return useMemo(() => {
    const mappedRows = rows.map((row) => {
      let r = row;
      if (hasExpandableRows) {
        r = { [EXPAND_COLUMN_KEY]: expandedKey === row.key, ...r };
      }
      if (hasRowActions) {
        r = { ...r, [ACTION_COLUMN_KEY]: true };
      }
      return r;
    });
    return mappedRows;
  }, [rows, hasExpandableRows, hasRowActions, expandedKey]);
}
