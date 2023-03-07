import tokens from "@easypost/easy-ui-tokens/js/tokens";
import { getTokenAliases } from "./tokens";

export function createLabelledOptionsControl(
  opts: Record<string, unknown>,
  control = {},
) {
  return {
    options: Object.keys(opts),
    mapping: opts,
    control: {
      type: "select",
      labels: Object.keys(opts).reduce((o, key) => ({ ...o, [key]: key }), {}),
      ...control,
    },
  };
}

export function createFontStyleTokensControl() {
  return getTokensControl("font-style-{alias}-family");
}

export function createColorTokensControl() {
  return getTokensControl("color-{alias}");
}

export function getTokensControl(pattern: string) {
  return createLabelledOptionsControl(
    getTokenAliases(tokens, pattern).reduce(
      (o, alias) => ({ ...o, [alias]: alias }),
      {},
    ),
  );
}
