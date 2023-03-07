import { getTokenAliases } from "./tokens";

const tokens = {
  "breakpoint-xs": "0px",
  "breakpoint-sm": "576px",
  "breakpoint-md": "768px",
  "font-style-heading1-family": "sans",
  "font-style-heading1-size": "2rem",
  "font-style-heading2-family": "sans",
  "font-style-heading2-size": "2rem",
  "font-style-heading3-family": "sans",
  "font-style-heading3-size": "2rem",
  "font-style-heading4-family": "sans",
  "font-style-heading4-size": "2rem",
  "font-style-small-button-family": "sans",
  "font-style-small-button-size": "2rem",
};

describe("getTokenAliases", () => {
  it("returns aliases for key at the end", () => {
    expect(getTokenAliases(tokens, "breakpoint-{alias}")).toEqual([
      "xs",
      "sm",
      "md",
    ]);
  });
  it("returns aliases for key in the middle", () => {
    expect(getTokenAliases(tokens, "font-style-{alias}-family")).toEqual([
      "heading1",
      "heading2",
      "heading3",
      "heading4",
      "small-button",
    ]);
  });
});
