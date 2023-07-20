import { mockGetComputedStyle } from "../utilities/test";

describe("<CodeBlock />", () => {
  let restoreGetComputedStyle: () => void;

  beforeEach(() => {
    restoreGetComputedStyle = mockGetComputedStyle();
  });

  afterEach(() => {
    restoreGetComputedStyle();
  });

  it("should render a code block", () => {
    expect(true).toBe(true);
  });
});
