import React from "react";
import { screen } from "@testing-library/react";
import { render } from "../utilities/test";
import { MetricCard } from "./MetricCard";

const trend = {
  values: [6, 5.8, 5.2],
  accessibilityLabel: "Average rated cost fell over three days",
};

describe("<MetricCard />", () => {
  it("shows the value, period, comparison baseline, and accessible trend", () => {
    render(
      <MetricCard
        label="Average rated cost"
        value="$5.20"
        supportingText="June 1–30 · USD"
        comparison={{ label: "4.2% lower", baseline: "vs previous 30 days" }}
        trend={trend}
      />,
    );
    expect(
      screen.getByRole("region", { name: "Average rated cost" }),
    ).toBeInTheDocument();
    expect(screen.getByText("$5.20")).toBeInTheDocument();
    expect(screen.getByText("June 1–30 · USD")).toBeInTheDocument();
    expect(screen.getByText("4.2% lower")).toBeInTheDocument();
    expect(screen.getByText("vs previous 30 days")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAccessibleName(
      trend.accessibilityLabel,
    );
  });

  it("does not infer a positive sentiment from an increase", () => {
    render(
      <MetricCard
        label="Spend"
        value="$100"
        comparison={{ label: "10% higher", baseline: "vs May" }}
      />,
    );
    expect(screen.getByTestId("root").className).toContain("variantGray");
  });

  it("can represent a decrease as an improvement", () => {
    render(
      <MetricCard
        label="Cost"
        value="$5.20"
        comparison={{
          label: "4.2% lower",
          baseline: "vs May",
          sentiment: "positive",
        }}
      />,
    );
    expect(screen.getByTestId("root").className).toContain("variantSuccess");
  });

  it("distinguishes a real zero from unavailable data", () => {
    const { rerender } = render(<MetricCard label="Exceptions" value="0" />);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.queryByText("No data")).toBeNull();
    rerender(<MetricCard label="Exceptions" value={null} trend={trend} />);
    expect(screen.getByText("No data")).toBeInTheDocument();
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("suppresses stale values and comparisons while loading, then restores them", () => {
    const props = {
      label: "Cost",
      value: "$5.20",
      trend,
      comparison: { label: "4.2% lower", baseline: "vs May" },
    };
    const { rerender } = render(<MetricCard {...props} isLoading />);
    expect(screen.getByRole("region")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Loading…");
    expect(screen.queryByText("$5.20")).toBeNull();
    expect(screen.queryByText("4.2% lower")).toBeNull();
    expect(screen.queryByRole("img")).toBeNull();
    rerender(<MetricCard {...props} />);
    expect(screen.getByRole("region")).toHaveAttribute("aria-busy", "false");
    expect(screen.getByText("$5.20")).toBeInTheDocument();
  });

  it("accepts localized unavailable and loading labels", () => {
    const { rerender } = render(
      <MetricCard label="Coste" value={null} emptyLabel="Sin datos" />,
    );
    expect(screen.getByText("Sin datos")).toBeInTheDocument();
    rerender(
      <MetricCard
        label="Coste"
        value={null}
        isLoading
        loadingLabel="Cargando"
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Cargando");
  });
});
