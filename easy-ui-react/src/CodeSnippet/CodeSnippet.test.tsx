import { render, screen } from "@testing-library/react";
import React from "react";
import { mockGetComputedStyle } from "../utilities/test";
import { CodeSnippet } from "./CodeSnippet";

describe("<CodeSnippet />", () => {
  let restoreGetComputedStyle: () => void;

  beforeEach(() => {
    restoreGetComputedStyle = mockGetComputedStyle();
  });

  afterEach(() => {
    restoreGetComputedStyle();
  });

  it("should render a code snippet", () => {
    render(
      <CodeSnippet
        code={`console.log("Hello world!");`}
        language="javascript"
      />,
    );
    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
  });

  it("should render line numbers", () => {
    render(
      <CodeSnippet
        code={`console.log("Hello world!");`}
        language="javascript"
        showLineNumbers
      />,
    );
    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
    expect(screen.getByText(/1/)).toBeInTheDocument();
  });

  it("should render max lines", () => {
    render(
      <CodeSnippet
        code={`one
two
three
four
five
six`}
        language="javascript"
        maxLines={4}
      />,
    );
    expect(screen.getByText(/one/i).closest("pre")).toHaveStyle({
      "max-height": "calc(6em + 4px)",
      overflow: "auto",
    });
  });

  it("should cap max lines by height instead of clamping with an ellipsis", () => {
    render(
      <CodeSnippet
        code={`one
two
three
four
five
six`}
        language="javascript"
        maxLines={4}
      />,
    );
    const $pre = screen.getByText(/one/i).closest("pre");
    expect($pre?.style.webkitLineClamp).toBe("");
  });
});
