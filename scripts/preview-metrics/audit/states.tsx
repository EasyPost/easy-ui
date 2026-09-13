import "./console.mjs";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "../../../easy-ui-react/src/Theme";
import { Chart } from "../../../easy-ui-react/src/Chart";
import { timeSeriesExample } from "../../../easy-ui-react/src/Chart/Chart.examples";
import "../../../easy-ui-react/src/styles/global.scss";
import "../../../.storybook/public/poppins.css";
import "../preview.css";

function ChartStates() {
  const [failed, setFailed] = useState(true);
  return (
    <ThemeProvider colorScheme="light">
      <main>
        <h1>Analytical chart states</h1>
        <p className="note">
          Synthetic data · Loading, empty, error recovery, and partial coverage
        </p>
        <div className="comparison-grid">
          <Chart
            {...timeSeriesExample}
            title="Loading observations"
            status="loading"
          />
          <Chart
            {...timeSeriesExample}
            title="No observations"
            dataTable={{ ...timeSeriesExample.dataTable, rows: [] }}
          />
          <Chart
            {...timeSeriesExample}
            title="Retryable observations"
            status={failed ? "error" : "ready"}
            onRetry={() => setFailed(false)}
          />
          <Chart
            {...timeSeriesExample}
            title="Partial observations"
            notice="Partial coverage: Carrier A has a missing observation on Aug 9."
          />
        </div>
      </main>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(<ChartStates />);
