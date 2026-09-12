import React from "react";
import { Card } from "../../easy-ui-react/src/Card";
import { BarList } from "../../easy-ui-react/src/BarList";
import { BulletChart } from "../../easy-ui-react/src/BulletChart";
import { Sparkline } from "../../easy-ui-react/src/Sparkline";
import { ShippingOverview } from "../../easy-ui-react/src/MetricCard/MetricCard.stories";
import { Default as Volume } from "../../easy-ui-react/src/BarList/BarList.stories";
import {
  Default as OnTime,
  CostTarget,
} from "../../easy-ui-react/src/BulletChart/BulletChart.stories";

const Overview = ShippingOverview.render as React.ComponentType;
const trends = [
  {
    label: "Growing volume",
    value: "950 parcels",
    values: [680, 750, 720, 810, 790, 900, 950],
    summary: "Daily volume rose from 680 to 950 parcels",
  },
  {
    label: "Falling cost",
    value: "$5.20",
    values: [5.8, 5.6, 5.7, 5.5, 5.4, 5.2],
    summary: "Average rated cost fell from $5.80 to $5.20",
  },
  {
    label: "Observed zero",
    value: "0 exceptions",
    values: [0, 0, 0, 0, 0, 0],
    summary: "Zero exceptions throughout the period",
  },
  {
    label: "Missing bucket",
    value: "$5.20",
    values: [5.8, 5.6, null, 5.5, 5.4, 5.2],
    summary: "Cost declined; the third bucket is missing",
  },
];

export function LightweightExamples() {
  return (
    <section aria-label="Lightweight chart examples">
      <h1>Everyday metrics</h1>
      <p className="note">
        Synthetic shipping data · Compact trends, category comparisons, and
        targets · No chart engine
      </p>
      <section aria-label="Shipping overview example">
        <Overview />
      </section>
      <div className="comparison-grid">
        <Card
          as="section"
          aria-label="Service mix"
          background="primary"
          padding="3"
        >
          <h2>Service mix</h2>
          <p className="panel-note">June volume · One shared scale</p>
          <BarList
            {...Volume.args}
            label="June parcel volume by service"
            data={Volume.args!.data!}
          />
        </Card>
        <Card
          as="section"
          aria-label="Performance against targets"
          background="primary"
          padding="3"
        >
          <h2>Performance against targets</h2>
          <p className="panel-note">
            Explicit scales · Direction has no implied sentiment
          </p>
          <div className="target-stack">
            <BulletChart
              {...OnTime.args}
              label="On-time delivery"
              value={97.8}
              target={97}
              max={100}
            />
            <BulletChart
              {...CostTarget.args}
              label="Average rated cost"
              value={5.2}
              target={5.5}
              max={8}
            />
          </div>
        </Card>
      </div>
      <Card
        as="section"
        aria-label="Compact trend examples"
        background="primary"
        padding="3"
      >
        <h2>Sparklines in a report</h2>
        <p className="panel-note">
          Equally spaced observations · Each row uses its own scale
        </p>
        <table className="sparkline-table">
          <thead>
            <tr>
              <th scope="col">Pattern</th>
              <th scope="col">Latest</th>
              <th scope="col">Trend</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((trend) => (
              <tr key={trend.label}>
                <th scope="row">{trend.label}</th>
                <td>{trend.value}</td>
                <td>
                  <Sparkline
                    values={trend.values}
                    accessibilityLabel={trend.summary}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
