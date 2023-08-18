import React, { useRef } from "react";
import { useTable } from "react-aria";
import { useTableState } from "react-stately";
import { Cell } from "./Cell";
import { ColumnHeader } from "./ColumnHeader";
import { HeaderRow } from "./HeaderRow";
import { Row } from "./Row";
import { RowGroup } from "./RowGroup";
import { SelectAllCell } from "./SelectAllCell";
import { SelectCell } from "./SelectCell";
import { TableProps } from "./types";

export function Table<C, R>(props: TableProps<C, R>) {
  const { selectionMode, renderExpandedRow } = props;

  const state = useTableState({
    ...props,
    selectionMode,
    selectionBehavior: "toggle",
    showSelectionCheckboxes: selectionMode !== "none",
  });

  const tableRef = useRef(null);

  const { collection } = state;
  const { gridProps } = useTable(props, state, tableRef);

  return (
    <table {...gridProps} ref={tableRef} style={{ borderCollapse: "collapse" }}>
      <RowGroup as="thead">
        {collection.headerRows.map((headerRow) => (
          <HeaderRow key={headerRow.key} item={headerRow} state={state}>
            {[...headerRow.childNodes].map((column) =>
              column.props.isSelectionCell ? (
                <SelectAllCell key={column.key} column={column} state={state} />
              ) : (
                <ColumnHeader key={column.key} column={column} state={state} />
              ),
            )}
          </HeaderRow>
        ))}
      </RowGroup>
      <RowGroup as="tbody">
        {[...collection.body.childNodes].map((row) => {
          console.log("row", row);
          return (
            <React.Fragment key={row.key}>
              <Row key={row.key} item={row} state={state}>
                {[...row.childNodes].map((cell) => {
                  return cell.props.isSelectionCell ? (
                    <SelectCell key={cell.key} cell={cell} state={state} />
                  ) : (
                    <Cell key={cell.key} cell={cell} state={state} />
                  );
                })}
              </Row>
              {row.value &&
                row.value[
                  "__ezui-table-expanded-rows__" as keyof typeof row.value
                ] === true &&
                renderExpandedRow && (
                  <tr>
                    {/** should make this inside the row instead in real implementation */}
                    {/** should attach an aria-controls and id to trigger and this element */}
                    <td
                      colSpan={[...collection.headerRows[0].childNodes].length}
                    >
                      {renderExpandedRow(row.key)}
                    </td>
                  </tr>
                )}
            </React.Fragment>
          );
        })}
      </RowGroup>
    </table>
  );
}
