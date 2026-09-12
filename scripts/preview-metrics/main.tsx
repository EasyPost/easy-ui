import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "../../easy-ui-react/src/Theme";
import { MetricCard } from "../../easy-ui-react/src/MetricCard";
import {
  Default,
  MissingObservations,
  ShippingOverview,
} from "../../easy-ui-react/src/MetricCard/MetricCard.stories";
import "../../easy-ui-react/src/styles/global.scss";
import "../../.storybook/public/poppins.css";
import "./preview.css";

const Overview = ShippingOverview.render as React.ComponentType;

createRoot(document.getElementById("root")!).render(
  <ThemeProvider colorScheme="light">
    <main>
      <p className="eyebrow">EASY UI · METRICCARD + SPARKLINE</p>
      <section aria-label="Shipping overview example">
        <Overview />
      </section>
      <p className="note">
        Each sparkline shows direction within its own scale. Comparisons have
        explicit baselines; direction and business meaning are independent.
      </p>
      <section aria-label="Metric state examples">
        <h2>Loading, unavailable, zero, and missing data</h2>
        <div className="state-grid">
          <MetricCard
            label="Delivery exceptions"
            value="0"
            supportingText="Observed zero"
          />
          <MetricCard
            label="Average rated cost"
            value={null}
            supportingText="Unavailable value"
          />
          <MetricCard
            {...Default.args}
            label="Average rated cost"
            value="$5.20"
            isLoading
          />
          <MetricCard
            {...MissingObservations.args}
            label="Average rated cost"
            value="$5.20"
          />
        </div>
      </section>
      <p className="note">
        Missing buckets remain gaps. Loading suppresses stale values and trends.
        All numbers shown here are illustrative.
      </p>
    </main>
  </ThemeProvider>,
);
