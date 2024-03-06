import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";

import csharp from "react-syntax-highlighter/dist/esm/languages/prism/csharp";
import go from "react-syntax-highlighter/dist/esm/languages/prism/go";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import php from "react-syntax-highlighter/dist/esm/languages/prism/php";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import ruby from "react-syntax-highlighter/dist/esm/languages/prism/ruby";
import shell from "react-syntax-highlighter/dist/esm/languages/prism/shell-session";

declare global {
  interface Window {
    Prism: { manual: boolean };
  }
}

// react-syntax-highlighter uses refractor which handles the Prism highlighting
// automatically, so we need to disable Prism from running on page load with
// the following configuration, otherwise we will run into hydration errors
//
// this is fixed in a later version of refractor that isn't supported in
// react-syntax-highlighter currently
if (typeof window !== "undefined") {
  window.Prism = window.Prism || {};
  window.Prism.manual = true;
}

export type SnippetLanguage =
  | "csharp"
  | "go"
  | "java"
  | "javascript"
  | "json"
  | "php"
  | "python"
  | "ruby"
  | "shell";

const SnippetLanguages: Record<string, SnippetLanguage> = {
  CSHARP: "csharp",
  GO: "go",
  JAVA: "java",
  JAVASCRIPT: "javascript",
  JSON: "json",
  PHP: "php",
  PYTHON: "python",
  RUBY: "ruby",
  SHELL: "shell",
};

const friendlySnippetLanguageNames = {
  [SnippetLanguages.CSHARP]: "C#/.NET",
  [SnippetLanguages.GO]: "Go",
  [SnippetLanguages.JAVA]: "Java",
  [SnippetLanguages.JAVASCRIPT]: "Node.js",
  [SnippetLanguages.JSON]: "JSON",
  [SnippetLanguages.PHP]: "PHP",
  [SnippetLanguages.PYTHON]: "Python",
  [SnippetLanguages.RUBY]: "Ruby",
  [SnippetLanguages.SHELL]: "cURL",
};

SyntaxHighlighter.registerLanguage(SnippetLanguages.CSHARP, csharp);
SyntaxHighlighter.registerLanguage(SnippetLanguages.GO, go);
SyntaxHighlighter.registerLanguage(SnippetLanguages.JAVA, java);
SyntaxHighlighter.registerLanguage(SnippetLanguages.JAVASCRIPT, javascript);
SyntaxHighlighter.registerLanguage(SnippetLanguages.JSON, json);
SyntaxHighlighter.registerLanguage(SnippetLanguages.PHP, php);
SyntaxHighlighter.registerLanguage(SnippetLanguages.PYTHON, python);
SyntaxHighlighter.registerLanguage(SnippetLanguages.RUBY, ruby);
SyntaxHighlighter.registerLanguage(SnippetLanguages.SHELL, shell);

export { SyntaxHighlighter, SnippetLanguages, friendlySnippetLanguageNames };
