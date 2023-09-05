import {
  Dispatch,
  Key,
  SetStateAction,
  createContext,
  useContext,
} from "react";

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

type DataGridRowContextType = {
  removeHover: () => void;
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
