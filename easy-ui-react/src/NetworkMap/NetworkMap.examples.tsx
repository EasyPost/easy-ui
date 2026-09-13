import React, { useMemo, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { NetworkMap } from "./NetworkMap";
import type { MapFocus } from "./types";
import {
  exampleBasemap,
  facilityMetrics,
  networkFacilities,
  networkSegments,
  parcelCohort,
  parcelEvents,
  parcelFacilities,
  parcelSegments,
  snapshot,
  weatherAreas,
} from "./NetworkMap.fixtures";
import styles from "./examples.module.scss";

export type MapAudience = "parcel" | "shipper" | "carrier";
const pct = (n: number | null) =>
  n === null ? "Unavailable" : `${Math.round(n * 100)}%`;
const format = (n: number) => n.toLocaleString("en-US");
const regional = ["dtw", "dbn", "liv", "war", "ann"];
const primary = ["oak", "dal", "ewr", "dst"];
const originVolumes: Record<string, number> = {
  all: 1240,
  oak: 840,
  dal: 260,
  ewr: 140,
};
const outflow: Record<string, number[]> = {
  oak: [350, 150, 120, 220],
  dal: [110, 60, 30, 60],
  ewr: [60, 30, 30, 20],
};

export function NetworkMapExample({
  audience = "parcel",
}: {
  audience?: MapAudience;
}) {
  const [selected, setSelected] = useState(
    audience === "parcel" ? "dbn" : "dtw",
  );
  const [leg, setLeg] = useState("dtw-dbn");
  const [origin, setOrigin] = useState("all");
  const [parcelId, setParcelId] = useState<string | undefined>(
    audience === "shipper" ? "EP-105" : "EP-104",
  );
  const [focus, setFocus] = useState<MapFocus>();
  const [revision, setRevision] = useState(0);
  const choose = (id: string, zoom = 11) => {
    setSelected(id);
    setRevision((n) => n + 1);
    setFocus({ revision: revision + 1, facilityIds: [id], maxZoom: zoom });
  };
  const selectedFacility = networkFacilities.find((f) => f.id === selected)!;
  const metrics = facilityMetrics[selected];
  const parcels = parcelCohort.filter(
    (p) => origin === "all" || p.origin === origin,
  );
  const selectedParcel = parcels.find((p) => p.id === parcelId);
  const facilities = useMemo(
    () =>
      audience === "parcel"
        ? parcelFacilities
        : audience === "carrier"
          ? networkFacilities.filter((f) => regional.includes(f.id))
          : networkFacilities.filter(
              (f) =>
                f.id !== "dst" &&
                (origin === "all" ||
                  !["oak", "dal", "ewr"].includes(f.id) ||
                  f.id === origin) &&
                (origin === "all" || origin === "oak" || f.id !== "slc") &&
                (origin !== "ewr" || f.id !== "chi"),
            ),
    [audience, origin],
  );
  const segments = useMemo(() => {
    if (audience === "parcel") return parcelSegments;
    if (audience === "carrier")
      return networkSegments
        .filter((s) => regional.includes(s.from) && regional.includes(s.to))
        .map((s) => ({
          ...s,
          volume: (s.volume ?? 0) * 10,
          label: `${s.label.split(" · ")[0]} · ${format((s.volume ?? 0) * 10)} Ground parcels / 24h`,
        }));
    if (origin === "all") return networkSegments;
    const origins =
      origin === "oak"
        ? ["oak-slc", "slc-chi", "chi-dtw"]
        : origin === "dal"
          ? ["dal-chi", "chi-dtw"]
          : ["ewr-dtw"];
    return networkSegments
      .filter((s) => origins.includes(s.id) || s.from === "dtw")
      .map((s) => {
        const volume =
          s.from === "dtw"
            ? outflow[origin][["dbn", "liv", "war", "ann"].indexOf(s.to)]
            : originVolumes[origin];
        return {
          ...s,
          volume,
          label: `${s.label.split(" · ")[0]} · ${format(volume)} Ground parcels / 24h · selected warehouse cohort`,
        };
      });
  }, [audience, origin]);
  const initialView = useMemo(
    () =>
      audience === "shipper"
        ? undefined
        : {
            center: [-83.29, 42.34] as const,
            zoom: audience === "parcel" ? 9.4 : 8.7,
          },
    [audience],
  );
  const heading =
    audience === "parcel"
      ? "Every handoff, in context."
      : audience === "shipper"
        ? "See how your shipments are moving."
        : "Find pressure before it becomes delay.";

  return (
    <div className={styles.page} data-map-example={audience}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>
            EASYPOST ·{" "}
            {audience === "parcel"
              ? "PARCEL VISIBILITY"
              : audience === "shipper"
                ? "SHIPPER NETWORK"
                : "CARRIER OPERATIONS"}
          </p>
          <h1>{heading}</h1>
          <p className={styles.subtitle}>
            {audience === "parcel"
              ? "EP-104 · Ground · Oakland → Dearborn"
              : audience === "shipper"
                ? "Ground shipments · 3 origin warehouses · Southeast Michigan delivery network"
                : "Detroit region · Ground service · Facility flow and operating conditions"}
          </p>
        </div>
        <div className={styles.snapshot}>
          <span>As of Sep 13, 2026</span>
          <strong>14:00 UTC</strong>
          <span>Synthetic demonstration</span>
        </div>
      </header>
      <div className={styles.kpis}>
        {(audience === "parcel"
          ? [
              [
                "Last observed",
                "Dearborn",
                "Departed distribution · 10:30 UTC",
              ],
              [
                "Expected delivery",
                "16:00–18:00",
                "UTC · supplied forecast window",
              ],
              ["Promise-miss risk", "8%", "EP-104 · by 18:00 UTC today"],
              ["Observed transfers", "4", "Plus one planned delivery leg"],
            ]
          : audience === "shipper"
            ? [
                [
                  "Daily origin flow",
                  format(originVolumes[origin]),
                  "Ground parcels · preceding 24h",
                ],
                [
                  "Warehouses",
                  origin === "all" ? "3" : "1",
                  "Current origin filter",
                ],
                [
                  "Shipment sample",
                  String(parcels.length),
                  "Selected sample, not the full cohort",
                ],
                [
                  "Promise exposure",
                  `${parcels.filter((p) => (p.promiseRisk ?? 0) >= 0.15).length} in sample`,
                  "≥15% modeled promise-miss risk",
                ],
              ]
            : [
                [
                  "Detroit throughput",
                  "12,400",
                  "Ground parcels · preceding 24h",
                ],
                ["Above expected", "+27%", "9,800 expected · comparable day"],
                ["Operating capacity", "108%", "11,500 parcels / 24h"],
                [
                  "Exception risk",
                  "18%",
                  "Facility cohort · next 24h · 6% baseline",
                ],
              ]
        ).map(([label, value, note]) => (
          <div className={styles.kpi} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{note}</small>
          </div>
        ))}
      </div>
      <div className={styles.layout}>
        <aside
          className={styles.sidebar}
          aria-label={`${audience} investigation`}
        >
          {audience === "parcel" ? (
            <>
              <div className={styles.sideHeading}>
                <span className={styles.badge}>In transit</span>
                <h2>Journey events</h2>
                <p>Seven scans. Five facilities. One connected history.</p>
              </div>
              <ol className={styles.events}>
                {parcelEvents.map((e, i) => (
                  <li
                    key={e.id}
                    className={
                      selected === e.facility ? styles.activeEvent : ""
                    }
                  >
                    <button
                      type="button"
                      onClick={() =>
                        choose(e.facility, e.facility === "dbn" ? 12 : 10)
                      }
                      aria-label={`Focus ${e.event}`}
                      aria-pressed={selected === e.facility}
                    >
                      <span className={styles.eventNumber}>{i + 1}</span>
                      <span>
                        <small>{e.time} UTC</small>
                        <strong>{e.event}</strong>
                        <span>{e.note}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
              <label className={styles.field}>
                Transit leg
                <select
                  aria-label="Transit leg"
                  value={leg}
                  onChange={(e) => setLeg(e.target.value)}
                >
                  {parcelSegments.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <p className={styles.sideNote}>
                The last scan is a location observation. The parcel’s position
                between scans is unknown.
              </p>
            </>
          ) : audience === "shipper" ? (
            <>
              <div className={styles.sideHeading}>
                <span className={styles.badge}>Your network</span>
                <h2>Shipment sample</h2>
                <p>Inspect a parcel to locate its last observed facility.</p>
              </div>
              <label className={styles.field}>
                Origin warehouse
                <select
                  aria-label="Origin warehouse"
                  value={origin}
                  onChange={(e) => {
                    setOrigin(e.target.value);
                    const p = parcelCohort.find(
                      (p) =>
                        e.target.value === "all" || p.origin === e.target.value,
                    )!;
                    setParcelId(p.id);
                    setSelected(p.facility);
                  }}
                >
                  <option value="all">All warehouses</option>
                  <option value="oak">Oakland</option>
                  <option value="dal">Dallas</option>
                  <option value="ewr">Newark</option>
                </select>
              </label>
              <div className={styles.parcels}>
                {parcels.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    aria-label={`Inspect parcel ${p.id}`}
                    aria-pressed={parcelId === p.id}
                    onClick={() => {
                      setParcelId(p.id);
                      choose(p.facility);
                    }}
                  >
                    <span>
                      <strong>{p.id}</strong>
                      <small>
                        {
                          networkFacilities
                            .find((f) => f.id === p.origin)!
                            .label.split(" ")[0]
                        }{" "}
                        → {p.destination}
                      </small>
                    </span>
                    <span
                      className={
                        (p.promiseRisk ?? 0) >= 0.15
                          ? styles.warningBadge
                          : styles.badge
                      }
                    >
                      {pct(p.promiseRisk)}
                    </span>
                    <small>
                      {p.status} · {p.last}
                    </small>
                  </button>
                ))}
              </div>
              {selectedParcel ? (
                <div className={styles.detailCard}>
                  <span className={styles.muted}>
                    Selected parcel · {selectedParcel.id}
                  </span>
                  <h3>{pct(selectedParcel.promiseRisk)} promise-miss risk</h3>
                  <p>
                    By {selectedParcel.promise}. Parcel-specific model, as of
                    14:00 UTC.
                  </p>
                  <p>
                    {selectedParcel.status === "Scan overdue"
                      ? "Scan overdue; current location and risk are unavailable."
                      : "Last scan identifies a facility, not a live parcel position."}
                  </p>
                </div>
              ) : (
                <div className={styles.detailCard}>
                  <h3>{selectedFacility.label}</h3>
                  <p>
                    No parcels in this sample were last observed here. The
                    network flow represents the full selected warehouse cohort.
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className={styles.sideHeading}>
                <span className={styles.warningBadge}>Capacity pressure</span>
                <h2>Regional facilities</h2>
                <p>Select a facility to inspect its volume, dwell and risk.</p>
              </div>
              <div className={styles.facilityList}>
                {networkFacilities
                  .filter((f) => regional.includes(f.id))
                  .map((f) => (
                    <button
                      type="button"
                      key={f.id}
                      aria-label={`Inspect facility ${f.label}`}
                      aria-pressed={selected === f.id}
                      onClick={() => choose(f.id, 11)}
                    >
                      <span>
                        <strong>{f.label}</strong>
                        <small>
                          {format(facilityMetrics[f.id].volume)} parcels ·{" "}
                          {facilityMetrics[f.id].dwell}h dwell
                        </small>
                      </span>
                      <span
                        className={
                          (f.risk?.probability ?? 0) >= 0.15
                            ? styles.warningBadge
                            : styles.badge
                        }
                      >
                        {f.risk?.status === "current"
                          ? pct(f.risk.probability)
                          : f.risk?.status === "stale"
                            ? "Stale"
                            : "No estimate"}
                      </span>
                    </button>
                  ))}
              </div>
              {metrics && (
                <div className={styles.detailCard}>
                  <span className={styles.muted}>
                    Facility cohort · next 24 hours
                  </span>
                  <h3>{selectedFacility.label}</h3>
                  <dl>
                    <dt>New exception risk</dt>
                    <dd>
                      {selectedFacility.risk?.status === "current"
                        ? pct(selectedFacility.risk.probability)
                        : selectedFacility.risk?.status}
                    </dd>
                    <dt>Comparable baseline</dt>
                    <dd>6%</dd>
                    <dt>Volume / expected</dt>
                    <dd>
                      {format(metrics.volume)} / {format(metrics.expected)}
                    </dd>
                    <dt>Operating limit</dt>
                    <dd>{format(metrics.capacity)} / 24h</dd>
                    <dt>Dwell / baseline</dt>
                    <dd>
                      {metrics.dwell}h / {metrics.baselineDwell}h
                    </dd>
                    <dt>Current backlog</dt>
                    <dd>{format(metrics.backlog)}</dd>
                  </dl>
                  <p>
                    Ground parcels inducted during the preceding 24h. Model
                    output: {selectedFacility.risk?.asOf} ·{" "}
                    {selectedFacility.risk?.status}.
                  </p>
                </div>
              )}
            </>
          )}
        </aside>
        <div className={styles.mapColumn}>
          <NetworkMap
            title={
              audience === "parcel"
                ? "Parcel journey"
                : audience === "shipper"
                  ? "Warehouse-to-delivery flow"
                  : "Detroit regional network"
            }
            description={
              audience === "parcel"
                ? "Observed handoffs and the next planned leg. Zoom out for the full journey."
                : audience === "shipper"
                  ? "Line width represents daily flow in the current warehouse cohort; the sidebar contains a parcel sample."
                  : "Line width represents regional Ground transfers in the preceding 24h. Risk is facility-cohort exception probability."
            }
            mapStyle={exampleBasemap}
            workerUrl={workerUrl}
            facilities={facilities}
            segments={segments}
            areas={weatherAreas}
            selectedFacilityId={selected}
            onFacilitySelect={(id) => {
              setSelected(id);
              if (audience === "shipper")
                setParcelId(parcels.find((p) => p.facility === id)?.id);
            }}
            selectedSegmentId={audience === "parcel" ? leg : undefined}
            latestFacilityId={audience === "parcel" ? "dbn" : undefined}
            primaryFacilityIds={primary}
            focus={focus}
            initialView={initialView}
            height={560}
          />
          <div className={styles.contextRow}>
            <div>
              <strong>
                {audience === "carrier"
                  ? "Volume is elevated. Cause remains unassigned."
                  : "Context stays connected as you zoom."}
              </strong>
              <p>
                {audience === "carrier"
                  ? "Use the weather layer to inspect exposure. The forecast does not establish why dwell increased."
                  : "Choose a leg or an event to move between national transfers, regional hubs and nearby distribution facilities."}
              </p>
            </div>
            <span className={styles.contextTag}>
              Observed · inferred · planned
            </span>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        Illustrative parcel, facility and forecast records · Snapshot {snapshot}{" "}
        · Geographic basemap © OpenStreetMap contributors · OpenMapTiles ·
        OpenFreeMap
      </footer>
    </div>
  );
}
