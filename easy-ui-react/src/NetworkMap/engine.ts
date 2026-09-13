type MapEngine = Pick<
  typeof import("maplibre-gl"),
  "Map" | "Marker" | "NavigationControl" | "ScaleControl"
>;
export function loadMapEngine(): Promise<MapEngine> {
  return import("maplibre-gl");
}
