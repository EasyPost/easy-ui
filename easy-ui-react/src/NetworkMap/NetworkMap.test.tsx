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
import { surfaceData } from "./geometry";
import type { NetworkMapProps } from "./types";
vi.mock("./engine", () => ({ loadMapEngine: vi.fn() }));
const fitBounds = vi.fn(),
  easeTo = vi.fn(),
  remove = vi.fn(),
  setData = vi.fn(),
  getClusterExpansionZoom = vi.fn().mockResolvedValue(9);
const listeners: Record<string, (...args: any[]) => void> = {};
const sources = new Set<string>();
// Full addSource() definitions, keyed by id, so tests can assert cluster/clusterMaxZoom/clusterRadius.
const sourceDefs = new Map<string, Record<string, unknown>>();
// Full addLayer() definitions, keyed by id, so tests can assert data-driven paint expressions
// beyond just line-color (see layerPaint below, which only tracks that one property).
const layerDefs = new Map<string, Record<string, unknown>>();
const constructor = vi.fn();
const layerPaint = new Map<string, unknown>();
// Records addLayer/addSource/setPaintProperty/setLayoutProperty call order (by id) so tests can
// assert a consumer-visible callback (e.g. onMapReady) fires only after this component's own
// layer setup, and that a visibility toggle actually reaches the map.
let callOrder: string[] = [];
const setPaintProperty = vi.fn((id: string, _prop: string, value: unknown) => {
  layerPaint.set(id, value);
  callOrder.push(`setPaintProperty:${id}`);
});
const setLayoutProperty = vi.fn((id: string, _prop: string, value: unknown) => {
  callOrder.push(`setLayoutProperty:${id}:${value}`);
});
// Test-controlled stand-in for MapLibre's own clustering computation (normally done by the
// bundled supercluster library against loaded tiles) — set per test to whatever
// querySourceFeatures should currently report.
let sourceFeatures: {
  properties?: Record<string, unknown>;
  geometry: { type: "Point"; coordinates: [number, number] };
}[] = [];
function matchesFilter(
  feature: (typeof sourceFeatures)[number],
  filter: unknown,
): boolean {
  if (!filter) return true;
  const [op, arg] = filter as [string, unknown];
  if (op === "has")
    return arg === "point_count" && "point_count" in (feature.properties ?? {});
  if (op === "!") return !matchesFilter(feature, arg);
  return true;
}
class FakeMap {
  constructor() {
    // Passing `this` lets tests recover the exact instance the component received, e.g. to
    // assert onMapReady was called with that same live map object.
    constructor(this);
  }
  on(
    type: string,
    layerOrListener: string | ((...args: any[]) => void),
    listener?: (...args: any[]) => void,
  ) {
    if (typeof layerOrListener === "string")
      listeners[`${type}:${layerOrListener}`] = listener!;
    else listeners[type] = layerOrListener;
  }
  addControl() {}
  addSource(id: string, definition: Record<string, unknown>) {
    sources.add(id);
    sourceDefs.set(id, definition);
    callOrder.push(`addSource:${id}`);
  }
  addLayer(layer: { id: string; paint?: { "line-color"?: unknown } }) {
    if (layer.paint && "line-color" in layer.paint)
      layerPaint.set(layer.id, layer.paint["line-color"]);
    layerDefs.set(layer.id, layer);
    callOrder.push(`addLayer:${layer.id}`);
  }
  addImage() {}
  getSource(id: string) {
    return sources.has(id) ? { setData, getClusterExpansionZoom } : undefined;
  }
  querySourceFeatures(_id: string, params?: { filter?: unknown }) {
    return sourceFeatures.filter((f) => matchesFilter(f, params?.filter));
  }
  isSourceLoaded() {
    return true;
  }
  getCanvas() {
    return { style: {} as CSSStyleDeclaration };
  }
  setPaintProperty = setPaintProperty;
  setLayoutProperty = setLayoutProperty;
  getZoom() {
    return 9;
  }
  project() {
    return { x: 200, y: 100 };
  }
  resize() {}
  fitBounds = fitBounds;
  easeTo = easeTo;
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
  sourceDefs.clear();
  layerDefs.clear();
  sourceFeatures = [];
  layerPaint.clear();
  callOrder = [];
  for (const key of Object.keys(listeners)) delete listeners[key];
  getClusterExpansionZoom.mockResolvedValue(9);
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

describe("clusterFacilities", () => {
  const clusterProps: NetworkMapProps = {
    ...props,
    facilities: [
      {
        id: "one",
        label: "Oakland",
        coordinates: [-122, 38],
        kind: "warehouse",
      },
      { id: "two", label: "Newark", coordinates: [-74.15, 40.72], kind: "hub" },
    ],
  };

  it("is fully backward compatible: omitting it never adds a clustering source or layer", async () => {
    render(<NetworkMap {...clusterProps} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    expect(sources.has("easy-ui-facility-clusters")).toBe(false);
    expect(callOrder.some((c) => c.includes("facility-cluster"))).toBe(false);
    // Every facility still renders as its own interactive Marker, exactly as before.
    expect(
      screen.getByRole("button", { name: "Select Oakland" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Select Newark" }),
    ).toBeInTheDocument();
  });

  it("adds a clustered GeoJSON source and cluster layers, configured from the given options", async () => {
    render(
      <NetworkMap
        {...clusterProps}
        clusterFacilities={{ radius: 40, maxZoom: 10 }}
      />,
    );
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    expect(sourceDefs.get("easy-ui-facility-clusters")).toMatchObject({
      type: "geojson",
      cluster: true,
      clusterMaxZoom: 10,
      clusterRadius: 40,
    });
    expect(callOrder).toContain("addLayer:easy-ui-facility-cluster-circles");
    expect(callOrder).toContain("addLayer:easy-ui-facility-cluster-count");
  });

  it("defaults maxZoom/radius when the options object is empty", async () => {
    render(<NetworkMap {...clusterProps} clusterFacilities={{}} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    expect(sourceDefs.get("easy-ui-facility-clusters")).toMatchObject({
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });
  });

  it("does not render an individual Marker for a facility MapLibre currently reports as clustered", async () => {
    // Both facilities are merged into one cluster point — querySourceFeatures reports zero
    // unclustered leaves, mirroring what a real, not-yet-declustered zoom level would report.
    sourceFeatures = [
      {
        properties: { cluster: true, cluster_id: 7, point_count: 2 },
        geometry: { type: "Point", coordinates: [-100, 39] },
      },
    ];
    render(<NetworkMap {...clusterProps} clusterFacilities={{}} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    expect(
      screen.queryByRole("button", { name: "Select Oakland" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Select Newark" }),
    ).not.toBeInTheDocument();
  });

  it("renders a full, interactive Marker for a facility MapLibre reports as not clustered", async () => {
    // Oakland is reported as an unclustered leaf (its own feature, no point_count); Newark is
    // still merged into a cluster — only Oakland should get a real Marker.
    sourceFeatures = [
      {
        properties: { id: "one" },
        geometry: { type: "Point", coordinates: [-122, 38] },
      },
      {
        properties: { cluster: true, cluster_id: 3, point_count: 6 },
        geometry: { type: "Point", coordinates: [-90, 39] },
      },
    ];
    render(<NetworkMap {...clusterProps} clusterFacilities={{}} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    const marker = screen.getByRole("button", { name: "Select Oakland" });
    expect(marker).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.queryByRole("button", { name: "Select Newark" }),
    ).not.toBeInTheDocument();
  });

  it("resyncs which facilities are clustered once MapLibre finishes (re-)tiling the source", async () => {
    // Nothing is unclustered yet (tiles not loaded) at the moment update() first runs.
    sourceFeatures = [];
    render(<NetworkMap {...clusterProps} clusterFacilities={{}} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    expect(
      screen.queryByRole("button", { name: "Select Oakland" }),
    ).not.toBeInTheDocument();

    // MapLibre finishes tiling and now reports Oakland as an unclustered leaf.
    sourceFeatures = [
      {
        properties: { id: "one" },
        geometry: { type: "Point", coordinates: [-122, 38] },
      },
    ];
    act(() =>
      listeners["sourcedata"]({ sourceId: "easy-ui-facility-clusters" }),
    );
    expect(
      screen.getByRole("button", { name: "Select Oakland" }),
    ).toBeInTheDocument();
  });

  it("flies to a cluster's expansion zoom when the cluster circle is clicked", async () => {
    render(<NetworkMap {...clusterProps} clusterFacilities={{}} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    getClusterExpansionZoom.mockResolvedValueOnce(9);

    await act(async () => {
      listeners["click:easy-ui-facility-cluster-circles"]({
        features: [
          {
            properties: { cluster_id: 7 },
            geometry: { type: "Point", coordinates: [-100, 39] },
          },
        ],
      });
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(getClusterExpansionZoom).toHaveBeenCalledWith(7);
    expect(easeTo).toHaveBeenCalledWith({ center: [-100, 39], zoom: 9 });
  });
});

describe("delivery surface", () => {
  const surfaceProps: NetworkMapProps = {
    ...props,
    surface: {
      asOf: "2026-09-01T00:00:00Z",
      source: "spatial-prior-v1",
      cells: [
        {
          latMin: 37,
          latMax: 37.01,
          lonMin: -122,
          lonMax: -121.99,
          medianMinutes: 45,
          iqrMinutes: 10,
          n: 12,
        },
      ],
    },
  };

  it("adds a delivery-time surface geojson source built from surfaceData()", async () => {
    render(<NetworkMap {...surfaceProps} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    expect(sourceDefs.get("easy-ui-delivery-surface")).toEqual({
      type: "geojson",
      data: surfaceData(surfaceProps.surface!.cells),
    });
  });

  it("adds a fill layer with data-driven fill-color/fill-opacity paint expressions", async () => {
    render(<NetworkMap {...surfaceProps} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    const layer = layerDefs.get("easy-ui-delivery-surface-fill");
    expect(layer?.type).toBe("fill");
    expect(layer?.source).toBe("easy-ui-delivery-surface");
    const paint = layer?.paint as Record<string, unknown>;
    // Both must be real expressions (arrays), not fixed literals, driven by the correct
    // per-feature property (surfaceData() puts median delivery time in `medianMinutes` and
    // normalized observation count in `confidence`).
    expect(Array.isArray(paint["fill-color"])).toBe(true);
    expect(Array.isArray(paint["fill-opacity"])).toBe(true);
    expect(JSON.stringify(paint["fill-color"])).toContain("medianMinutes");
    expect(JSON.stringify(paint["fill-opacity"])).toContain("confidence");
  });

  it("keeps the delivery surface layer hidden until toggled, mirroring the weather toggle", async () => {
    render(<NetworkMap {...surfaceProps} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    expect(setLayoutProperty).toHaveBeenCalledWith(
      "easy-ui-delivery-surface-fill",
      "visibility",
      "none",
    );
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Delivery time surface" }),
    );
    expect(setLayoutProperty).toHaveBeenCalledWith(
      "easy-ui-delivery-surface-fill",
      "visibility",
      "visible",
    );
  });

  it("disables the delivery surface toggle when no surface data is supplied", async () => {
    render(<NetworkMap {...props} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    expect(
      screen.getByRole("checkbox", { name: "Delivery time surface" }),
    ).toBeDisabled();
  });

  it("refreshes the delivery surface source when surface data changes", async () => {
    const view = render(<NetworkMap {...surfaceProps} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    setData.mockClear();
    const newCells = [
      { ...surfaceProps.surface!.cells[0], medianMinutes: 90 },
    ];
    view.rerender(
      <NetworkMap
        {...surfaceProps}
        surface={{ ...surfaceProps.surface!, cells: newCells }}
      />,
    );
    expect(setData).toHaveBeenCalledWith(surfaceData(newCells));
  });

  it("starts the surface layer visible immediately when initialDeliverySurfaceVisible is true, with no toggle click", async () => {
    render(
      <NetworkMap {...surfaceProps} initialDeliverySurfaceVisible />,
    );
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    expect(setLayoutProperty).toHaveBeenCalledWith(
      "easy-ui-delivery-surface-fill",
      "visibility",
      "visible",
    );
    expect(
      screen.getByRole("checkbox", { name: "Delivery time surface" }),
    ).toBeChecked();
  });

  it("still starts the surface layer hidden when initialDeliverySurfaceVisible is omitted, preserving current behavior", async () => {
    render(<NetworkMap {...surfaceProps} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    expect(
      screen.getByRole("checkbox", { name: "Delivery time surface" }),
    ).not.toBeChecked();
  });
});

describe("networkControls", () => {
  const surfaceOnlyProps: NetworkMapProps = {
    ...props,
    facilities: [],
    surface: {
      asOf: "2026-09-01T00:00:00Z",
      source: "spatial-prior-v1",
      cells: [
        {
          latMin: 37,
          latMax: 37.01,
          lonMin: -122,
          lonMax: -121.99,
          medianMinutes: 45,
          iqrMinutes: 10,
          n: 12,
        },
      ],
    },
  };

  it("hides the facility/segment toolbar controls when explicitly false, leaving Weather/Delivery time surface untouched", async () => {
    render(<NetworkMap {...surfaceOnlyProps} networkControls={false} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    expect(
      screen.queryByRole("button", { name: "Fit all locations" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Entire journey" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Selected leg" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Latest events" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "Facility risk" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Weather" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Delivery time surface" }),
    ).toBeInTheDocument();
  });

  it("shows every control by default when omitted, preserving current behavior", async () => {
    render(<NetworkMap {...props} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    expect(
      screen.getByRole("button", { name: "Fit all locations" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Facility risk" }),
    ).toBeInTheDocument();
  });
});

describe("focus with bounds", () => {
  const boundsFocusProps: NetworkMapProps = {
    ...props,
    facilities: [
      { id: "one", label: "Oakland", coordinates: [-122, 38], kind: "warehouse" },
    ],
    focus: {
      revision: 1,
      facilityIds: ["one"],
      bounds: { minLat: 29.5, maxLat: 30.5, minLon: -95.9, maxLon: -95.0 },
      maxZoom: 10,
    },
  };

  it("fits the camera to the given bounds instead of facilityIds when both are present", async () => {
    render(<NetworkMap {...boundsFocusProps} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    expect(fitBounds).toHaveBeenCalledWith(
      [
        [-95.9, 29.5],
        [-95.0, 30.5],
      ],
      expect.objectContaining({ maxZoom: 10 }),
    );
  });

  it("re-fires the bounds fit when focus.revision changes, even with the same facilityIds", async () => {
    const view = render(<NetworkMap {...boundsFocusProps} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    fitBounds.mockClear();
    view.rerender(
      <NetworkMap
        {...boundsFocusProps}
        focus={{ ...boundsFocusProps.focus!, revision: 2 }}
      />,
    );
    expect(fitBounds).toHaveBeenCalledTimes(1);
  });

  it("falls back to fitting facilityIds when focus has no bounds, unchanged from today", async () => {
    const idsOnlyFocus: NetworkMapProps = {
      ...boundsFocusProps,
      focus: { revision: 1, facilityIds: ["one"], maxZoom: 10 },
    };
    render(<NetworkMap {...idsOnlyFocus} />);
    await waitFor(() => expect(constructor).toHaveBeenCalledTimes(1));
    act(() => listeners.load());
    expect(fitBounds).toHaveBeenCalledWith(
      [
        [-122, 38],
        [-122, 38],
      ],
      expect.objectContaining({ maxZoom: 10 }),
    );
  });
});
