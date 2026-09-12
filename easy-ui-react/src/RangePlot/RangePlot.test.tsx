import React from "react";
import { screen, within } from "@testing-library/react";
import { render } from "../utilities/test";
import { RangePlot } from "./RangePlot";

it("aligns signed benchmarks and represents equal bounds as a point without inventing a range", () => {
  const { container } = render(
    <RangePlot
      label="Change"
      description="One shared scale"
      domain={[-5, 5]}
      interval={{ from: 0, to: 0, label: "Fixed" }}
      points={[
        { id: "a", label: "Below", value: -2 },
        { id: "b", label: "Zero", value: 0 },
        { id: "c", label: "Missing", value: null },
      ]}
    />,
  );
  const rows = within(
    screen.getByRole("list", { name: "Change" }),
  ).getAllByRole("listitem");
  expect(rows.map((row) => row.textContent)).toEqual([
    "Fixed0",
    "Below-2",
    "Zero0",
    "MissingNo data",
  ]);
  const marks = [...container.querySelectorAll<HTMLElement>("[style]")];
  expect(marks.map((mark) => mark.style.left)).toEqual(["50%", "30%", "50%"]);
  expect(marks.every((mark) => !mark.style.width)).toBe(true);
});
