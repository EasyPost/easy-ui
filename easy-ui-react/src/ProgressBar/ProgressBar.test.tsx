import { screen } from "@testing-library/react";
import React from "react";
import { getComponentThemeToken, getComponentToken } from "../utilities/css";
import { render } from "../utilities/test";
import { ProgressBar } from "./ProgressBar";

describe("<ProgressBar />", () => {
  it("should render a progressbar named by its label", () => {
    render(<ProgressBar label="Uploading" value={40} />);
    const bar = screen.getByRole("progressbar", { name: "Uploading" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuetext", "40%");
  });

  it("should show the value label by default when there's a label", () => {
    render(<ProgressBar label="Uploading" value={40} />);
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("should hide the value label by default when there's no label", () => {
    render(<ProgressBar aria-label="Uploading" value={40} />);
    expect(
      screen.getByRole("progressbar", { name: "Uploading" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("40%")).not.toBeInTheDocument();
  });

  it("should support showing the value label without a label", () => {
    render(<ProgressBar aria-label="Uploading" value={40} showValueLabel />);
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("should support hiding the value label with a label", () => {
    render(<ProgressBar label="Uploading" value={40} showValueLabel={false} />);
    expect(screen.queryByText("40%")).not.toBeInTheDocument();
  });

  it("should support aria-labelledby", () => {
    render(
      <>
        <span id="title">Buying labels</span>
        <ProgressBar aria-labelledby="title" value={40} />
      </>,
    );
    expect(
      screen.getByRole("progressbar", { name: "Buying labels" }),
    ).toBeInTheDocument();
  });

  it("should use a custom value label for both the text and aria-valuetext", () => {
    render(
      <ProgressBar
        label="Buying labels"
        value={127}
        maxValue={250}
        valueLabel="127 of 250 labels"
      />,
    );
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemax", "250");
    expect(bar).toHaveAttribute("aria-valuetext", "127 of 250 labels");
    expect(screen.getByText("127 of 250 labels")).toBeInTheDocument();
  });

  it("should pass formatOptions through to the default value label", () => {
    render(
      <ProgressBar
        label="Storage"
        value={5}
        maxValue={10}
        formatOptions={{ style: "unit", unit: "gigabyte" }}
      />,
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      "5 GB",
    );
  });

  it("should fill relative to minValue and maxValue", () => {
    render(
      <ProgressBar label="Steps" value={15} minValue={10} maxValue={20} />,
    );
    expect(screen.getByRole("progressbar")).toHaveStyle(
      getComponentToken("progress-bar", "fill", "50%"),
    );
  });

  it("should clamp the fill to the range", () => {
    const { rerender } = render(<ProgressBar label="Upload" value={150} />);
    expect(screen.getByRole("progressbar")).toHaveStyle(
      getComponentToken("progress-bar", "fill", "100%"),
    );
    rerender(<ProgressBar label="Upload" value={-10} />);
    expect(screen.getByRole("progressbar")).toHaveStyle(
      getComponentToken("progress-bar", "fill", "0%"),
    );
  });

  it("should not divide by zero on an empty range", () => {
    render(<ProgressBar label="Upload" value={0} maxValue={0} />);
    expect(screen.getByRole("progressbar")).toHaveStyle(
      getComponentToken("progress-bar", "fill", "0%"),
    );
  });

  it("should apply color", () => {
    render(<ProgressBar label="Upload" value={40} color="positive.500" />);
    expect(screen.getByRole("progressbar")).toHaveStyle(
      getComponentThemeToken("progress-bar", "color", "color", "positive.500"),
    );
  });

  it("should default to primary.500", () => {
    render(<ProgressBar label="Upload" value={40} />);
    expect(screen.getByRole("progressbar")).toHaveStyle(
      getComponentThemeToken("progress-bar", "color", "color", "primary.500"),
    );
  });
});
