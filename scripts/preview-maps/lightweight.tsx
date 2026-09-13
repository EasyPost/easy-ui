import "./console.mjs";
import React from "react";
import { createRoot } from "react-dom/client";
import { Sparkline } from "../../easy-ui-react/src/Sparkline";
import "../../.storybook/public/poppins.css";
import "./preview.css";
createRoot(document.getElementById("root")!).render(
  <main className="control">
    <h1>Lightweight trend</h1>
    <p>On-time delivery · preceding seven days</p>
    <strong>97.4%</strong>
    <div style={{ width: 240, height: 64 }}>
      <Sparkline
        values={[94, 95, 94.5, 96, 95.8, 97, 97.4]}
        accessibilityLabel="On-time delivery rose from 94% to 97.4% over seven days"
        markers="all"
      />
    </div>
    <p>This native SVG entry has no map runtime or basemap requests.</p>
    <a href="index.html">Open map examples</a>
  </main>,
);
