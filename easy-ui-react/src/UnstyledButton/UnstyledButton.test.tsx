import React from "react";
import { render, screen } from "@testing-library/react";
import { Icon } from "../Icon";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import { UnstyledButton } from "./UnstyledButton";

describe("<UnstyledButton />", () => {
  it("should render an unstyled button", () => {
    render(<UnstyledButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should render an unstyled button with text", () => {
    render(<UnstyledButton>Testing</UnstyledButton>);
    expect(screen.getByText(/testing/i)).toBeInTheDocument();
  });

  it("should render an anchor tag", () => {
    render(
      <UnstyledButton href="https://www.easypost.com/">Testing</UnstyledButton>,
    );
    expect(screen.getByText(/testing/i).closest("a")).toHaveAttribute(
      "href",
      "https://www.easypost.com/",
    );
  });

  it("should render an unstyled button with an icon", () => {
    render(
      <UnstyledButton>
        <Icon symbol={CheckCircleIcon} />
      </UnstyledButton>,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should apply the supplied class", () => {
    render(
      <UnstyledButton className="colorPrimary_123">Button</UnstyledButton>,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("colorPrimary"),
    );
  });

  it("should render a disabled button", () => {
    render(<UnstyledButton isDisabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should apply the default class", () => {
    render(
      <UnstyledButton className="colorPrimary_123">Button</UnstyledButton>,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("UnstyledButton"),
    );
  });
});
