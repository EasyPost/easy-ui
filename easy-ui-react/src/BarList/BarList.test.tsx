import React from "react";
import { screen, within } from "@testing-library/react";
import { render } from "../utilities/test";
import { BarList } from "./BarList";

it("preserves exact category values and distinguishes zero from missing magnitudes", () => {
  const { container } = render(
    <BarList
      label="June volume"
      formatValue={(value) => `${value} parcels`}
      data={[
        { id: "a", label: "Ground", value: 10 },
        { id: "b", label: "Air", value: 5 },
        { id: "c", label: "Zero", value: 0 },
        { id: "d", label: "Missing", value: null },
        { id: "e", label: "Invalid", value: Infinity },
      ]}
    />,
  );
  const items = within(
    screen.getByRole("list", { name: "June volume" }),
  ).getAllByRole("listitem");
  expect(items.map((item) => item.textContent)).toEqual([
    "Ground10 parcels",
    "Air5 parcels",
    "Zero0 parcels",
    "MissingNo data",
    "InvalidNo data",
  ]);
  expect(
    [...container.querySelectorAll<HTMLElement>("[style]")].map(
      (bar) => bar.style.width,
    ),
  ).toEqual(["100%", "50%", "0%"]);
});
