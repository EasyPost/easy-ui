import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Card } from "../Card";
import { Text } from "../Text";
import { useColorScheme, useTheme } from "../Theme";
import { loadChartEngine, ChartInstance } from "./engine";
import { themedOption } from "./theme";
import { preserveInteractions } from "./interactions";
import { ChartDataTable, ChartOption, ChartSelection } from "./types";
import styles from "./Chart.module.scss";

/** Presentation, data access, and lifecycle options for an analytical chart. */
export type ChartProps = {
  /** Visible heading and accessible name of the chart region. */
  title: string;
  /** Visible description, including units, coverage, and the main finding. */
  description: string;
  /** Native ECharts configuration. Apps own data, aggregation, and formatting. */
  option: ChartOption;
  /** Exact data equivalent for keyboard and assistive-technology access. */
  dataTable: ChartDataTable;
  /** Plot height in CSS pixels; defaults to 320 and is clamped to at least 160. */
  height?: number;
  /** Rendering backend; defaults to SVG. Canvas can suit dense point clouds. */
  renderer?: "svg" | "canvas";
  /** Defaults to ready when the table has rows, otherwise empty. Non-ready states suppress the plot and table. */
  status?: "ready" | "loading" | "empty" | "error";
  /** Coverage or stale/partial-data explanation supplied by the application. */
  notice?: string;
  /** Application controls rendered beside the heading, such as keyboard-accessible series filters. */
  actions?: ReactNode;
  /** Receives ECharts series click data. Provide onRowSelect for equivalent keyboard drill-down. */
  onSelect?: (selection: ChartSelection) => void;
  /** Equivalent keyboard-accessible drill-down using stable table row IDs. */
  onRowSelect?: (id: string) => void;
  /** Shows a retry button in the application error state and handles its activation. */
  onRetry?: () => void;
  /** Receives engine loading or rendering failures; the chart also displays errorLabel. */
  onRenderError?: (error: unknown) => void;
  /** Loading status text; defaults to "Loading chart…". */
  loadingLabel?: string;
  /** Empty-state text; defaults to "No data for this selection". */
  emptyLabel?: string;
  /** Application or engine error text; defaults to "Unable to display this chart". */
  errorLabel?: string;
  /** Retry button text; defaults to "Retry". */
  retryLabel?: string;
  /** Exact-table disclosure text; defaults to "View data table". */
  dataTableLabel?: string;
  /** Text for null table values; defaults to "Unavailable". */
  missingValueLabel?: string;
  /** Row selection button text; defaults to "Select row". The accessible name also includes the row label. */
  selectRowLabel?: string;
  /** Keyboard zoom-in button text; defaults to "Zoom in". */
  zoomInLabel?: string;
  /** Keyboard zoom-out button text; defaults to "Zoom out". */
  zoomOutLabel?: string;
  /** Keyboard reset button text; defaults to "Reset zoom". Resets to the full percentage range. */
  resetZoomLabel?: string;
};

