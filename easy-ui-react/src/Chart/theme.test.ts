import { themedOption } from "./theme";

it("replaces the default palette with the caller's complete palette without mutating it", () => {
  const element = document.createElement("div");
  const color = Object.freeze(["#ff0000", "#0000ff"]);
  for (const palette of [color, []]) {
    const option = { color: [...palette] };
    expect(themedOption(element, option, false).color).toEqual(palette);
    expect(
      themedOption(element, { baseOption: option }, false).baseOption?.color,
    ).toEqual(palette);
    expect(option.color).toEqual(palette);
  }
  expect(themedOption(element, {}, false).color).toHaveLength(6);
});
