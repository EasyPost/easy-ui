import { screen } from "@testing-library/react";
import React from "react";
import { getComponentThemeToken } from "../utilities/css";
import { render } from "../utilities/test";
import { Spinner } from "./Spinner";

describe("<Spinner />", () => {
  it("should render a spinner", () => {
    render(<Spinner isIndeterminate />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  it("should support indeterminate state with custom label", () => {
    render(<Spinner isIndeterminate>waiting</Spinner>);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByLabelText(/waiting/i)).toBeInTheDocument();
  });

  it("should be named by aria-label instead of the fallback label", () => {
    render(<Spinner aria-label="Generating labels" isIndeterminate />);
    expect(
      screen.getByRole("status", { name: "Generating labels" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it("should be named by aria-label when determinate", () => {
    render(<Spinner aria-label="Uploading file" value={50} />);
    expect(
      screen.getByRole("progressbar", { name: "Uploading file" }),
    ).toBeInTheDocument();
  });

  it("should be named by aria-labelledby instead of the fallback label", () => {
    render(
      <>
        <span id="spinner-name">Importing CSV</span>
        <Spinner aria-labelledby="spinner-name" isIndeterminate />
      </>,
    );
    expect(
      screen.getByRole("status", { name: "Importing CSV" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it("should fall back to a Loading name without a label", () => {
    render(<Spinner isIndeterminate />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("should support determinate state", () => {
    render(<Spinner value={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  it("should apply color", () => {
    render(<Spinner isIndeterminate color="positive.500" />);
    expect(screen.getByRole("status")).toHaveCustomProperties(
      getComponentThemeToken("spinner", "color", "color", "positive.500"),
    );
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  it("should apply size", () => {
    render(<Spinner isIndeterminate size="xl" />);
    expect(screen.getByRole("status")).toHaveCustomProperties(
      getComponentThemeToken("spinner", "size", "size.icon", "xl"),
    );
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  it("should hide a decorative spinner from assistive technology", () => {
    const { container } = render(
      <Spinner isIndeterminate isDecorative>
        waiting
      </Spinner>,
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByText(/waiting|loading/i)).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("should hide a decorative determinate spinner", () => {
    const { container } = render(<Spinner value={50} isDecorative />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });
});