/** Analytical charts with Easy UI presentation and an optional, lazy ECharts peer. */
export function Chart({
  title,
  description,
  option,
  dataTable,
  height = 320,
  renderer = "svg",
  status = dataTable.rows.length ? "ready" : "empty",
  notice,
  actions,
  onSelect,
  onRowSelect,
  onRetry,
  onRenderError,
  loadingLabel = "Loading chart…",
  emptyLabel = "No data for this selection",
  errorLabel = "Unable to display this chart",
  retryLabel = "Retry",
  dataTableLabel = "View data table",
  missingValueLabel = "Unavailable",
  selectRowLabel = "Select row",
  zoomInLabel = "Zoom in",
  zoomOutLabel = "Zoom out",
  resetZoomLabel = "Reset zoom",
}: ChartProps) {
  const plotHeight = Math.max(160, height);
  return (
    <Card
      as="section"
      background="primary"
      aria-label={title}
      aria-busy={status === "loading"}
      padding="3"
    >
      <div className={styles.root}>
        <div className={styles.header}>
          <Text as="h2" variant="heading5">
            {title}
          </Text>
          {actions}
        </div>
        <div className={styles.description}>
          <Text color="neutral.600" variant="caption">
            {description}
          </Text>
        </div>
        {status === "ready" ? (
          <ChartPlot
            option={option}
            description={description}
            height={plotHeight}
            renderer={renderer}
            onSelect={onSelect}
            onRenderError={onRenderError}
            loadingLabel={loadingLabel}
            errorLabel={errorLabel}
            zoomLabels={[zoomInLabel, zoomOutLabel, resetZoomLabel]}
          />
        ) : (
          <div
            className={styles.status}
            style={{ minHeight: plotHeight }}
            role={status === "error" ? "alert" : "status"}
          >
            {status === "loading"
              ? loadingLabel
              : status === "empty"
                ? emptyLabel
                : errorLabel}
            {status === "error" && onRetry && (
              <button
                type="button"
                className={styles.control}
                onClick={onRetry}
              >
                {retryLabel}
              </button>
            )}
          </div>
        )}
        {notice && (
          <Text variant="caption" color="neutral.700">
            {notice}
          </Text>
        )}
        {status === "ready" && (
          <details>
            <summary className={styles.summary}>{dataTableLabel}</summary>
            <div
              className={styles.tableScroll}
              tabIndex={0}
              role="region"
              aria-label={`${title} — ${dataTableLabel}`}
            >
              <table className={styles.table}>
                <caption>{title}</caption>
                <thead>
                  <tr>
                    {dataTable.columns.map((label, index) => (
                      <th key={index} scope="col">
                        {label}
                      </th>
                    ))}
                    {onRowSelect && <th scope="col">{selectRowLabel}</th>}
                  </tr>
                </thead>
                <tbody>
                  {dataTable.rows.map((row) => (
                    <tr key={row.id}>
                      {row.values.map((value, index) => (
                        <td key={index}>
                          {value === null ? missingValueLabel : value}
                        </td>
                      ))}
                      {onRowSelect && (
                        <td>
                          <button
                            type="button"
                            className={styles.control}
                            onClick={() => onRowSelect(row.id)}
                            aria-label={`${selectRowLabel}: ${row.values[0] ?? row.id}`}
                          >
                            {selectRowLabel}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}
      </div>
    </Card>
  );
}

type PlotProps = Pick<
  ChartProps,
  "option" | "description" | "onSelect" | "onRenderError"
> & {
  height: number;
  renderer: "svg" | "canvas";
  loadingLabel: string;
  errorLabel: string;
  zoomLabels: string[];
};

function ChartPlot(props: PlotProps) {
  const {
    height,
    renderer,
    description,
    loadingLabel,
    errorLabel,
    zoomLabels,
  } = props;
  const container = useRef<HTMLDivElement>(null);
  const instance = useRef<ChartInstance | null>(null);
  const update = useRef<(() => void) | null>(null);
  const latest = useRef(props);
  latest.current = props;
  const theme = useTheme();
  const { resolvedColorScheme } = useColorScheme();
  const [state, setState] = useState("loading");

  useEffect(() => {
    const element = container.current!;
    let disposed = false;
    let observer: ResizeObserver | undefined;
    let previousOption: ChartOption | undefined;
    const motion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const scheme = window.matchMedia?.("(prefers-color-scheme: dark)");
    const fail = (error: unknown) => {
      if (!disposed) {
        setState("error");
        latest.current.onRenderError?.(error);
      }
    };
    const apply = () => {
      if (!instance.current || disposed) return;
      try {
        const option = themedOption(
          element,
          latest.current.option,
          !!motion?.matches,
        );
        // Replace stale configuration, carrying only unchanged interaction settings.
        instance.current.setOption(
          previousOption
            ? preserveInteractions(
                option,
                previousOption,
                instance.current.getOption() as ChartOption,
              )
            : option,
          { notMerge: true },
        );
        previousOption = option;
        setState("ready");
      } catch (error) {
        fail(error);
      }
    };
    const resize = () => {
      if (!disposed && element.clientWidth > 0) instance.current?.resize();
    };
    update.current = apply;
    setState("loading");
    loadChartEngine()
      .then((engine) => {
        if (disposed) return;
        instance.current = engine.init(element, undefined, { renderer });
        instance.current.on("click", (event) => {
          if (event.componentType === "series") {
            const {
              seriesId,
              seriesName,
              name,
              dataIndex,
              dataType,
              data,
              value,
            } = event;
            latest.current.onSelect?.({
              seriesId,
              seriesName,
              name,
              dataIndex,
              dataType,
              data,
              value,
            });
          }
        });
        apply();
        if (typeof ResizeObserver !== "undefined") {
          observer = new ResizeObserver(resize);
          observer.observe(element);
        }
        window.addEventListener("resize", resize);
        motion?.addEventListener("change", apply);
        scheme?.addEventListener("change", apply);
      })
      .catch(fail);
    return () => {
      disposed = true;
      update.current = null;
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      motion?.removeEventListener("change", apply);
      scheme?.removeEventListener("change", apply);
      instance.current?.dispose();
      instance.current = null;
    };
  }, [renderer, theme, resolvedColorScheme]);

  useEffect(() => {
    update.current?.();
  }, [props.option]);
  useEffect(() => {
    instance.current?.resize();
  }, [height]);

  const zoom = (factor: number) => {
    const current = instance.current;
    if (!current) return;
    const ranges = current.getOption().dataZoom as
      | { start?: number; end?: number }[]
      | undefined;
    const { start = 0, end = 100 } = ranges?.[0] ?? {};
    const size = Math.min(100, Math.max(1, (end - start) * factor));
    const nextStart =
      factor === 0
        ? 0
        : Math.max(0, Math.min(100 - size, (start + end - size) / 2));
    current.dispatchAction({
      type: "dataZoom",
      start: nextStart,
      end: factor === 0 ? 100 : nextStart + size,
    });
  };

  return (
    <>
      {state !== "ready" && (
        <div role={state === "error" ? "alert" : "status"}>
          {state === "error" ? errorLabel : loadingLabel}
        </div>
      )}
      <div
        role={state === "ready" ? "img" : undefined}
        aria-label={description}
        data-chart-state={state}
      >
        <div
          ref={container}
          className={styles.plot}
          style={{
            height,
            visibility: state === "ready" ? "visible" : "hidden",
          }}
          aria-hidden="true"
        />
      </div>
      {state === "ready" && props.option.dataZoom && (
        <div
          className={styles.controls}
          role="group"
          aria-label={zoomLabels.join(" / ")}
        >
          {[0.5, 2, 0].map((factor, index) => (
            <button
              type="button"
              className={styles.control}
              key={factor}
              onClick={() => zoom(factor)}
            >
              {zoomLabels[index]}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
