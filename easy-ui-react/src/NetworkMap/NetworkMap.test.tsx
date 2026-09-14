import React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { NetworkMap } from "./NetworkMap";
import { loadMapEngine } from "./engine";
import type { NetworkMapProps } from "./types";
vi.mock("./engine", () => ({ loadMapEngine: vi.fn() }));
const fitBounds = vi.fn(),
  remove = vi.fn(),
  setData = vi.fn();
const listeners: Record<string, () => void> = {};
const sources = new Set<string>();
const constructor = vi.fn();
const layerPaint = new Map<string, unknown>();
// Records addLayer/addSource/setPaintProperty call order (by id) so tests can assert a
// consumer-visible callback (e.g. onMapReady) fires only after this component's own layer setup.
let callOrder: string[] = [];
const setPaintProperty = vi.fn((id: string, _prop: string, value: unknown) => {
  layerPaint.set(id, value);
  callOrder.push(`setPaintProperty:${id}`);
});
class FakeMap {
  constructor() {
    // Passing `this` lets tests recover the exact instance the component received, e.g. to
    // assert onMapReady was called with that same live map object.
    constructor(this);
  }
  on(name: string, fn: () => void) {
    listeners[name] = fn;
  }
  addControl() {}
  addSource(id: string) {
    sources.add(id);
    callOrder.push(`addSource:${id}`);
  }
  addLayer(layer: { id: string; paint?: { "line-color"?: unknown } }) {
    if (layer.paint && "line-color" in layer.paint)
      layerPaint.set(layer.id, layer.paint["line-color"]);
    callOrder.push(`addLayer:${layer.id}`);
  }
  addImage() {}
  getSource(id: string) {
    return sources.has(id) ? { setData } : undefined;
  }
  setPaintProperty = setPaintProperty;
  setLayoutProperty() {}
  getZoom() {
    return 9;
  }
  project() {
    return { x: 200, y: 100 };
  }
  resize() {}
  fitBounds = fitBounds;
  remove = remove;
}
class FakeMarker {
  el: HTMLElement;
  constructor({ element }: { element: HTMLElement }) {
    this.el = element;
    this.el.classList.add("maplibregl-marker");
  }
  setLngLat() {
    return this;
  }
  addTo() {
    document.querySelector("[data-map-state] > div")!.append(this.el);
    return this;
  }
  remove() {
    this.el.remove();
  }
}
const engine = {
  setWorkerUrl: vi.fn(),
  Map: FakeMap,
  Marker: FakeMarker,
  NavigationControl: class {},
  ScaleControl: class {},
} as unknown as Awaited<ReturnType<typeof loadMapEngine>>;
const props: NetworkMapProps = {
  title: "Network",
  description: "Observed handoffs",
  mapStyle: { version: 8, sources: {}, layers: [] },
  workerUrl: "/map-worker.js",
  facilities: [
    { id: "one", label: "Oakland", coordinates: [-122, 38], kind: "warehouse" },
  ],
  segments: [],
  onFacilitySelect: vi.fn(),
};
beforeEach(() => {
  vi.clearAllMocks();
  sources.clear();
  layerPaint.clear();
  callOrder = [];
  for (const key of Object.keys(listeners)) delete listeners[key];
  vi.mocked(loadMapEngine).mockResolvedValue(engine);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => vi.unstubAllGlobals());
it("preserves camera and focused markers when observations or selection update, and cleans up", async () => {
  const view = render(<NetworkMap {...props} />);
  await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
  act(() => listeners.load());
  expect(fitBounds).toHaveBeenCalledTimes(1);
  const marker = screen.getByRole("button", { name: "Select Oakland" });
  marker.focus();
  view.rerender(
    <NetworkMap
      {...props}
      selectedFacilityId="one"
      facilities={[{ ...props.facilities[0], detail: "New scan" }]}
    />,
  );
  expect(constructor).toHaveBeenCalledTimes(1);
  expect(fitBounds).toHaveBeenCalledTimes(1);
  expect(document.activeElement).toBe(marker);
  expect(marker).toHaveClass("maplibregl-marker");
  expect(marker).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(marker);
  expect(props.onFacilitySelect).toHaveBeenCalledWith("one");
  view.unmount();
  expect(remove).toHaveBeenCalledTimes(1);
});
it("keeps data available after an engine failure and retries explicitly", async () => {
  vi.mocked(loadMapEngine).mockRejectedValueOnce(
    new Error("WebGL unavailable"),
  );
  const onRenderError = vi.fn();
  render(<NetworkMap {...props} onRenderError={onRenderError} />);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to display the map",
  );
  expect(screen.getByText("Oakland")).toBeInTheDocument();
  expect(onRenderError).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Retry map" }));
  await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
  act(() => listeners.load());
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
it("does not create a map when unmounted before its lazy engine resolves", async () => {
  let resolve!: (value: typeof engine) => void;
  vi.mocked(loadMapEngine).mockReturnValue(
    new Promise((r) => {
      resolve = r;
    }),
  );
  const view = render(<NetworkMap {...props} />);
  view.unmount();
  await act(async () => resolve(engine));
  expect(constructor).not.toHaveBeenCalled();
});

it("exposes stalled worker/style initialization instead of loading indefinitely", async () => {
  vi.useFakeTimers();
  try {
    render(<NetworkMap {...props} />);
    await act(async () => {
      await Promise.resolve();
    });
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to display the map",
    );
    expect(screen.getByText("Oakland")).toBeInTheDocument();
  } finally {
    vi.useRealTimers();
  }
});

it("prefers a caller-supplied per-segment color and falls back to the evidence scheme otherwise", async () => {
  const segmentProps: NetworkMapProps = {
    ...props,
    facilities: [
      ...props.facilities,
      { id: "two", label: "Reno", coordinates: [-119, 39], kind: "hub" },
    ],
    segments: [
      {
        id: "colored",
        from: "one",
        to: "two",
        label: "Oakland to Reno",
        evidence: "transfer",
        color: "#00ff00",
      },
    ],
  };
  render(<NetworkMap {...segmentProps} />);
  await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
  act(() => listeners.load());
  // The observed layer's blue resolves from --map-route, a design-token() reference in
  // NetworkMap.module.scss; the unobserved layer's amber is a plain hex literal there.
  expect(layerPaint.get("easy-ui-observed")).toEqual([
    "coalesce",
    ["get", "color"],
    "var(--ezui-color-primary-600)",
  ]);
  expect(layerPaint.get("easy-ui-unobserved")).toEqual([
    "coalesce",
    ["get", "color"],
    "#9b5900",
  ]);
});

it("calls onMapReady exactly once, with the live map instance, only after the component's own layer setup", async () => {
  const onMapReady = vi.fn(() => callOrder.push("onMapReady"));
  const view = render(<NetworkMap {...props} onMapReady={onMapReady} />);
  await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
  const instance = constructor.mock.calls[0][0];
  act(() => listeners.load());

  expect(onMapReady).toHaveBeenCalledTimes(1);
  expect(onMapReady).toHaveBeenCalledWith(instance);

  const readyIndex = callOrder.indexOf("onMapReady");
  expect(readyIndex).toBeGreaterThan(0);
  const before = callOrder.slice(0, readyIndex);
  // The component's own sources/layers must already exist...
  expect(before).toEqual(
    expect.arrayContaining([
      "addSource:easy-ui-transfers",
      "addSource:easy-ui-weather",
      "addLayer:easy-ui-weather-fill",
      "addLayer:easy-ui-weather-edge",
      "addLayer:easy-ui-casing",
      "addLayer:easy-ui-observed",
      "addLayer:easy-ui-unobserved",
      "addLayer:easy-ui-direction",
    ]),
  );
  // ...AND its own first paint-property pass (from the initial update()) must already have run,
  // not just layer creation — otherwise a consumer's own setPaintProperty override could still
  // be clobbered by the component's own baseline call.
  expect(before).toContain("setPaintProperty:easy-ui-observed");

  // A later data/selection update must not re-fire onMapReady — the callback is mount-scoped,
  // not tied to this component's ongoing refresh effect.
  view.rerender(
    <NetworkMap {...props} onMapReady={onMapReady} selectedFacilityId="one" />,
  );
  expect(onMapReady).toHaveBeenCalledTimes(1);
  expect(callOrder.filter((c) => c === "onMapReady")).toHaveLength(1);
});
