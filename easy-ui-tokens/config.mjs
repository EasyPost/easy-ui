import { getTypeScriptType, fileHeader } from "style-dictionary/utils";

export default {
  source: ["./src/**/*.json", "./src/**/*.jsonc"],
  platforms: {
    scss: {
      transformGroup: "ezui-scss",
      prefix: "ezui",
      files: [
        {
          format: "scss/variables",
          destination: "dist/scss/variables.scss",
        },
      ],
    },
    scssMap: {
      transformGroup: "ezui-scss",
      files: [
        {
          format: "scss/map-flat",
          destination: "dist/scss/map.scss",
          options: {
            mapName: "ezui-tokens",
          },
        },
      ],
    },
    css: {
      transformGroup: "ezui-css",
      prefix: "ezui",
      files: [
        {
          format: "css/variables",
          destination: "dist/css/variables.css",
        },
      ],
    },
    js: {
      transformGroup: "ezui-js",
      files: [
        {
          format: "javascript/module-flat",
          destination: "dist/js/tokens.js",
        },
        {
          format: "ezui/javascript/es6-flat",
          destination: "dist/js/tokens.mjs",
        },
        {
          format: "ezui/typescript/flat-declarations",
          destination: "dist/js/tokens.d.ts",
        },
      ],
    },
    json: {
      transformGroup: "ezui-js",
      files: [
        {
          format: "json/flat",
          destination: "dist/json/tokens.json",
        },
      ],
    },
  },
  hooks: {
    formats: {
      "ezui/javascript/es6-flat": async ({ dictionary, file }) => {
        const header = await fileHeader({ file });
        return [
          header,
          "export default {",
          ...dictionary.allTokens.map(
            (prop) => `  "${prop.name}": ${getTokenValue(prop.value)},`,
          ),
          "};",
          "",
        ].join("\n");
      },
      "ezui/typescript/flat-declarations": async ({ dictionary, file }) => {
        const header = await fileHeader({ file });
        return [
          header,
          "declare const tokens: {",
          ...dictionary.allTokens.map(
            (prop) => `  "${prop.name}": ${getTokenValueType(prop.value)};`,
          ),
          "}",
          "export default tokens;",
          "",
        ].join("\n");
      },
    },
    transforms: {
      "ezui/unit/em": createEmLikeTransform("em"),
      "ezui/unit/rem": createEmLikeTransform("rem"),
      "ezui/font/parenthesis": {
        type: "value",
        filter(token) {
          return (
            token.name.includes("font") &&
            token.name.includes("family") &&
            token.original.value.includes(",")
          );
        },
        transform(token) {
          return `(${token.original.value})`;
        },
      },
      "ezui/name/cti": {
        type: "name",
        transform: function (token, options) {
          return [options.prefix]
            .concat(token.path)
            .filter((t) => Boolean(t))
            .join(".");
        },
      },
    },
    transformGroups: {
      "ezui-scss": [
        "attribute/cti",
        "name/kebab",
        "time/seconds",
        "html/icon",
        "color/css",
        "ezui/unit/rem",
        "ezui/unit/em",
        "ezui/font/parenthesis",
      ],
      "ezui-css": [
        "attribute/cti",
        "name/kebab",
        "time/seconds",
        "html/icon",
        "color/css",
        "ezui/unit/rem",
        "ezui/unit/em",
      ],
      "ezui-js": ["attribute/cti", "ezui/name/cti", "color/hex"],
    },
  },
};

// Only supports converting from "px" for now
// token: { "attributes": { "unit": "rem" } }
function createEmLikeTransform(unit) {
  return {
    type: "value",
    filter(token) {
      return (
        token.attributes.unit === unit && token.original.value.endsWith("px")
      );
    },
    transform(token) {
      const valueAsFloat = parseFloat(token.original.value);
      const valueAsRem = valueAsFloat / 16;
      return `${valueAsRem}${unit}`;
    },
  };
}

function escapeQuotes(str) {
  return str.replace(/(["])/g, "\\$1");
}

function getTokenValueType(value) {
  return typeof value === "string"
    ? `"${escapeQuotes(value)}"`
    : getTypeScriptType(value);
}

function getTokenValue(value) {
  return typeof value === "string" ? `"${escapeQuotes(value)}"` : value;
}
