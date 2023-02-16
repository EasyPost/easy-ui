module.exports = {
  source: ["./src/**/*.json"],
  transform: {
    "ezui/unit/em": createEmLikeTransform("em"),
    "ezui/unit/rem": createEmLikeTransform("rem"),
    "ezui/font/parenthesis": {
      type: "value",
      matcher(token) {
        return (
          token.name.includes("ezui-font") &&
          token.name.includes("family") &&
          token.original.value.includes(",")
        );
      },
      transformer(token) {
        return `(${token.original.value})`;
      },
    },
  },
  platforms: {
    css: {
      transforms: [
        "attribute/cti",
        "name/cti/kebab",
        "time/seconds",
        "content/icon",
        "size/rem",
        "color/css",
        "ezui/unit/rem",
        "ezui/unit/em",
      ],
      prefix: "ezui",
      files: [
        {
          format: "css/variables",
          destination: "dist/css/variables.css",
        },
      ],
    },
    js: {
      transforms: ["attribute/cti", "name/cti/kebab", "size/rem", "color/hex"],
      files: [
        {
          format: "javascript/module-flat",
          destination: "dist/js/tokens.js",
        },
      ],
    },
    json: {
      transforms: ["attribute/cti", "name/cti/kebab", "size/rem", "color/hex"],
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
