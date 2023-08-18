import React, { useMemo, useState } from "react";
import {
  Cell,
  Row,
  Column as StatelyColumn,
  TableBody,
  TableHeader,
} from "react-stately";
import { ActionsCell } from "./ActionsCell";
import { ExpansionCell } from "./ExpansionCell";
import { Table } from "./Table";
import { Column, TableProps } from "./types";

export function DataGrid<C extends Column = Column, R extends Column = Column>(
  props: TableProps<C, R>,
) {
  const {
    defaultExpandedKey,
    hasExpandableRows,
    columns,
    rows,
    renderColumnCell,
    renderRowCell,
    rowActions,
  } = props;

  const hasRowActions = Boolean(rowActions);

  const [expandedKey, setExpandedKey] = useState(() => {
    return defaultExpandedKey ? defaultExpandedKey : null;
  });

  const effectiveColumns = useMemo(() => {
    let c = columns;
    if (hasExpandableRows) {
      c = [{ key: "__ezui-table-expanded-rows__" } as C, ...c];
    }
    if (hasRowActions) {
      c = [...c, { key: "__ezui-table-row-actions__" } as C];
    }
    return c;
  }, [columns, hasExpandableRows, hasRowActions]);

  const effectiveRows = useMemo(() => {
    const mappedRows = rows.map((row) => {
      let r = row;
      if (hasExpandableRows) {
        r = { "__ezui-table-expanded-rows__": expandedKey === row.key, ...r };
      }
      if (hasRowActions) {
        r = { ...r, "__ezui-table-row-actions__": true };
      }
      return r;
    });
    return mappedRows;
  }, [rows, hasExpandableRows, hasRowActions, expandedKey]);

  return (
    <Table<C, R> {...props}>
      <TableHeader columns={effectiveColumns}>
        {(column) => (
          <StatelyColumn isRowHeader={column.key === columns[0].key}>
            {column.key === "__ezui-table-expanded-rows__"
              ? null
              : column.key === "__ezui-table-row-actions__"
              ? null
              : renderColumnCell(column)}
          </StatelyColumn>
        )}
      </TableHeader>
      <TableBody items={effectiveRows}>
        {(row) => (
          <Row>
            {(columnKey) => {
              const item = row[columnKey as keyof typeof row];
              return (
                <Cell>
                  {columnKey === "__ezui-table-expanded-rows__" ? (
                    <ExpansionCell
                      isExpanded={row.key === expandedKey}
                      toggleExpanded={() => {
                        setExpandedKey((prevKey) =>
                          prevKey === row.key ? null : row.key,
                        );
                      }}
                    />
                  ) : columnKey === "__ezui-table-row-actions__" &&
                    rowActions ? (
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
  );
}
