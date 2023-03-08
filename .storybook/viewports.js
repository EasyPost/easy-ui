import tokens from "../easy-ui-tokens/dist/js/tokens";

export const viewports = Object.fromEntries(
  Object.entries(tokens)
    .filter(([t]) => t.startsWith("breakpoint-"))
    .map(([key, value]) => {
      const name = key.replace("breakpoint-", "");
      return [
        name,
        {
          name,
          styles: {
            height: "1024px",
            width: value === "0px" ? "375px" : value,
          },
        },
      ];
    }),
);
