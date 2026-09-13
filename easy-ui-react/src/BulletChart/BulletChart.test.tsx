import React from "react";
import { screen } from "@testing-library/react";
import { render } from "../utilities/test";
import { BulletChart } from "./BulletChart";

it("keeps the measure, target, and scale meaningful across zero, missing, and out-of-range data", () => {
  const props = {
    label: "On-time delivery",
    target: 97,
    max: 100,
    formatValue: (value: number) => `${value}%`,
  };
  const { rerender } = render(<BulletChart {...props} value={97.8} />);
  expect(screen.getByRole("img")).toHaveAccessibleName(
    "On-time delivery: 97.8%. Target: 97%. 0%–100%.",
  );
  rerender(<BulletChart {...props} value={0} />);
  expect(screen.getByRole("img")).toHaveAccessibleName(
    "On-time delivery: 0%. Target: 97%. 0%–100%.",
  );
  rerender(<BulletChart {...props} value={null} />);
  expect(screen.queryByRole("img")).toBeNull();
  expect(screen.getByText("No data")).toBeInTheDocument();
  expect(screen.getByText("Target: 97%")).toBeInTheDocument();
  rerender(<BulletChart {...props} value={101} />);
  expect(screen.queryByRole("img")).toBeNull();
  expect(screen.getByText("No data")).toBeInTheDocument();
});
