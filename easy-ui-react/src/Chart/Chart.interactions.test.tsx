import React from "react";
import { act, screen } from "@testing-library/react";
import { init, setPlatformAPI } from "echarts";
import { render } from "../utilities/test";
import { ThemeProvider } from "../Theme";
import { Chart } from "./Chart";
import { loadChartEngine } from "./engine";
import type { ChartOption } from "./types";

vi.mock("./engine", () => ({ loadChartEngine: vi.fn() }));

it("retains zoom and legend choices across refreshes while replacing stale series and honoring changed settings", async () => {
  setPlatformAPI({ measureText: (text) => ({ width: text.length * 7 }) });
  const engine = init(null, undefined, {
    renderer: "svg",
    ssr: true,
    width: 720,
    height: 360,
  });
  vi.mocked(loadChartEngine).mockResolvedValue({
    init: () => engine,
  } as unknown as Awaited<ReturnType<typeof loadChartEngine>>);
  const option: ChartOption = {
    animation: false,
    xAxis: { type: "value", min: 0, max: 100 },
    yAxis: { type: "value" },
    legend: { id: "services" },
    dataZoom: [{ id: "time", type: "inside", start: 0, end: 100 }],
    series: [
      {
        id: "a",
        name: "A",
        type: "line",
        data: [
          [0, 1],
          [100, 2],
        ],
        markLine: { data: [{ yAxis: 1 }] },
      },
      {
        id: "b",
        name: "B",
        type: "line",
        data: [
          [0, 2],
          [100, 3],
        ],
      },
    ],
  };
  const view = (option: ChartOption) => (
    <ThemeProvider>
      <Chart
        title="Refresh"
        description="Observed values"
        option={option}
        dataTable={{ columns: ["Value"], rows: [{ id: "a", values: [1] }] }}
      />
    </ThemeProvider>
  );
  const { rerender, unmount } = render(view(option));
  try {
    await screen.findByRole("img", { name: "Observed values" });
    act(() => {
      engine.dispatchAction({ type: "dataZoom", start: 25, end: 75 });
      engine.dispatchAction({ type: "legendUnSelect", name: "A" });
    });
    const refreshed: ChartOption = {
      ...option,
      series: [
        {
          id: "a",
          name: "A",
          type: "line",
          data: [
            [0, 3],
            [100, 4],
          ],
        },
      ],
    };
    rerender(view(refreshed));
    const current = engine.getOption() as {
      dataZoom: {
        start: number;
        end: number;
        startValue: number;
        endValue: number;
      }[];
      legend: { selected: Record<string, boolean> }[];
      series: { id: string; markLine?: { data?: unknown[] } }[];
    };
    expect([current.dataZoom[0].start, current.dataZoom[0].end]).toEqual([
      25, 75,
    ]);
    expect(current.legend[0].selected.A).toBe(false);
    expect(current.series.map((series) => series.id)).toEqual(["a"]);
    expect(current.series[0].markLine?.data ?? []).toEqual([]);

    const controlled: ChartOption = {
      ...refreshed,
      dataZoom: [{ id: "time", type: "inside", start: 0, end: 50 }],
      legend: { id: "services", selected: { A: true } },
    };
    rerender(view(controlled));
    expect(
      (engine.getOption().dataZoom as typeof current.dataZoom)[0].end,
    ).toBe(50);
    expect(
      (engine.getOption().legend as typeof current.legend)[0].selected.A,
    ).toBe(true);

    const valueWindow: ChartOption = {
      ...controlled,
      dataZoom: [{ id: "time", type: "inside", startValue: 10, endValue: 20 }],
    };
    rerender(view(valueWindow));
    rerender(
      view({ ...valueWindow, xAxis: { type: "value", min: 0, max: 200 } }),
    );
    const zoom = (engine.getOption().dataZoom as typeof current.dataZoom)[0];
    expect([zoom.startValue, zoom.endValue]).toEqual([10, 20]);
    rerender(view({ ...refreshed, dataZoom: [] }));
    expect(engine.getOption().dataZoom).toEqual([]);
  } finally {
    unmount();
  }
});
