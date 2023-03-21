import React from "react";
import { render, screen } from "@testing-library/react";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import { Button } from "./Button";
import { Icon } from "../Icon";

describe("<Button />", () => {
  it("should render a button", () => {
    render(<Button />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should render a button with text", () => {
    render(<Button>Testing</Button>);
    expect(screen.getByText(/testing/i)).toBeInTheDocument();
  });

  it("should render an anchor tag", () => {
    render(<Button href="https://www.easypost.com/">Testing</Button>);
    expect(screen.getByText(/testing/i).closest("a")).toHaveAttribute(
      "href",
      "https://www.easypost.com/",
    );
  });

  it("should render a button with a left aligned icon", () => {
    render(<Button iconAtStart={<Icon symbol={CheckCircleIcon} />} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should render a button with a right aligned icon", () => {
    render(<Button iconAtEnd={<Icon symbol={CheckCircleIcon} />} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should apply the primary color class", () => {
    render(<Button />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Primary"),
    );
  });

  it("should apply the secondary color class", () => {
    render(<Button color="secondary" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Secondary"),
    );
  });

  it("should apply the outlined variant class", () => {
    render(<Button variant="outlined" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Outlined"),
    );
  });

  it("should apply the disabled attribute", () => {
    render(<Button isDisabled />);
    expect(screen.getByRole("button")).toHaveAttribute("disabled");
  });
});
