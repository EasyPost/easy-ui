import "./audit/console.mjs";
import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "../../easy-ui-react/src/Theme";
import { MetricCard } from "../../easy-ui-react/src/MetricCard";
import {
  Default,
  MissingObservations,
} from "../../easy-ui-react/src/MetricCard/MetricCard.stories";
import "../../easy-ui-react/src/styles/global.scss";
import "../../.storybook/public/poppins.css";
import "./preview.css";
import { NativeExtensions } from "./NativeExtensions";
import { LightweightExamples } from "./LightweightExamples";

const AnalyticalExamples = lazy(() =>
  import("../../easy-ui-react/src/Chart/Chart.stories").then((module) => ({
    default: module.AnalyticalExamples,
  })),
);
const AnalyticalExtensions = lazy(() =>
  import("../../easy-ui-react/src/Chart/Chart.stories").then((module) => ({
    default: module.AnalyticalExtensions,
  })),
);
const lightweightOnly =
  new URLSearchParams(location.search).get("portfolio") === "lightweight";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider colorScheme="light">
    <main>
      <p className="eyebrow">EASY UI · DATA VISUALIZATION</p>
      <LightweightExamples />
      <NativeExtensions />
      <section aria-label="Metric state examples">
        <h2>Loading, unavailable, zero, and missing data</h2>
        <div className="state-grid">
          <MetricCard
            label="Delivery exceptions"
            value="0"
            supportingText="Observed zero"
          />
          <MetricCard
            label="Average rated cost — unavailable"
            value={null}
            supportingText="Unavailable value"
          />
          <MetricCard
            {...Default.args}
            label="Average rated cost — loading"
            value="$5.20"
            isLoading
          />
          <MetricCard
            {...MissingObservations.args}
            label="Average rated cost — missing bucket"
            value="$5.20"
          />
        </div>
      </section>
      <p className="note">
        Missing buckets remain gaps. Loading suppresses stale values and trends.
        All numbers shown here are illustrative.
      </p>
      {!lightweightOnly && (
        <Suspense fallback={<p role="status">Loading analytical examples…</p>}>
          <section aria-label="Analytical chart examples">
            <h1>Shipping analytics</h1>
            <p className="note">
              Synthetic examples · Flows, trends, comparisons, distributions,
              and tradeoffs
            </p>
            <AnalyticalExamples
              renderer={
                new URLSearchParams(location.search).get("renderer") ===
                "canvas"
                  ? "canvas"
                  : "svg"
              }
            />
          </section>
          <section
            aria-label="Analytical chart extensions"
            className="extension-section"
          >
            <h1>Analytical decision patterns</h1>
            <p className="note">
              Synthetic examples · Labels, references, scenarios, distributions,
              uncertainty, and contribution
            </p>
            <AnalyticalExtensions
              renderer={
                new URLSearchParams(location.search).get("renderer") ===
                "canvas"
                  ? "canvas"
                  : "svg"
              }
            />
          </section>
        </Suspense>
      )}
    </main>
  </ThemeProvider>,
);
