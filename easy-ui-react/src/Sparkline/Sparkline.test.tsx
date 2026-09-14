import React from "react";
import { screen } from "@testing-library/react";
import { render } from "../utilities/test";
import { Sparkline } from "./Sparkline";

describe("<Sparkline />", () => {
  it("exposes the trend summary without adding a keyboard stop", () => {
    render(
      <Sparkline
        values={[2, 4, 3]}
        accessibilityLabel="Daily cost, June: rising"
      />,
    );
    const chart = screen.getByRole("img", { name: "Daily cost, June: rising" });
    expect(chart).toHaveAttribute("focusable", "false");
    expect(chart).not.toHaveAttribute("tabindex");
  });

  it("preserves missing buckets as gaps and retains zero observations", () => {
    const { container } = render(
      <Sparkline
        values={[0, 2, null, 4, 6]}
        accessibilityLabel="Five days with one missing day"
      />,
    );
    const lines = container.querySelectorAll("polyline");
    expect(lines).toHaveLength(2);
    const coordinates = Array.from(lines, (line) =>
      line
        .getAttribute("points")!
        .split(" ")
        .map((point) => point.split(",").map(Number)),
    );
    const [[zero, second], [fourth]] = coordinates;
    expect(zero[1]).toBeGreaterThan(second[1]);
    // The absent third bucket occupies one full interval; it is not collapsed.
    expect(fourth[0] - second[0]).toBeCloseTo(2 * (second[0] - zero[0]));
  });

  it("renders an isolated observation as a point", () => {
    const { container } = render(
      <Sparkline values={[12]} accessibilityLabel="One observation: 12" />,
    );
    expect(container.querySelector("circle")).toHaveAttribute("cx", "80");
    expect(container.querySelector("circle")).toHaveAttribute("cy", "20");
    expect(container.querySelector("polyline")).toBeNull();
  });

  it("centers a constant series without a divide-by-zero path", () => {
    const { container } = render(
      <Sparkline values={[0, 0, 0]} accessibilityLabel="No exceptions" />,
    );
    expect(container.querySelector("polyline")).toHaveAttribute(
      "points",
      "4,20 80,20 156,20",
    );
  });

  it.each([[], [null, null], [NaN, Infinity, -Infinity]])(
    "announces no data for empty or invalid observations (%j)",
    (...values) => {
      const { container } = render(
        <Sparkline values={values} accessibilityLabel="Daily labels" />,
      );
      expect(screen.getByRole("img")).toHaveAccessibleName(
        "Daily labels. No data.",
      );
      expect(container.querySelector("polyline, circle")).toBeNull();
    },
  );

  it("breaks at nonfinite values and preserves isolated points", () => {
    const { container } = render(
      <Sparkline
        values={[1, NaN, 3, Infinity, 5]}
        accessibilityLabel="Partial data"
      />,
    );
    expect(container.querySelectorAll("circle")).toHaveLength(3);
    expect(container.querySelector("polyline")).toBeNull();
  });

  it("keeps finite coordinates for extreme positive and negative values", () => {
    const { container } = render(
      <Sparkline
        values={[-Number.MAX_VALUE, 0, Number.MAX_VALUE]}
        accessibilityLabel="Signed values"
      />,
    );
    expect(container.querySelector("polyline")).toHaveAttribute(
      "points",
      "4,36 80,20 156,4",
    );
  });
});

it("defaults to segment endpoints while supporting unmarked, all and extrema modes", () => {
  const { container, rerender } = render(
    <Sparkline
      values={[1, 2, 3, null, 2, 4]}
      accessibilityLabel="Two segments"
    />,
  );
  const endpoints = [...container.querySelectorAll("polyline")].flatMap(
    (line) => {
      const points = line.getAttribute("points")!.split(" ");
      return [points[0], points[points.length - 1]];
    },
  );
  expect(
    [...container.querySelectorAll("circle")].map(
      (point) => `${point.getAttribute("cx")},${point.getAttribute("cy")}`,
    ),
  ).toEqual(endpoints);
  expect(endpoints).toHaveLength(4);
  rerender(
    <Sparkline
      values={[1, 2, 3, null, 2, 4]}
      accessibilityLabel="Two segments"
      markers="none"
    />,
  );
  expect(container.querySelectorAll("circle")).toHaveLength(0);
  rerender(
    <Sparkline
      values={[1, 3, null, 2, 4]}
      accessibilityLabel="Two segments"
      markers="all"
    />,
  );
  expect(container.querySelectorAll("circle")).toHaveLength(4);
  expect(container.querySelectorAll("polyline")).toHaveLength(2);
  rerender(
    <Sparkline
      values={[1, 3, null, 2, 4]}
      accessibilityLabel="Two segments"
      markers="extrema"
    />,
  );
  expect(container.querySelectorAll("circle")).toHaveLength(2);
  rerender(
    <Sparkline
      values={[0, null, 10, 20]}
      accessibilityLabel="Isolated minimum"
      markers="extrema"
    />,
  );
  expect(
    [...container.querySelectorAll("circle")]
      .map((point) => Number(point.getAttribute("cx")))
      .sort((a, b) => a - b),
  ).toEqual([4, 156]);
});
