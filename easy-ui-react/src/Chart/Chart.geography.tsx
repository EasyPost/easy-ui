import React, { useState } from "react";
import { registerMap, use as registerExtensions } from "echarts/core";
import { GeoComponent } from "echarts/components";
import { LinesChart } from "echarts/charts";
import type { GeoComponentOption } from "echarts";
import { Chart, ChartProps } from "./Chart";
import { contiguousUS } from "./contiguousUS";
import { warehouseProgress, trackingStart } from "./Chart.logistics";
import styles from "./examples.module.scss";

// This entire module is dynamically imported by the geography stories.
// The ordinary modular portfolio never registers Geo or Lines.
registerExtensions([GeoComponent, LinesChart]);
registerMap(
  "easy-ui-us-demo",
  contiguousUS as Parameters<typeof registerMap>[1],
);
const blue = "#113abf",
  teal = "#007f86",
  orange = "#9b5900",
  purple = "#772bb0";
export const facilities = {
  Oakland: [-122.27, 37.8],
  "Salt Lake City": [-111.89, 40.76],
  Chicago: [-87.63, 41.88],
  Dallas: [-96.8, 32.78],
  Atlanta: [-84.39, 33.75],
  Newark: [-74.17, 40.73],
  Detroit: [-83.05, 42.33],
  Miami: [-80.19, 25.76],
  Denver: [-104.99, 39.74],
} satisfies Record<string, [number, number]>;
type Facility = keyof typeof facilities;
const geo: GeoComponentOption = {
  map: "easy-ui-us-demo",
  roam: false,
  silent: true,
  preserveAspect: true,
  left: 18,
  right: 18,
  top: 42,
  bottom: 28,
  boundingCoords: [
    [-126, 50],
    [-66, 24],
  ],
  itemStyle: { areaColor: "#edf1f7", borderColor: "#a7b3c8", borderWidth: 1 },
  emphasis: { disabled: true },
};
const timestamp = (hour: number) =>
  new Date(trackingStart + hour * 3600000)
    .toISOString()
    .replace(":00.000Z", "Z");
export const lanes: {
  id: string;
  from: Facility;
  to: Facility;
  parcels: number;
  late: number;
}[] = [
  {
    id: "oak-slc",
    from: "Oakland",
    to: "Salt Lake City",
    parcels: 2800,
    late: 84,
  },
  {
    id: "slc-chi",
    from: "Salt Lake City",
    to: "Chicago",
    parcels: 2100,
    late: 168,
  },
  { id: "oak-dal", from: "Oakland", to: "Dallas", parcels: 1800, late: 54 },
  { id: "dal-atl", from: "Dallas", to: "Atlanta", parcels: 3200, late: 64 },
  { id: "chi-nwk", from: "Chicago", to: "Newark", parcels: 2600, late: 156 },
  { id: "atl-nwk", from: "Atlanta", to: "Newark", parcels: 1600, late: 32 },
];
export const laneMapExample: ChartProps = {
  title: "Lane delivery risk",
  description:
    "Synthetic matured cohorts · Aug 1–7 · Width encodes parcel volume. Dashed amber links exceed 5% late. Straight links join facilities; they are not traveled routes.",
  notice:
    "Select a link or its table row to inspect a lane. Rates use all eligible parcels in each completed observation window; this is not a live traffic map.",
  option: {
    geo,
    tooltip: {
      trigger: "item",
      formatter: (p) => {
        const item = Array.isArray(p) ? p[0] : p;
        const l = lanes.find((l) => l.id === item.name);
        return l
          ? `${l.from} → ${l.to}: ${l.parcels.toLocaleString("en-US")} parcels · ${((l.late / l.parcels) * 100).toFixed(1)}% late`
          : item.name;
      },
    },
    series: [
      {
        id: "lanes",
        type: "lines",
        coordinateSystem: "geo",
        z: 2,
        symbol: ["none", "arrow"],
        symbolSize: 6,
        emphasis: { lineStyle: { width: 7, opacity: 1 } },
        data: lanes.map((l) => ({
          name: l.id,
          coords: [facilities[l.from], facilities[l.to]],
          lineStyle: {
            color: l.late / l.parcels > 0.05 ? orange : blue,
            type:
              l.late / l.parcels > 0.05
                ? ("dashed" as const)
                : ("solid" as const),
            width: Math.sqrt(l.parcels / 400),
            opacity: 0.85,
          },
        })),
      },
      {
        id: "facilities",
        type: "scatter",
        coordinateSystem: "geo",
        symbolSize: 8,
        itemStyle: { color: "#172b4d" },
        label: {
          show: true,
          position: "bottom",
          fontSize: 10,
          color: "#172b4d",
          formatter: "{b}",
        },
        data: [...new Set(lanes.flatMap((l) => [l.from, l.to]))].map(
          (name) => ({ name, value: facilities[name] }),
        ),
        silent: true,
      },
    ],
  },
  dataTable: {
    columns: [
      "Origin",
      "Destination",
      "Parcels",
      "Late parcels",
      "Late (%)",
      "Above 5%",
    ],
    rows: lanes.map((l) => ({
      id: l.id,
      values: [
        l.from,
        l.to,
        l.parcels,
        l.late,
        Number(((l.late / l.parcels) * 100).toFixed(1)),
        l.late / l.parcels > 0.05 ? "Yes" : "No",
      ],
    })),
  },
};

