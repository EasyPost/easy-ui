const { formatHelpers, format } = require("style-dictionary");

module.exports = {
  source: ["./src/**/*.json", "./src/**/*.jsonc"],
  transform: {
    "ezui/unit/em": createEmLikeTransform("em"),
    "ezui/unit/rem": createEmLikeTransform("rem"),
    "ezui/font/parenthesis": {
      type: "value",
      matcher(token) {
        return (
          token.name.includes("font") &&
          token.name.includes("family") &&
          token.original.value.includes(",")
        );
      },
      transformer(token) {
        return `(${token.original.value})`;
      },
    },
    "ezui/name/cti": {
      type: "name",
      transformer: function (token, options) {
        return [options.prefix]
          .concat(token.path)
          .filter((t) => Boolean(t))
          .join(".");
      },
    },
  },
  format: {
    "ezui/javascript/es6-flat": function ({ dictionary, file }) {
      return (
        formatHelpers.fileHeader({ file }) +
        "export default " +
        format["json/flat"]({ dictionary }) +
        ";"
      );
    },
    "ezui/typescript/flat-declarations": ({ dictionary, file }) =>
      [
        formatHelpers.fileHeader({ file }),
        "declare const tokens: {",
        ...dictionary.allProperties.map(
          (prop) => `  "${prop.name}": ${getPropValueType(prop.value)};`,
        ),
        "}",
        "export default tokens;",
      ].join("\n"),
  },
  transformGroup: {
    "ezui-scss": [
      "attribute/cti",
      "name/cti/kebab",
      "time/seconds",
      "content/icon",
      "color/css",
      "ezui/unit/rem",
      "ezui/unit/em",
      "ezui/font/parenthesis",
    ],
    "ezui-css": [
      "attribute/cti",
      "name/cti/kebab",
      "time/seconds",
      "content/icon",
      "color/css",
      "ezui/unit/rem",
      "ezui/unit/em",
    ],
    "ezui-js": ["attribute/cti", "ezui/name/cti", "color/hex"],
  },
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
          mapName: "ezui-tokens",
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
};

// Only supports converting from "px" for now
// token: { "attributes": { "unit": "rem" } }
function createEmLikeTransform(unit) {
  return {
    type: "value",
    matcher(token) {
      return (
        token.attributes.unit === unit && token.original.value.endsWith("px")
      );
    },
    transformer(token) {
      const valueAsFloat = parseFloat(token.original.value);
      const valueAsRem = valueAsFloat / 16;
      return `${valueAsRem}${unit}`;
    },
  };
}

function escapeQuotes(str) {
  return str.replace(/(["])/g, "\\$1");
}

function getPropValueType(value) {
  return typeof value === "string"
    ? `"${escapeQuotes(value)}"`
    : formatHelpers.getTypeScriptType(value);
}
