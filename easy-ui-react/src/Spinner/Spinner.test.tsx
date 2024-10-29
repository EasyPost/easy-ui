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

  it("should support determinate state", () => {
    render(<Spinner value={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  it("should apply color", () => {
    render(<Spinner isIndeterminate color="positive.500" />);
    expect(screen.getByRole("status")).toHaveStyle(
      getComponentThemeToken("spinner", "color", "color", "positive.500"),
    );
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  it("should apply size", () => {
    render(<Spinner isIndeterminate size="xl" />);
    expect(screen.getByRole("status")).toHaveStyle(
      getComponentThemeToken("spinner", "size", "size.icon", "xl"),
    );
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });
});
