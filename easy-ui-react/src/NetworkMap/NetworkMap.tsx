import React, { useEffect, useRef, useState } from "react";
import type { GeoJSONSource, Map as MapInstance, Marker } from "maplibre-gl";
import { loadMapEngine } from "./engine";
import {
  areaData,
  geographicBounds,
  placeLabels,
  segmentData,
  validCoordinate,
} from "./geometry";
import type { MapFacility, NetworkMapProps } from "./types";
import styles from "./NetworkMap.module.scss";

const percentage = (p: number | null) =>
  p === null ? "Unavailable" : `${Math.round(p * 100)}%`;

/** Optional geographic surface with explicit camera requests and equivalent location data.
 * Import MapLibre's stylesheet in the consuming application. MapLibre loads only on mount.
 * Facility/segment updates preserve the user's camera; changing mapStyle recreates the map.
 */
export function NetworkMap(props: NetworkMapProps) {
  const {
    title,
    description,
    facilities,
    segments,
    areas = [],
    selectedFacilityId,
    onFacilitySelect,
    selectedSegmentId,
    latestFacilityId,
    height = 560,
  } = props;
  const container = useRef<HTMLDivElement>(null);
  const instance = useRef<MapInstance | null>(null);
  const refresh = useRef<(() => void) | null>(null);
  const latest = useRef(props);
  latest.current = props;
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [basemapError, setBasemapError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [risk, setRisk] = useState(true),
    [weather, setWeather] = useState(false);
  const layers = useRef({ risk, weather });
  layers.current = { risk, weather };
  const [zoom, setZoom] = useState(0);

  const fit = (ids: readonly string[], maxZoom = 12) => {
    const current = instance.current;
    const bounds = geographicBounds(
      latest.current.facilities
        .filter((f) => ids.includes(f.id))
        .map((f) => f.coordinates),
    );
    if (!current || !bounds) return;
    current.fitBounds(bounds, {
      padding: { top: 70, bottom: 65, left: 65, right: 80 },
      maxZoom,
      duration: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 650,
    });
  };

  useEffect(() => {
    let disposed = false,
      observer: ResizeObserver | undefined;
    let markers: {
      facility: MapFacility;
      marker: Marker;
      button: HTMLButtonElement;
      label: HTMLSpanElement;
    }[] = [];
    const element = container.current!;
    setState("loading");
    setBasemapError(false);
    const fail = (error: unknown) => {
      if (disposed) return;
      setState("error");
      latest.current.onRenderError?.(error);
    };
    loadMapEngine()
      .then((engine) => {
        if (disposed) return;
        const initial = latest.current.initialView;
        const map = new engine.Map({
          container: element,
          style: latest.current.mapStyle,
          center: initial ? [...initial.center] : [-96, 38],
          zoom: initial?.zoom ?? 3,
          attributionControl: { compact: false },
          renderWorldCopies: false,
          canvasContextAttributes: { antialias: true },
          cooperativeGestures: true,
        });
        instance.current = map;
        map.addControl(
          new engine.NavigationControl({ showCompass: false }),
          "top-right",
        );
        map.addControl(
          new engine.ScaleControl({ maxWidth: 100, unit: "imperial" }),
          "bottom-left",
        );
        map.on("error", (event) => {
          if (!disposed) {
            setBasemapError(true);
            latest.current.onRenderError?.(event.error);
          }
        });
        const position = () => {
          const p = latest.current,
            size = element.getBoundingClientRect();
          const candidates = markers.flatMap(({ facility: f, label }) => {
            const selected = f.id === p.selectedFacilityId,
              important =
                selected ||
                f.id === p.latestFacilityId ||
                p.primaryFacilityIds?.includes(f.id);
            if (!important && map.getZoom() < (f.labelMinZoom ?? 0)) return [];
            const point = map.project([...f.coordinates]);
            return [
              {
                id: f.id,
                x: point.x,
                y: point.y,
                width: Math.min(
                  size.width - 50,
                  label.scrollWidth || f.label.length * 7.5 + 22,
                ),
                priority:
                  (selected ? 1000 : 0) +
                  (important ? 500 : 0) +
                  (f.priority ?? 0),
              },
            ];
          });
          const placements = placeLabels(candidates, size.width, size.height);
          markers.forEach(({ facility, label }) => {
            const at = placements.get(facility.id);
            label.style.visibility = at ? "visible" : "hidden";
            if (at) {
              label.style.left = `${at.left}px`;
              label.style.top = `${at.top}px`;
            }
          });
        };
        const update = () => {
          if (disposed || !map.getSource("easy-ui-transfers")) return;
          element.dataset.mapIdle = "false";
          const p = latest.current,
            css = getComputedStyle(element);
          const blue = css.getPropertyValue("--map-route").trim() || "#113abf";
          const muted = css.getPropertyValue("--map-muted").trim() || "#6a7e9d";
          (map.getSource("easy-ui-transfers") as GeoJSONSource).setData(
            segmentData(p.facilities, p.segments),
          );
          (map.getSource("easy-ui-weather") as GeoJSONSource).setData(
            areaData(p.areas ?? []),
          );
          map.setPaintProperty(
            "easy-ui-observed",
            "line-color",
            p.selectedSegmentId
              ? [
                  "case",
                  ["==", ["get", "id"], p.selectedSegmentId],
                  blue,
                  muted,
                ]
              : blue,
          );
          for (const id of ["easy-ui-weather-fill", "easy-ui-weather-edge"])
            map.setLayoutProperty(
              id,
              "visibility",
              layers.current.weather ? "visible" : "none",
            );
          const kept = new Set(
            p.facilities
              .filter((f) => validCoordinate(f.coordinates))
              .map((f) => f.id),
          );
          markers
            .filter((m) => !kept.has(m.facility.id))
            .forEach((m) => m.marker.remove());
          markers = markers.filter((m) => kept.has(m.facility.id));
          for (const f of p.facilities.filter((f) =>
            validCoordinate(f.coordinates),
          )) {
            const existing = markers.find((m) => m.facility.id === f.id);
            const button = existing?.button ?? document.createElement("button");
            button.type = "button";
            button.className = styles.marker;
            button.dataset.kind = f.kind;
            button.dataset.selected = String(f.id === p.selectedFacilityId);
            button.dataset.latest = String(f.id === p.latestFacilityId);
            button.dataset.risk =
              layers.current.risk && f.risk
                ? f.risk.status === "current" && f.risk.probability !== null
                  ? f.risk.probability >= 0.15
                    ? "elevated"
                    : "normal"
                  : "unknown"
                : "off";
            button.title = f.label;
            button.disabled = !p.onFacilitySelect;
            button.setAttribute(
              "aria-label",
              `Select ${f.label}${f.detail ? `: ${f.detail}` : ""}`,
            );
            button.setAttribute(
              "aria-pressed",
              String(f.id === p.selectedFacilityId),
            );
            const dot =
              (existing?.button.firstElementChild as HTMLSpanElement) ??
              document.createElement("span");
            dot.className = styles.pin;
            dot.setAttribute("aria-hidden", "true");
            dot.textContent =
              f.kind === "warehouse"
                ? "▦"
                : f.kind === "destination"
                  ? "◇"
                  : "";
            const label = existing?.label ?? document.createElement("span");
            label.className = styles.markerLabel;
            label.textContent = f.label;
            label.setAttribute("aria-hidden", "true");
            if (!existing) button.append(dot, label);
            if (!existing)
              button.addEventListener("click", () =>
                latest.current.onFacilitySelect?.(f.id),
              );
            if (existing) {
              existing.facility = f;
              existing.marker.setLngLat([...f.coordinates]);
            } else {
              const marker = new engine.Marker({
                element: button,
                anchor: "center",
              })
                .setLngLat([...f.coordinates])
                .addTo(map);
              markers.push({ facility: f, button, label, marker });
            }
          }
          position();
        };
        refresh.current = update;
        map.on("load", () => {
          if (disposed) return;
          const css = getComputedStyle(element);
          const blue = css.getPropertyValue("--map-route").trim() || "#113abf";
          const amber =
            css.getPropertyValue("--map-warning").trim() || "#9b5900";
          map.addSource("easy-ui-transfers", {
            type: "geojson",
            data: segmentData(
              latest.current.facilities,
              latest.current.segments,
            ),
          });
          map.addSource("easy-ui-weather", {
            type: "geojson",
            data: areaData(latest.current.areas ?? []),
          });
          map.addLayer({
            id: "easy-ui-weather-fill",
            type: "fill",
            source: "easy-ui-weather",
            paint: { "fill-color": amber, "fill-opacity": 0.12 },
          });
          map.addLayer({
            id: "easy-ui-weather-edge",
            type: "line",
            source: "easy-ui-weather",
            paint: {
              "line-color": amber,
              "line-width": 2,
              "line-dasharray": [3, 3],
            },
          });
          map.addLayer({
            id: "easy-ui-casing",
            type: "line",
            source: "easy-ui-transfers",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#fff",
              "line-width": ["+", ["get", "width"], 3],
              "line-opacity": 0.85,
            },
          });
          map.addLayer({
            id: "easy-ui-observed",
            type: "line",
            source: "easy-ui-transfers",
            filter: [
              "in",
              ["get", "evidence"],
              ["literal", ["transfer", "measured"]],
            ],
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": blue,
              "line-width": ["get", "width"],
              "line-opacity": 0.9,
            },
          });
          map.addLayer({
            id: "easy-ui-unobserved",
            type: "line",
            source: "easy-ui-transfers",
            filter: [
              "in",
              ["get", "evidence"],
              ["literal", ["planned", "inferred"]],
            ],
            paint: {
              "line-color": amber,
              "line-width": 3,
              "line-dasharray": [2, 2],
            },
          });
          // A small white chevron on the route casing provides direction without a glyph service.
          const arrow = new Uint8Array(24 * 24 * 4);
          for (let y = 4; y < 20; y++)
            for (let x = 5; x < 20; x++) {
              if (Math.abs(x - (18 - Math.abs(y - 12))) <= 2) {
                const pixel = (y * 24 + x) * 4;
                arrow.set([255, 255, 255, 255], pixel);
              }
            }
          map.addImage("easy-ui-direction", {
            width: 24,
            height: 24,
            data: arrow,
          });
          map.addLayer({
            id: "easy-ui-direction",
            type: "symbol",
            source: "easy-ui-transfers",
            filter: [
              "in",
              ["get", "evidence"],
              ["literal", ["transfer", "measured"]],
            ],
            layout: {
              "symbol-placement": "line",
              "symbol-spacing": 130,
              "icon-image": "easy-ui-direction",
              "icon-size": 0.7,
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
            },
          });
          update();
          setState("ready");
          if (!initial)
            fit(
              latest.current.facilities.map((f) => f.id),
              11,
            );
          setZoom(map.getZoom());
        });
        map.on("move", position);
        map.on("moveend", () => {
          if (!disposed) setZoom(map.getZoom());
        });
        map.on("idle", () => {
          if (!disposed) element.dataset.mapIdle = "true";
        });
        map.on("movestart", () => {
          element.dataset.mapIdle = "false";
        });
        observer = new ResizeObserver(() => {
          map.resize();
          position();
        });
        observer.observe(element);
      })
      .catch(fail);
    return () => {
      disposed = true;
      refresh.current = null;
      observer?.disconnect();
      markers.forEach((m) => m.marker.remove());
      instance.current?.remove();
      instance.current = null;
    };
  }, [props.mapStyle, retry]);

  useEffect(() => {
    refresh.current?.();
  }, [
    facilities,
    segments,
    areas,
    selectedFacilityId,
    selectedSegmentId,
    latestFacilityId,
    props.primaryFacilityIds,
    risk,
    weather,
  ]);
  useEffect(() => {
    if (state === "ready" && props.focus)
      fit(props.focus.facilityIds, props.focus.maxZoom);
    // A camera request is keyed by revision. Data updates do not recenter the map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.focus?.revision, state]);
  useEffect(() => {
    instance.current?.resize();
  }, [height]);

  const active = facilities.find((f) => f.id === selectedFacilityId);
  const segment = segments.find((s) => s.id === selectedSegmentId);
  return (
    <section className={styles.root} aria-label={title}>
      <div className={styles.heading}>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <span className={styles.scale}>
          {zoom < 6 ? "National" : zoom < 10 ? "Regional" : "Local"} view
        </span>
      </div>
      <div
        className={styles.toolbar}
        role="group"
        aria-label={`${title} camera and layers`}
      >
        <div className={styles.buttons}>
          <button
            type="button"
            onClick={() =>
              fit(
                facilities.map((f) => f.id),
                11,
              )
            }
            disabled={state !== "ready"}
          >
            Entire journey
          </button>
          <button
            type="button"
            onClick={() => segment && fit([segment.from, segment.to], 13)}
            disabled={!segment || state !== "ready"}
          >
            Selected leg
          </button>
          <button
            type="button"
            onClick={() => {
              if (latestFacilityId) {
                onFacilitySelect?.(latestFacilityId);
                fit([latestFacilityId], 12);
              }
            }}
            disabled={!latestFacilityId || state !== "ready"}
          >
            Latest events
          </button>
        </div>
        <div className={styles.buttons}>
          <label>
            <input
              type="checkbox"
              checked={risk}
              onChange={(e) => setRisk(e.target.checked)}
            />{" "}
            Facility risk
          </label>
          <label>
            <input
              type="checkbox"
              checked={weather}
              disabled={!areas.length}
              onChange={(e) => setWeather(e.target.checked)}
            />{" "}
            Weather
          </label>
        </div>
      </div>
      <div
        className={styles.viewport}
        data-map-state={state}
        data-map-zoom={zoom.toFixed(2)}
      >
        <div
          ref={container}
          className={styles.canvas}
          style={{ height: Math.max(280, height) }}
        />
        {state !== "ready" && (
          <div
            className={styles.message}
            role={state === "error" ? "alert" : "status"}
          >
            {state === "error"
              ? "Unable to display the map. Location data remains available below."
              : "Loading map…"}
            {state === "error" && (
              <button type="button" onClick={() => setRetry((n) => n + 1)}>
                Retry map
              </button>
            )}
          </div>
        )}
        {state === "ready" && active && (
          <div className={styles.selection} aria-live="polite">
            <span>
              {active.kind === "destination"
                ? "Destination"
                : active.id === latestFacilityId
                  ? "Last observed location"
                  : "Selected facility"}
            </span>
            <strong>{active.label}</strong>
            {active.detail && <p>{active.detail}</p>}
            {risk && active.risk && (
              <p>
                {active.risk.status === "current"
                  ? `${percentage(active.risk.probability)} ${active.risk.event.toLowerCase()} risk`
                  : `${active.risk.status} facility estimate`}{" "}
                · next {active.risk.horizonHours}h ·{" "}
                {percentage(active.risk.baseline)} baseline
              </p>
            )}
          </div>
        )}
      </div>
      {basemapError && (
        <p className={styles.warning} role="status">
          Some basemap data could not load. Location data remains available.{" "}
          <button type="button" onClick={() => setRetry((n) => n + 1)}>
            Reload map
          </button>
        </p>
      )}
      <div className={styles.legend}>
        <span>
          <i className={styles.solid} /> Observed transfer
        </span>
        <span>
          <i className={styles.dashed} /> Planned / inferred
        </span>
        {risk && (
          <span>
            <i className={styles.riskKey} /> Facility risk ≥15%
          </span>
        )}
        <span>Endpoint links are not traveled road routes.</span>
      </div>
      {weather && (
        <div className={styles.weatherNote}>
          {areas.map((a) => (
            <p key={a.id}>
              <strong>{a.label}</strong> · {a.evidence} · {a.validFrom}–
              {a.validUntil} · {a.source}. Exposure does not establish a cause
              of delay.
            </p>
          ))}
        </div>
      )}
      <details className={styles.data}>
        <summary>Locations and exact data</summary>
        <div
          className={styles.tableScroll}
          tabIndex={0}
          role="region"
          aria-label={`${title} location data`}
        >
          <table>
            <caption>{title} — facility evidence</caption>
            <thead>
              <tr>
                <th scope="col">Location</th>
                <th scope="col">Facility cohort risk</th>
                <th scope="col">Baseline</th>
                <th scope="col">Evidence / scope</th>
                <th scope="col">Select</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((f) => (
                <tr key={f.id}>
                  <th scope="row">{f.label}</th>
                  <td>
                    {f.risk
                      ? `${percentage(f.risk.probability)} · ${f.risk.status}`
                      : "Unavailable"}
                  </td>
                  <td>
                    {f.risk ? percentage(f.risk.baseline) : "Unavailable"}
                  </td>
                  <td>
                    {f.risk
                      ? `${f.risk.event}; next ${f.risk.horizonHours} hours; ${f.risk.cohort}; as of ${f.risk.asOf}`
                      : (f.detail ?? "No risk estimate")}
                  </td>
                  <td>
                    <button
                      type="button"
                      aria-label={`Select row: ${f.label}`}
                      disabled={!onFacilitySelect}
                      onClick={() => onFacilitySelect?.(f.id)}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className={styles.segmentList}>
          {segments.map((s) => (
            <li key={s.id}>
              {s.label} · {s.evidence}
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
