type MapEngine = Pick<
  typeof import("maplibre-gl"),
  "Map" | "Marker" | "NavigationControl" | "ScaleControl" | "setWorkerUrl"
>;
export function loadMapEngine(): Promise<MapEngine> {
  return import("maplibre-gl");
}
