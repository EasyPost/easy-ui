import { render, screen } from "@testing-library/react";
import React from "react";
import { getComponentToken, getResponsiveDesignToken } from "../utilities/css";
import { VerticalStack } from "./VerticalStack";

describe("<VerticalStack />", () => {
  const props = {
    children: (
      <>
        <div>One</div>
        <div>Two</div>
      </>
    ),
  };

  it("should render its content", () => {
    render(<VerticalStack {...props} />);
    expect(screen.getByText("One")).toBeInTheDocument();
  });

  it("should support gap", () => {
    render(<VerticalStack {...props} gap="2" />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getResponsiveDesignToken("vertical-stack", "gap", "space", "2"),
    );
  });

  it("should support responsive gap", () => {
    render(<VerticalStack {...props} gap={{ xs: "2", md: "4" }} />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getResponsiveDesignToken("vertical-stack", "gap", "space", {
        xs: "2",
        md: "4",
      }),
    );
  });

  it("should support align", () => {
    render(<VerticalStack {...props} align="center" />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getComponentToken("vertical-stack", "align", "center"),
    );
  });

  it("should support inline align", () => {
    render(<VerticalStack {...props} inlineAlign="center" />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getComponentToken("vertical-stack", "inline-align", "center"),
    );
  });

  it("should support inline", () => {
    render(<VerticalStack {...props} inline />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getComponentToken("vertical-stack", "display", "inline-flex"),
    );
  });

  it("should support reverse order", () => {
    render(<VerticalStack {...props} reverseOrder />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getComponentToken("vertical-stack", "order", "column-reverse"),
    );
  });
});