export const parcelPaths: {
  id: string;
  origin: Facility;
  scans: { place: Facility; hour: number; event: string }[];
  destination: Facility;
}[] = [
  {
    id: "P-104",
    origin: "Oakland",
    scans: [
      { place: "Oakland", hour: 0, event: "Accepted" },
      { place: "Oakland", hour: 6, event: "Departed origin" },
      { place: "Salt Lake City", hour: 28, event: "Transit scan" },
      { place: "Chicago", hour: 35, event: "Arrived destination facility" },
      { place: "Chicago", hour: 40, event: "Departed facility" },
    ],
    destination: "Detroit",
  },
  {
    id: "P-105",
    origin: "Oakland",
    scans: [
      { place: "Oakland", hour: 5, event: "Accepted" },
      { place: "Salt Lake City", hour: 35, event: "Transit scan" },
    ],
    destination: "Chicago",
  },
  {
    id: "P-201",
    origin: "Dallas",
    scans: [
      { place: "Dallas", hour: 8, event: "Accepted" },
      { place: "Atlanta", hour: 39, event: "Delivered" },
    ],
    destination: "Atlanta",
  },
  {
    id: "P-202",
    origin: "Dallas",
    scans: [
      { place: "Dallas", hour: 12, event: "Accepted" },
      { place: "Atlanta", hour: 41, event: "Transit scan" },
    ],
    destination: "Miami",
  },
  {
    id: "P-301",
    origin: "Newark",
    scans: [
      { place: "Newark", hour: 20, event: "Accepted" },
      { place: "Chicago", hour: 42, event: "Transit scan" },
    ],
    destination: "Denver",
  },
];
const origins = ["All warehouses", "Oakland", "Dallas", "Newark"] as const;
export function parcelMapExample(origin: string, selected: string): ChartProps {
  const paths = parcelPaths.filter(
    (p) => origin === "All warehouses" || p.origin === origin,
  );
  const active = paths.find((p) => p.id === selected) ?? paths[0];
  const summary = warehouseProgress.find((p) => p.id === active.id)!;
  const last = active.scans[active.scans.length - 1];
  return {
    title: "Parcel scan paths",
    description:
      "Snapshot Aug 5, 03:00 UTC · Synthetic parcels from Oakland, Dallas and Newark. Solid links connect observed scans; dashed links indicate planned destinations, not predicted current positions.",
    notice: `${active.id}: ${summary.state}. Last scan: ${last.place}, ${timestamp(last.hour)} (${43 - last.hour}h before snapshot). ${summary.delivered ? "Delivered event observed." : "The parcel's current position is unknown."}`,
    option: {
      geo,
      tooltip: {
        trigger: "item",
        formatter: (p) => {
          const item = Array.isArray(p) ? p[0] : p;
          return item.name;
        },
      },
      series: [
        {
          id: "scanned-links",
          type: "lines",
          coordinateSystem: "geo",
          z: 2,
          symbol: ["none", "arrow"],
          symbolSize: 5,
          data: paths.flatMap((p) =>
            p.scans
              .slice(1)
              .filter((s, i) => s.place !== p.scans[i].place)
              .map((s) => {
                const index = p.scans.indexOf(s);
                return {
                  name: p.id,
                  coords: [
                    facilities[p.scans[index - 1].place],
                    facilities[s.place],
                  ],
                  lineStyle: {
                    color: p.id === active.id ? blue : "#627891",
                    width: p.id === active.id ? 3 : 1.5,
                    opacity: p.id === active.id ? 1 : 0.4,
                  },
                };
              }),
          ),
        },
        {
          id: "planned-links",
          type: "lines",
          coordinateSystem: "geo",
          z: 2,
          silent: true,
          lineStyle: { color: purple, type: "dashed", width: 2 },
          data: summary.delivered
            ? []
            : [
                {
                  coords: [
                    facilities[last.place],
                    facilities[active.destination],
                  ],
                },
              ],
        },
        {
          id: "scans",
          type: "scatter",
          coordinateSystem: "geo",
          z: 3,
          symbolSize: 7,
          itemStyle: { color: blue },
          label: {
            show: true,
            fontSize: 10,
            position: "bottom",
            color: "#172b4d",
            formatter: "{b}",
          },
          silent: true,
          data: [
            ...new Set(paths.flatMap((p) => p.scans.map((s) => s.place))),
          ].map((place) => ({
            name: place,
            value: facilities[place],
          })),
        },
        {
          id: "last-scan",
          type: "scatter",
          coordinateSystem: "geo",
          z: 4,
          symbol: "diamond",
          symbolSize: 14,
          itemStyle: { color: summary.delivered ? teal : orange },
          data: [
            {
              name: `${active.id} last scan: ${last.place}`,
              value: facilities[last.place],
            },
          ],
        },
        {
          id: "planned-destination",
          type: "scatter",
          coordinateSystem: "geo",
          z: 3,
          symbol: "emptyCircle",
          symbolSize: 9,
          itemStyle: { color: purple },
          label: {
            show: true,
            position: "top",
            fontSize: 10,
            color: "#172b4d",
            formatter: "{b}",
          },
          silent: true,
          data: summary.delivered
            ? []
            : [
                {
                  name: active.destination,
                  value: facilities[active.destination],
                },
              ],
        },
      ],
    },
    dataTable: {
      columns: [
        "Parcel",
        "Warehouse",
        "State",
        "Last scan location",
        "Last scan UTC",
        "Age (h)",
        "Destination",
      ],
      rows: paths.map((p) => {
        const s = p.scans[p.scans.length - 1];
        return {
          id: p.id,
          values: [
            p.id,
            p.origin,
            warehouseProgress.find((w) => w.id === p.id)!.state,
            s.place,
            timestamp(s.hour),
            43 - s.hour,
            p.destination,
          ],
        };
      }),
    },
  };
}

