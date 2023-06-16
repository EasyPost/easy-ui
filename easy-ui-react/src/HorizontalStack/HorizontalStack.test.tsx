import { render, screen } from "@testing-library/react";
import React from "react";
import { getComponentToken, getResponsiveDesignToken } from "../utilities/css";
import { HorizontalStack } from "./HorizontalStack";

describe("<HorizontalStack />", () => {
  const props = {
    children: (
      <>
        <div>One</div>
        <div>Two</div>
      </>
    ),
  };

  it("should render its content", () => {
    render(<HorizontalStack {...props} />);
    expect(screen.getByText("One")).toBeInTheDocument();
  });

  it("should support gap", () => {
    render(<HorizontalStack {...props} gap="2" />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getResponsiveDesignToken("horizontal-stack", "gap", "space", "2"),
    );
  });

  it("should support responsive gap", () => {
    render(<HorizontalStack {...props} gap={{ xs: "2", md: "4" }} />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getResponsiveDesignToken("horizontal-stack", "gap", "space", {
        xs: "2",
        md: "4",
      }),
    );
  });

  it("should support align", () => {
    render(<HorizontalStack {...props} align="center" />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getComponentToken("horizontal-stack", "align", "center"),
    );
  });

  it("should support block align", () => {
    render(<HorizontalStack {...props} blockAlign="center" />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getComponentToken("horizontal-stack", "block-align", "center"),
    );
  });

  it("should support inline", () => {
    render(<HorizontalStack {...props} inline />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getComponentToken("horizontal-stack", "display", "inline-flex"),
    );
  });

  it("should support wrap", () => {
    render(<HorizontalStack {...props} wrap />);
    expect(screen.getByText("One").parentElement).toHaveStyle(
      getComponentToken("horizontal-stack", "wrap", "wrap"),
    );
  });
});
