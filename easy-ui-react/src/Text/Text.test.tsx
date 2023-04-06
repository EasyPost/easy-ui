import { render, screen } from "@testing-library/react";
import React from "react";
import { getComponentThemeToken } from "../utilities/css";
import { Text } from "./Text";

describe("<Text />", () => {
  it("should render text", () => {
    render(<Text>Here is some text</Text>);
    expect(screen.getByText("Here is some text")).toBeInTheDocument();
  });

  it("should render as <p> element", () => {
    render(<Text as="p">Here is some text</Text>);
    expect(screen.getByText("Here is some text").tagName).toBe("P");
  });

  it("should apply alignment", () => {
    render(<Text alignment="center">Here is some text</Text>);
    expect(screen.getByText("Here is some text")).toHaveAttribute(
      "class",
      expect.stringContaining("center"),
    );
  });

  it("should apply truncation", () => {
    const text =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt vel lorem nec pretium. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi sollicitudin ex nec imperdiet pellentesque. Etiam dapibus ipsum non ligula molestie rhoncus. Vivamus eget iaculis lectus. Sed porttitor leo at nulla mollis malesuada. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum vestibulum porttitor mollis. Nam dictum ante sed lobortis commodo. Ut luctus ut metus vel bibendum.";
    render(<Text truncate>{text}</Text>);
    expect(screen.getByText(text)).toHaveAttribute(
      "class",
      expect.stringContaining("truncate"),
    );
  });

  it("should apply variant", () => {
    render(<Text variant="heading1">Here is some text</Text>);
    expect(screen.getByText("Here is some text")).toHaveAttribute(
      "class",
      expect.stringContaining("heading1"),
    );
  });

  it("should apply id", () => {
    render(<Text id="unique-id">Here is some text</Text>);
    expect(screen.getByText("Here is some text")).toHaveAttribute(
      "id",
      "unique-id",
    );
  });

  it("should apply color", () => {
    render(<Text color="disabled">Here is some text</Text>);
    expect(screen.getByText("Here is some text")).toHaveStyle(
      getComponentThemeToken("text", "color", "color.text", "disabled"),
    );
  });

  it("should apply weight", () => {
    render(<Text weight="bold">Here is some text</Text>);
    expect(screen.getByText("Here is some text")).toHaveAttribute(
      "class",
      expect.stringContaining("bold"),
    );
  });

  it("should apply word break", () => {
    render(<Text breakWord>Here is some text</Text>);
    expect(screen.getByText("Here is some text")).toHaveAttribute(
      "class",
      expect.stringContaining("break"),
    );
  });

  it("should nest", () => {
    render(
      <Text variant="body1">
        Here is some text with <Text weight="bold">inner text</Text>
      </Text>,
    );
    expect(screen.getByText("inner text")).toBeInTheDocument();
  });

  it("should apply visuallyHidden", () => {
    render(<Text visuallyHidden>Here is some text</Text>);
    expect(screen.getByText("Here is some text")).toHaveAttribute(
      "class",
      expect.stringContaining("visuallyHidden"),
    );
  });
});
