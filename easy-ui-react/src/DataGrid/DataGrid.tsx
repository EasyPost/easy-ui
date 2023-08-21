import React, { Key, useMemo, useState } from "react";
import { Cell, Row, Column, TableBody, TableHeader } from "react-stately";
import { ActionsCell } from "./ActionsCell";
import { ExpansionCell } from "./ExpansionCell";
import { Table } from "./Table";
import { EXPAND_ROW_COLUMN_KEY, ROW_ACTIONS_COLUMN_KEY } from "./constants";
import { DataGridContext } from "./context";
import { Column as ColumnType, DataGridProps } from "./types";

export function DataGrid<C extends ColumnType = ColumnType>(
  props: DataGridProps<C>,
) {
  const {
    columns: unprocessedColumns,
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
            <Column isRowHeader={column.key === rowHeaderColumnKey}>
              {column.key === EXPAND_ROW_COLUMN_KEY
                ? null
                : column.key === ROW_ACTIONS_COLUMN_KEY
                ? null
                : renderColumnCell(column)}
            </Column>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(row) => (
            <Row>
              {(columnKey) => {
                const item = row[columnKey as keyof typeof row];
                return (
                  <Cell>
                    {columnKey === EXPAND_ROW_COLUMN_KEY ? (
                      <ExpansionCell
                        isExpanded={row.key === expandedKey}
                        toggleExpanded={() => {
                          setExpandedKey((prevKey) =>
                            prevKey === row.key ? null : row.key,
                          );
                        }}
                      />
                    ) : columnKey === ROW_ACTIONS_COLUMN_KEY && rowActions ? (
                      <ActionsCell rowActions={rowActions} />
                    ) : (
                      renderRowCell(item, row, columnKey)
                    )}
                  </Cell>
                );
              }}
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
      c = [{ key: EXPAND_ROW_COLUMN_KEY } as C, ...c];
    }
    if (hasRowActions) {
      c = [...c, { key: ROW_ACTIONS_COLUMN_KEY } as C];
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
        r = { [EXPAND_ROW_COLUMN_KEY]: expandedKey === row.key, ...r };
      }
      if (hasRowActions) {
        r = { ...r, [ROW_ACTIONS_COLUMN_KEY]: true };
      }
      return r;
    });
    return mappedRows;
  }, [rows, hasExpandableRows, hasRowActions, expandedKey]);
}
