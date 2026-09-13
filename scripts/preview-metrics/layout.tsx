import "./audit/console.mjs";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "../../easy-ui-react/src/Theme";
import { Card } from "../../easy-ui-react/src/Card";
import { Chart } from "../../easy-ui-react/src/Chart";
import { CompactTimeSeries } from "../../easy-ui-react/src/CompactTimeSeries";
import { RangePlot } from "../../easy-ui-react/src/RangePlot";
import "../../easy-ui-react/src/styles/global.scss";
import "../../.storybook/public/poppins.css";
import "./preview.css";
import "./layout.css";

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(value);
const times = [
  Date.UTC(2026, 8, 1),
  Date.UTC(2026, 8, 15),
  Date.UTC(2026, 8, 30),
];
const time = (value: number) =>
  new Date(value).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
const longLabel =
  "International expedited delivery — Oakland consolidation and cross-border distribution";
function LayoutCases() {
  const [width, setWidth] = useState(280);
  useEffect(() => {
    document.querySelectorAll("details").forEach((details) => {
      details.open = true;
    });
  }, []);
  return (
    <main className="layout-review">
      <header>
        <h1>Chart layout stress cases</h1>
        <p>
          Long labels, large values, translated dates, and expanded exact-data
          tables. Synthetic fixtures.
        </p>
        <p>
          <a href="./">Back to chart examples</a>
        </p>
        <label>
          Card width{" "}
          <select
            value={width}
            onChange={(event) => setWidth(Number(event.target.value))}
          >
            <option value={280}>280 px</option>
            <option value={320}>320 px</option>
            <option value={480}>480 px</option>
            <option value={720}>720 px</option>
          </select>
        </label>
      </header>
      <div className="stress-stack" style={{ width, maxWidth: "100%" }}>
        <Card padding="2" background="primary">
          <RangePlot
            label="Long names and large monetary values"
            description="CHF per service cohort · September 2026 · Values and supplied interval share one explicit scale."
            domain={[0, 15000000]}
            formatValue={money}
            interval={{
              from: 4500000,
              to: 12500000,
              label: "Supplied operating range",
            }}
            points={[
              { id: "observed", label: longLabel, value: 12345678.9 },
              { id: "zero", label: "Observed zero", value: 0 },
              {
                id: "missing",
                label: "Data unavailable for this reporting window",
                value: null,
              },
            ]}
          />
        </Card>
        <Card padding="2" background="primary">
          <CompactTimeSeries
            label="Large values and complete date labels"
            description="CHF · September 1–30, 2026 · Synthetic daily cohort receipts; the middle observation is missing."
            domain={[0, 15000000]}
            timeDomain={[times[0], times[2]]}
            formatTime={time}
            formatValue={money}
            series={[
              {
                id: "observed",
                label: longLabel,
                points: times.map((timestamp, index) => ({
                  time: timestamp,
                  value: index === 1 ? null : index === 0 ? 0 : 12345678.9,
                })),
              },
            ]}
          />
        </Card>
        <Chart
          option={{
            grid: {
              left: 12,
              right: 24,
              top: 30,
              bottom: 42,
              containLabel: true,
            },
            xAxis: {
              type: "value",
              min: 0,
              max: 15000000,
              splitNumber: 3,
              axisLabel: {
                formatter: (value: number) => `$${value / 1000000}M`,
              },
            },
            yAxis: { type: "category", data: ["Cohort"] },
            series: [{ type: "bar", data: [12345678.9], barMaxWidth: 24 }],
          }}
          title={longLabel}
          description="USD cohort receipts · September 2026 · The bar and exact table show the same synthetic cohort."
          actions={
            <button type="button">
              Download all warehouse and delivery-service comparisons
            </button>
          }
          notice="This intentionally long note retains the reporting population, period, units, and caveats while the exact table scrolls within its own region."
          dataTable={{
            columns: [
              "Service and warehouse",
              "Exact amount in USD",
              "Reporting population",
            ],
            rows: [
              {
                id: "stress",
                values: [
                  longLabel,
                  "$12,345,678.90",
                  "warehouse_0000000000000000000000000000000000000000000000000001",
                ],
              },
            ],
          }}
        />
      </div>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(
  <ThemeProvider colorScheme="light">
    <LayoutCases />
  </ThemeProvider>,
);
