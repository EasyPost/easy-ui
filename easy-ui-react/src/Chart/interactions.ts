import { isEqual } from "lodash";
import type { ChartOption } from "./types";

const items = <T>(value: T | T[] | undefined): T[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

function matching<T extends { id?: string | number }>(
  value: T | T[] | undefined,
  item: T,
  index: number,
) {
  const list = items(value);
  return item.id === undefined
    ? list[index]
    : list.find((candidate) => String(candidate.id) === String(item.id));
}

const zoomSettings = [
  "start",
  "end",
  "startValue",
  "endValue",
  "rangeMode",
  "type",
  "xAxisIndex",
  "yAxisIndex",
  "radiusAxisIndex",
  "angleAxisIndex",
  "filterMode",
  "orient",
] as const;

/** Keep local interaction state only while its application settings are unchanged. */
export function preserveInteractions(
  next: ChartOption,
  previous: ChartOption,
  current: ChartOption,
): ChartOption {
  const result = { ...next };
  if (next.baseOption) {
    result.baseOption = preserveInteractions(
      next.baseOption as ChartOption,
      (previous.baseOption ?? {}) as ChartOption,
      current,
    );
  }
  if (next.dataZoom) {
    result.dataZoom = items(next.dataZoom).map((zoom, index) => {
      const before = matching(previous.dataZoom, zoom, index);
      const active = matching(current.dataZoom, zoom, index);
      if (
        !before ||
        !active ||
        !zoomSettings.every((key) => isEqual(zoom[key], before[key]))
      )
        return zoom;
      // getOption includes both calculated percentages and values. Select the
      // authored range mode so a value window does not become a percentage one.
      const rangeMode = zoom.rangeMode ?? [
        zoom.startValue != null && zoom.start == null ? "value" : "percent",
        zoom.endValue != null && zoom.end == null ? "value" : "percent",
      ];
      return {
        ...zoom,
        start: active.start,
        end: active.end,
        startValue: active.startValue,
        endValue: active.endValue,
        rangeMode,
      };
    });
  }
  if (next.legend) {
    result.legend = items(next.legend).map((legend, index) => {
      const before = matching(previous.legend, legend, index);
      const active = matching(current.legend, legend, index);
      return before &&
        active &&
        isEqual(legend.selected, before.selected) &&
        legend.selectedMode === before.selectedMode
        ? { ...legend, selected: { ...active.selected } }
        : legend;
    });
  }
  return result;
}
