// Size probe for a focused SVG time-series screen. This deliberately does NOT
// support the complete gallery and must not be presented as equivalent to it.
import { init, use } from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  TooltipComponent,
} from "echarts/components";
import { LabelLayout, LegacyGridContainLabel } from "echarts/features";
import { SVGRenderer } from "echarts/renderers";

// Preserve the full entry's marker installation/drawing order.
use([
  SVGRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  LegendComponent,
  DataZoomComponent,
  LabelLayout,
  LegacyGridContainLabel,
]);

export { init };
