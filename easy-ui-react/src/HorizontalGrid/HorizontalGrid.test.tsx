import { render, screen } from "@testing-library/react";
import React from "react";
import {
  getComponentToken,
  getResponsiveDesignToken,
  getResponsiveValue,
} from "../utilities/css";
import { HorizontalGrid } from "./HorizontalGrid";
import { formatHorizontalGrid } from "./utilities";

describe("<HorizontalGrid />", () => {
  const props = {
    children: (
      <>
        <div>One</div>
        <div>Two</div>
      </>
    ),
    columns: 2,
  };

  it("should render its content with basic columns", () => {
    render(<HorizontalGrid {...props} />);
    expect(screen.getByText("One")).toBeInTheDocument();
  });

  it("should support columns as fractional", () => {
    render(
      <HorizontalGrid {...props} columns={["oneFourth", "threeFourths"]} />,
    );
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getResponsiveValue(
        "horizontal-grid",
        "grid-template-columns",
        formatHorizontalGrid(["oneFourth", "threeFourths"]),
      ),
    );
  });

  it("should support columns as arbitrary grid-template-columns values", () => {
    render(<HorizontalGrid {...props} columns={["1fr", "auto"]} />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getResponsiveValue(
        "horizontal-grid",
        "grid-template-columns",
        formatHorizontalGrid(["1fr", "auto"]),
      ),
    );
  });

  it("should support responsive columns", () => {
    render(
      <HorizontalGrid
        {...props}
        columns={{
          xs: 1,
          md: ["1fr", "auto"],
          lg: ["oneFourth", "threeFourths"],
        }}
      />,
    );
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getResponsiveValue(
        "horizontal-grid",
        "grid-template-columns",
        formatHorizontalGrid({
          xs: 1,
          md: ["1fr", "auto"],
          lg: ["oneFourth", "threeFourths"],
        }),
      ),
    );
  });

  it("should support gap", () => {
    render(<HorizontalGrid {...props} gap="2" />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getResponsiveDesignToken("horizontal-grid", "gap", "space", "2"),
    );
  });

  it("should support responsive gap", () => {
    render(<HorizontalGrid {...props} gap={{ xs: "2", md: "4" }} />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getResponsiveDesignToken("horizontal-grid", "gap", "space", {
        xs: "2",
        md: "4",
      }),
    );
  });

  it("should support align items", () => {
    render(<HorizontalGrid {...props} alignItems="center" />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getComponentToken("horizontal-grid", "align-items", "center"),
    );
  });

  it("should support inline", () => {
    render(<HorizontalGrid {...props} inline />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getComponentToken("horizontal-grid", "display", "inline-grid"),
    );
  });
});
