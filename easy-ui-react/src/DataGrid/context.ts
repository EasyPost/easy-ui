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
    throw new Error("useDataGrid must be within a DataGrid");
  }
  return dataGridContext;
};