export function GeographicExamples({
  renderer = "svg",
}: {
  renderer?: "svg" | "canvas";
}) {
  const [lane, setLane] = useState<string | null>(null);
  const [origin, setOrigin] = useState<string>("All warehouses");
  const [parcel, setParcel] = useState("P-104");
  const active =
    parcelPaths.find(
      (p) =>
        p.id === parcel && (origin === "All warehouses" || p.origin === origin),
    ) ??
    parcelPaths.find(
      (p) => origin === "All warehouses" || p.origin === origin,
    )!;
  const route = parcelMapExample(origin, active.id);
  return (
    <div className={styles.gallery}>
      <Chart
        {...laneMapExample}
        renderer={renderer}
        onRowSelect={setLane}
        onSelect={(s) => setLane(s.name)}
        notice={
          lane
            ? `Selected lane: ${lane}. ${laneMapExample.notice}`
            : laneMapExample.notice
        }
      />
      <div>
        <div className={styles.mapControls}>
          <label>
            Warehouse{" "}
            <select
              aria-label="Warehouse"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            >
              {origins.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <label>
            Parcel{" "}
            <select
              aria-label="Parcel"
              value={active.id}
              onChange={(e) => setParcel(e.target.value)}
            >
              {parcelPaths
                .filter(
                  (p) => origin === "All warehouses" || p.origin === origin,
                )
                .map((p) => (
                  <option key={p.id}>{p.id}</option>
                ))}
            </select>
          </label>
        </div>
        <Chart
          {...route}
          renderer={renderer}
          onRowSelect={setParcel}
          onSelect={(s) => {
            if (parcelPaths.some((p) => p.id === s.name)) setParcel(s.name);
          }}
        />
        <details className={styles.scanEvents}>
          <summary>Scan events for {active.id}</summary>
          <ol>
            {active.scans.map((scan, i) => (
              <li key={i}>
                <time dateTime={timestamp(scan.hour)}>
                  {timestamp(scan.hour)}
                </time>{" "}
                — {scan.place}: {scan.event}
              </li>
            ))}
          </ol>
        </details>
      </div>
    </div>
  );
}
