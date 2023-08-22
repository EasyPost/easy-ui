import React, { CSSProperties, useRef } from "react";
import { useTable } from "react-aria";
import { useTableState } from "react-stately";
import { classNames, getComponentToken } from "../utilities/css";
import { Cell } from "./Cell";
import { ColumnHeader } from "./ColumnHeader";
import { HeaderRow } from "./HeaderRow";
import { Row } from "./Row";
import { RowGroup } from "./RowGroup";
import { SelectAllCell } from "./SelectAllCell";
import { SelectCell } from "./SelectCell";
import { EXPAND_ROW_COLUMN_KEY } from "./constants";
import { Column, DataGridProps } from "./types";

import styles from "./DataGrid.module.scss";

export function Table<C extends Column>(props: DataGridProps<C>) {
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

  const className = classNames(styles.DataGrid);

  const style = {
    ...getComponentToken(
      "data-grid",
      "columns",
      String(state.collection.columnCount),
    ),
  } as CSSProperties;

  return (
    <div {...gridProps} ref={tableRef} className={className} style={style}>
      <div role="presentation" className={styles.contents}>
        <RowGroup>
          {collection.headerRows.map((headerRow) => (
            <HeaderRow key={headerRow.key} item={headerRow} state={state}>
              {[...headerRow.childNodes].map((column) =>
                column.props.isSelectionCell ? (
                  <SelectAllCell
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
          {[...collection.body.childNodes].map((row) => {
            return (
              <React.Fragment key={row.key}>
                <Row item={row} state={state}>
                  {[...row.childNodes].map((cell) => {
                    return cell.props.isSelectionCell ? (
                      <SelectCell key={cell.key} cell={cell} state={state} />
                    ) : (
                      <Cell key={cell.key} cell={cell} state={state} />
                    );
                  })}
                </Row>
                {row.value &&
                  row.value[EXPAND_ROW_COLUMN_KEY as keyof typeof row.value] ===
                    true &&
                  renderExpandedRow && (
                    <tr>
                      {/** should make this inside the row instead in real implementation */}
                      {/** should attach an aria-controls and id to trigger and this element */}
                      <td
                        colSpan={
                          [...collection.headerRows[0].childNodes].length
                        }
                      >
                        {renderExpandedRow(row.key)}
                      </td>
                    </tr>
                  )}
              </React.Fragment>
            );
          })}
        </RowGroup>
      </div>
    </div>
  );
}
