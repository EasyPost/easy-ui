import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { render } from "../utilities/test";
import { RadioGroup } from "./RadioGroup";

describe("<RadioGroup />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a radio group", () => {
    render(<RadioGroup>Checkbox item</RadioGroup>);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });
});
