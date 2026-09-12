import { merge } from "lodash";
import type { ChartOption } from "./types";

/** Read resolved CSS values so nested Easy UI themes also style SVG/canvas. */
export function themedOption(
  element: HTMLElement,
  option: ChartOption,
  reducedMotion: boolean,
): ChartOption {
  const css = getComputedStyle(element);
  const token = (name: string, fallback: string) =>
    css.getPropertyValue(`--ezui-${name}`).trim() || fallback;
  const text = token("color-neutral-800", "#172b4d");
  const muted = token("color-neutral-600", "#50647e");
  const line = token("color-neutral-200", "#dfe5ed");
  const axis = {
    axisLabel: { color: muted, hideOverlap: true },
    nameTextStyle: { color: muted },
    axisLine: { lineStyle: { color: line } },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: line } },
  };
  const result = merge(
    {},
    {
      animation: false,
      backgroundColor: "transparent",
      textStyle: { fontFamily: css.fontFamily || "sans-serif", color: text },
      color: [
        token("color-primary-600", "#113abf"),
        token("color-secondary-600", "#772bb0"),
        "#007f86",
        "#bd6900",
        "#bd4278",
        "#627891",
      ],
      legend: { textStyle: { color: text } },
      tooltip: {
        confine: true,
        renderMode: "richText",
        backgroundColor: token("color-neutral-050", "#ffffff"),
        borderColor: line,
        textStyle: { color: text },
      },
    },
    option,
  ) as ChartOption;
  // Keep arrays intact; never merge a default axis object into an axis array.
  const withAxis = <T extends object>(value: T | T[] | undefined) =>
    !value
      ? undefined
      : Array.isArray(value)
        ? value.map((item) => merge({}, axis, item))
        : merge({}, axis, value);
  if (option.xAxis) result.xAxis = withAxis(option.xAxis);
  if (option.yAxis) result.yAxis = withAxis(option.yAxis);
  if (option.baseOption) {
    result.baseOption = themedOption(
      element,
      option.baseOption as ChartOption,
      reducedMotion,
    );
  }
  if (reducedMotion) disableAnimation(result);
  return result;
}

function disableAnimation(option: ChartOption) {
  option.animation = false;
  const series = Array.isArray(option.series)
    ? option.series
    : option.series
      ? [option.series]
      : [];
  for (const item of series) item.animation = false;
  if (option.baseOption) disableAnimation(option.baseOption as ChartOption);
  for (const media of option.media ?? []) {
    if (media.option) disableAnimation(media.option as ChartOption);
  }
  for (const frame of option.options ?? [])
    disableAnimation(frame as ChartOption);
}
