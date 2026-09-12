import React from "react";
import userEvent from "@testing-library/user-event";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { render, mockMatchMedia } from "../utilities/test";
import { ThemeProvider } from "../Theme";
import { Chart, ChartProps } from "./Chart";
import { loadChartEngine } from "./engine";

vi.mock("./engine", () => ({ loadChartEngine: vi.fn() }));
const setOption = vi.fn();
const resize = vi.fn();
const dispose = vi.fn();
const on = vi.fn();
const dispatchAction = vi.fn();
const init = vi.fn(() => ({
  setOption,
  resize,
  dispose,
  on,
  dispatchAction,
  getOption: () => ({ dataZoom: [{ start: 0, end: 100 }] }),
}));
const engine = { init } as unknown as Awaited<
  ReturnType<typeof loadChartEngine>
>;
const fixture: ChartProps = {
  title: "Shipments",
  description: "Daily parcel counts in UTC",
  option: {
    xAxis: { type: "category", data: ["Monday"] },
    yAxis: { type: "value" },
    series: [{ id: "volume", name: "Volume", type: "bar", data: [0] }],
  },
  dataTable: {
    columns: ["Day", "Parcels"],
    rows: [
      { id: "monday", values: ["Monday", 0] },
      { id: "tuesday", values: ["Tuesday", null] },
    ],
  },
};
const view = (props: Partial<ChartProps> = {}) => (
  <ThemeProvider colorScheme="light">
    <Chart {...fixture} {...props} />
  </ThemeProvider>
);

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(loadChartEngine).mockResolvedValue(engine);
});

it("loads the engine lazily and replaces removed series on data updates", async () => {
  const { rerender } = render(view());
  await screen.findByRole("img", { name: fixture.description });
  expect(init).toHaveBeenCalledTimes(1);
  const option = { ...fixture.option, series: [] };
  rerender(view({ option }));
  expect(setOption).toHaveBeenLastCalledWith(
    expect.objectContaining({ series: [] }),
    { notMerge: true },
  );
  expect(init).toHaveBeenCalledTimes(1);
});

it("provides keyboard-accessible exact values, missing data, and stable row selection", async () => {
  const onRowSelect = vi.fn();
  const user = userEvent.setup();
  render(view({ onRowSelect }));
  await user.click(screen.getByText("View data table"));
  expect(screen.getByRole("cell", { name: "0" })).toBeInTheDocument();
  expect(screen.getByRole("cell", { name: "Unavailable" })).toBeInTheDocument();
  screen.getByRole("button", { name: "Select row: Monday" }).focus();
  await user.keyboard("{Enter}");
  expect(onRowSelect).toHaveBeenCalledWith("monday");
});

it.each(["loading", "empty", "error"] as const)(
  "suppresses the engine and stale values for %s",
  (status) => {
    render(view({ status }));
    expect(loadChartEngine).not.toHaveBeenCalled();
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.queryByText("Monday")).toBeNull();
    expect(screen.getByRole("region", { name: "Shipments" })).toHaveAttribute(
      "aria-busy",
      String(status === "loading"),
    );
  },
);

it("exposes the application's retry and localized status", () => {
  const onRetry = vi.fn();
  render(
    view({
      status: "error",
      errorLabel: "Datos no disponibles",
      retryLabel: "Reintentar",
      onRetry,
    }),
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Datos no disponibles");
  fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
  expect(onRetry).toHaveBeenCalledOnce();
});

it("does not initialize after unmount when the import is still pending", async () => {
  let resolve!: (value: typeof engine) => void;
  vi.mocked(loadChartEngine).mockReturnValueOnce(
    new Promise((done) => {
      resolve = done;
    }),
  );
  const { unmount } = render(view());
  unmount();
  await act(async () => {
    resolve(engine);
  });
  expect(init).not.toHaveBeenCalled();
});

it("disposes the renderer and resize observer on unmount", async () => {
  const disconnect = vi.fn();
  const observe = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = observe;
      disconnect = disconnect;
    },
  );
  try {
    const { unmount } = render(view());
    await screen.findByRole("img");
    expect(observe).toHaveBeenCalledOnce();
    unmount();
    expect(dispose).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalledOnce();
  } finally {
    vi.unstubAllGlobals();
  }
});

it("reports an engine load failure without presenting a stale plot", async () => {
  const error = new Error("Optional peer missing");
  vi.mocked(loadChartEngine).mockRejectedValueOnce(error);
  const onRenderError = vi.fn();
  render(view({ onRenderError }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to display this chart",
  );
  expect(screen.queryByRole("img")).toBeNull();
  expect(onRenderError).toHaveBeenCalledWith(error);
});

it("recovers from invalid options when the application supplies corrected data", async () => {
  setOption.mockImplementationOnce(() => {
    throw new Error("Invalid data");
  });
  const { rerender } = render(view());
  await screen.findByRole("alert");
  rerender(view({ option: { ...fixture.option } }));
  await screen.findByRole("img");
});

it("uses the latest selection callback with series and datum information", async () => {
  const original = vi.fn();
  const updated = vi.fn();
  const { rerender } = render(view({ onSelect: original }));
  await screen.findByRole("img");
  rerender(view({ onSelect: updated }));
  const handler = on.mock.calls.find(([event]) => event === "click")![1];
  const selection = {
    seriesId: "volume",
    seriesName: "Volume",
    name: "Monday",
    dataIndex: 0,
    dataType: undefined,
    data: 0,
    value: 0,
  };
  handler({ componentType: "series", ...selection });
  handler({ componentType: "legend" });
  expect(updated).toHaveBeenCalledExactlyOnceWith(selection);
  expect(original).not.toHaveBeenCalled();
});

it("supports keyboard zoom controls and respects reduced motion", async () => {
  const restore = mockMatchMedia({
    getMatches: (query) => query.includes("reduced-motion"),
  });
  try {
    const user = userEvent.setup();
    render(
      view({
        option: {
          ...fixture.option,
          animation: true,
          dataZoom: [{ type: "slider" }],
        },
      }),
    );
    await screen.findByRole("img");
    expect(
      setOption.mock.calls[setOption.mock.calls.length - 1][0].animation,
    ).toBe(false);
    screen.getByRole("button", { name: "Zoom in" }).focus();
    await user.keyboard("{Enter}");
    expect(dispatchAction).toHaveBeenLastCalledWith({
      type: "dataZoom",
      start: 25,
      end: 75,
    });
    await user.click(screen.getByRole("button", { name: "Reset zoom" }));
    expect(dispatchAction).toHaveBeenLastCalledWith({
      type: "dataZoom",
      start: 0,
      end: 100,
    });
  } finally {
    restore();
  }
});

it("recreates the renderer when the surrounding color scheme changes", async () => {
  const { rerender } = render(view());
  await screen.findByRole("img");
  rerender(
    <ThemeProvider colorScheme="dark">
      <Chart {...fixture} />
    </ThemeProvider>,
  );
  await waitFor(() => expect(init).toHaveBeenCalledTimes(2));
  expect(dispose).toHaveBeenCalledOnce();
});
