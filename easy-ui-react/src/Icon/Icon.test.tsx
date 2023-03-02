import React from "react";
import { render, screen } from "@testing-library/react";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";

import { Icon } from "./Icon";

describe("<Icon />", async () => {
  it("should render an accessible icon", () => {
    render(
      <Icon symbol={CheckCircleIcon} accessibilityLabel="Checkmark icon" />,
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByTitle("Checkmark icon")).toBeInTheDocument();
  });

  it("should render an inaccessible icon", () => {
    render(<Icon symbol={CheckCircleIcon} />);
    expect(
      screen.getByRole("presentation", { hidden: true }),
    ).toBeInTheDocument();
  });
});
