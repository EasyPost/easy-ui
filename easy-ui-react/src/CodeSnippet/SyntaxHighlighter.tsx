import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light.js";

import csharp from "react-syntax-highlighter/dist/esm/languages/prism/csharp.js";
import go from "react-syntax-highlighter/dist/esm/languages/prism/go.js";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java.js";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript.js";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json.js";
import php from "react-syntax-highlighter/dist/esm/languages/prism/php.js";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python.js";
import ruby from "react-syntax-highlighter/dist/esm/languages/prism/ruby.js";
import shell from "react-syntax-highlighter/dist/esm/languages/prism/shell-session.js";

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
