import { render, screen } from "@testing-library/react";
import React from "react";
import { mockGetComputedStyle } from "../utilities/test";
import { CodeSnippet } from "./CodeSnippet";
import { SnippetLanguage } from "./SyntaxHighlighter";

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

  it.each<[SnippetLanguage, string]>([
    ["csharp", `var x = "hi";`],
    ["go", `func main() { fmt.Println("hi") }`],
    ["java", `String x = "hi";`],
    ["javascript", `const x = "hi";`],
    ["json", `{ "x": "hi" }`],
    ["php", `<?php $x = "hi"; ?>`],
    ["python", `x = "hi"`],
    ["ruby", `x = "hi"`],
    ["shell", `$ curl https://example.com`],
  ])("should syntax highlight %s", (language, code) => {
    const { container } = render(
      <CodeSnippet code={code} language={language} />,
    );
    expect(container.querySelector(".token")).toBeInTheDocument();
  });
});
