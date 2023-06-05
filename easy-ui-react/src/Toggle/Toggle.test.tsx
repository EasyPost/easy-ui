import { screen } from "@testing-library/react";
import React from "react";
import { render } from "../utilities/test";
import { Toggle } from "./Toggle";

describe("<Toggle />", () => {
  it("should render simple text", () => {
    render(<Toggle>Toggle item</Toggle>);
    expect(screen.getByText("Toggle item")).toBeInTheDocument();
  });
});
