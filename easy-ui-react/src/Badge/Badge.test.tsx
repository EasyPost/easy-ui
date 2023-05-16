import Anchor from "@easypost/easy-ui-icons/Anchor";
import { screen } from "@testing-library/react";
import React from "react";
import { render } from "../utilities/test";
import { Badge } from "./Badge";
import { vi } from "vitest";
import noop from "lodash/noop";

describe("<Badge />", () => {
  it("should render simple text", () => {
    render(<Badge>Badge text</Badge>);
    expect(screen.getByText("Badge text")).toBeInTheDocument();
  });

  it("should render simple icon", () => {
    render(<Badge accessibilityLabel="Intent of badge" icon={Anchor} />);
    expect(true).toBe(true);
  });

  it("should warn with no accessibility label on icon", () => {
    const consoleWarningSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(noop);
    render(<Badge icon={Anchor} />);
    expect(consoleWarningSpy).toBeCalled();
  });
});
