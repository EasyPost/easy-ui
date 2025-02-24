import React from "react";
import { render, screen } from "@testing-library/react";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import { Button } from "./Button";

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

  it("should render a button with an icon", () => {
    render(<Button iconAtStart={CheckCircleIcon} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should apply the primary color class", () => {
    render(<Button />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("colorPrimary"),
    );
  });

  it("should apply the secondary color class", () => {
    render(<Button color="secondary" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("colorSecondary"),
    );
  });

  it("should apply the outlined variant class", () => {
    render(<Button variant="outlined" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("variantOutlined"),
    );
  });

  it("should apply the outlined variant class with a color", () => {
    render(<Button color="warning" variant="outlined" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("variantOutlined"),
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("colorWarning"),
    );
  });

  it("should render a disabled button", () => {
    render(<Button isDisabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should not support className", () => {
    // @ts-expect-error testing className omission
    render(<Button className="extend" />);
    expect(screen.getByRole("button")).not.toHaveAttribute(
      "class",
      expect.stringContaining("extend"),
    );
    // keep existing button class
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("_Button_"),
    );
  });
});
