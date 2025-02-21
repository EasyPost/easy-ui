import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { Key } from "react-aria";
import { DataGridProps } from "./types";

type DataGridContextType = {
  expandedKey: Key | null;
  setExpandedKey: Dispatch<SetStateAction<Key | null>>;
};

export const DataGridContext = createContext<DataGridContextType | null>(null);

export const useDataGrid = () => {
  const dataGridContext = useContext(DataGridContext);
  if (!dataGridContext) {
    throw new Error("useDataGrid must be used within a DataGrid");
  }
  return dataGridContext;
};

type DataGridTableContextType = {
  headerVariant: DataGridProps["headerVariant"];
  hasSelection: boolean;
  hasExpansion: boolean;
  hasRowActions: boolean;
  hasOnRowAction: boolean;
  isTopEdgeUnderScroll: boolean;
  isLeftEdgeUnderScroll: boolean;
  isRightEdgeUnderScroll: boolean;
};

export const DataGridTableContext =
  createContext<DataGridTableContextType | null>(null);

export const useDataGridTable = () => {
  const dataGridTableContext = useContext(DataGridTableContext);
  if (!dataGridTableContext) {
    throw new Error("useDataGridTable must be used within a DataGrid");
  }
  return dataGridTableContext;
};

type DataGridRowContextType = {
  isExpanded: boolean;
  isFocusVisible: boolean;
  removeHover: () => void;
  index?: number;
};

export const DataGridRowContext = createContext<DataGridRowContextType | null>(
  null,
);

export const useDataGridRow = () => {
  const dataGridRowContext = useContext(DataGridRowContext);
  if (!dataGridRowContext) {
    throw new Error("useDataGridRow must be used within a DataGrid.Row");
  }
  return dataGridRowContext;
};
