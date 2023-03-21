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

  it("should apply the success color class", () => {
    render(<Button color="success" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Success"),
    );
  });

  it("should apply the warning color class", () => {
    render(<Button color="warning" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Warning"),
    );
  });

  it("should apply the neutral color class", () => {
    render(<Button color="neutral" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Neutral"),
    );
  });

  it("should apply the support color class", () => {
    render(<Button color="support" variant="outlined" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Support"),
    );
  });

  it("should apply the inverse color class", () => {
    render(<Button color="inverse" variant="outlined" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Inverse"),
    );
  });

  it("should apply the outlined variant class", () => {
    render(<Button variant="outlined" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Outlined"),
    );
  });

  it("should apply the link variant class", () => {
    render(<Button variant="link" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("Link"),
    );
  });

  it("should apply the disabled attribute", () => {
    render(<Button isDisabled />);
    expect(screen.getByRole("button")).toHaveAttribute("disabled");
  });
});
