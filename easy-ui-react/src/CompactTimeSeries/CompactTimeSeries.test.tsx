import React from "react";
import { screen } from "@testing-library/react";
import { render } from "../utilities/test";
import { CompactTimeSeries } from "./CompactTimeSeries";

it("preserves elapsed spacing, gaps, exact zeros and shared scales without an engine", () => {
  const props = {
    label: "Volume",
    description: "Four timestamped observations",
    domain: [0, 10] as const,
    timeDomain: [0, 100] as const,
    formatTime: String,
    markers: "all" as const,
  };
  const { container, rerender } = render(
    <CompactTimeSeries
      {...props}
      series={[
        {
          id: "a",
          label: "A",
          points: [
            { time: 0, value: 0 },
            { time: 10, value: 5 },
            { time: 20, value: null },
            { time: 100, value: 10 },
          ],
        },
      ]}
    />,
  );
  const points = [...container.querySelectorAll("circle")]
    .map((point) => Number(point.getAttribute("cx")))
    .sort((a, b) => a - b);
  expect((points[1] - points[0]) / (points[2] - points[0])).toBeCloseTo(0.1);
  expect(container.querySelectorAll("path")).toHaveLength(1);
  expect(container.querySelector("tbody")).toHaveTextContent("A00");
  expect(container.querySelector("tbody")).toHaveTextContent("Unavailable");
  expect(screen.getByRole("img")).toHaveAccessibleName(props.description);
  rerender(<CompactTimeSeries {...props} series={[]} />);
  expect(screen.queryByRole("img")).toBeNull();
  expect(screen.getByText("No data")).toBeInTheDocument();
});
