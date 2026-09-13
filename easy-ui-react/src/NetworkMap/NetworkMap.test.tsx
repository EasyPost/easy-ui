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
class FakeMap {
  constructor() {
    constructor();
  }
  on(name: string, fn: () => void) {
    listeners[name] = fn;
  }
  addControl() {}
  addSource(id: string) {
    sources.add(id);
  }
  addLayer() {}
  addImage() {}
  getSource(id: string) {
    return sources.has(id) ? { setData } : undefined;
  }
  setPaintProperty() {}
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
