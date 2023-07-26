import { ReactElement, createContext, useContext } from "react";
import { SnippetLanguage } from "../CodeSnippet/SyntaxHighlighter";

export type CodeBlockContextType = {
  languages: SnippetLanguage[];
  snippet: ReactElement;
  language: SnippetLanguage;
  onLanguageChange: (language: SnippetLanguage) => void;
};

export const CodeBlockContext = createContext<CodeBlockContextType | null>(
  null,
);

export const useCodeBlock = () => {
  const codeBlock = useContext(CodeBlockContext);
  if (!codeBlock) {
    throw new Error("Must be within a CodeBlock");
  }
  return codeBlock;
};
