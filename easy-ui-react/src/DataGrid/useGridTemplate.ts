import range from "lodash/range";
import { CSSProperties } from "react";
import { TableState } from "react-stately";
import { getComponentToken } from "../utilities/css";
import { EXPAND_COLUMN_KEY, ACTIONS_COLUMN_KEY } from "./constants";

/**
 * Build the CSS grid template definitions for the Data Grid based on the
 * table column definitions along with any custom template column configuration
 * provided by the user.
 */
export function useGridTemplate({
  templateColumns,
  state,
}: {
  templateColumns?: string;
  state: TableState<unknown>;
}) {
  const { columns } = state.collection;

  const userColumns = columns.filter(
    (c) =>
      !c.props.isSelectionCell &&
      c.key !== EXPAND_COLUMN_KEY &&
      c.key !== ACTIONS_COLUMN_KEY,
  );

  const uAreas = range(userColumns.length).map(() => ".");
  const uDefs = templateColumns
    ? [templateColumns]
    : range(userColumns.length).map(() => "1fr");
  const pAreas = [];
  const sAreas = [];
  const pDefs = [];
  const sDefs = [];

  if (columns.some((c) => c.props.isSelectionCell)) {
    pAreas.push("select");
    pDefs.push("min-content");
  }
  if (columns.some((c) => c.key === EXPAND_COLUMN_KEY)) {
    pAreas.push("expand");
    pDefs.push("min-content");
  }

  if (columns.some((c) => c.key === ACTIONS_COLUMN_KEY)) {
    sAreas.push("actions");
    sDefs.push("min-content");
  }

  const areas = [pAreas, uAreas, sAreas].flat().join(" ").trim();
  const defs = [pDefs, uDefs, sDefs].flat().join(" ").trim();

  const gridTemplateStyle = {
    ...getComponentToken("data-grid", "template-areas", `"${areas}"`),
    ...getComponentToken("data-grid", "template-columns", defs),
  } as CSSProperties;

  return { gridTemplateStyle };
}
