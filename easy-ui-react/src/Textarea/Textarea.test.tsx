import SearchIcon from "@easypost/easy-ui-icons/Search";
import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { render, userType } from "../utilities/test";
import { Textarea } from "./Textarea";

describe("<Textarea />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a standard textarea", () => {
    render(<Textarea label="label" />);
    expect(
      screen.getByLabelText("label", { selector: "textarea" }),
    ).toBeInTheDocument();
  });

  it("should render a textarea with placeholder text", () => {
    render(<Textarea label="label" placeholder="enter description" />);
    expect(
      screen.getByPlaceholderText("enter description"),
    ).toBeInTheDocument();
  });

  it("should render a disabled textarea", () => {
    render(<Textarea label="label" isDisabled />);
    expect(
      screen.getByLabelText("label", { selector: "textarea" }),
    ).toBeDisabled();
  });

  it("should render a textarea with helperText", () => {
    render(<Textarea label="label" helperText="Optional helper text" />);
    expect(screen.getByText("Optional helper text")).toBeInTheDocument();
  });

  it("should render a textarea with errorText", () => {
    render(
      <Textarea
        label="label"
        errorText="Optional error text"
        validationState="invalid"
      />,
    );
    expect(screen.getByText("Optional error text")).toBeInTheDocument();
  });

  it("should render a textarea that displays a label with emphasis", () => {
    render(<Textarea label="label" isLabelEmphasized />);
    expect(screen.getByText("label")).toBeInTheDocument();
    expect(screen.getByText("label").tagName).toBe("STRONG");
  });

  it("should support passing through properties", async () => {
    const handleChange = vi.fn();
    const { user } = render(
      <Textarea
        label="label"
        defaultValue="test"
        onChange={handleChange}
        data-custom-attribute="text"
      />,
    );
    expect(screen.getByLabelText("label")).toHaveValue("test");
    const textField = screen.getByLabelText("label");
    await userType(user, textField, "value");
    expect(handleChange).toBeCalled();
    expect(screen.getByLabelText("label")).toHaveAttribute(
      "data-custom-attribute",
    );
  });

  it("should render an icon at the start", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Textarea label="label" iconAtStart={SearchIcon} />);
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  describe("autoGrow", () => {
    // jsdom has no layout, so stub the metrics the auto-grow hook reads: 24px
    // lines, 11px padding, and 1px borders, so one row is 48px tall.
    let scrollHeight = 0;
    beforeEach(() => {
      const metrics: Record<string, string> = {
        boxSizing: "border-box",
        lineHeight: "24px",
        paddingTop: "11px",
        paddingBottom: "11px",
        borderTopWidth: "1px",
        borderBottomWidth: "1px",
      };
      const getComputedStyle = window.getComputedStyle.bind(window);
      vi.spyOn(window, "getComputedStyle").mockImplementation((el) => {
        const style = getComputedStyle(el);
        return new Proxy(style, {
          get: (target, prop) =>
            typeof prop === "string" && prop in metrics
              ? metrics[prop]
              : Reflect.get(target, prop, target),
        });
      });
      vi.spyOn(
        HTMLTextAreaElement.prototype,
        "scrollHeight",
        "get",
      ).mockImplementation(() => scrollHeight);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should grow to fit its content", () => {
      scrollHeight = 22 + 24 * 2;
      render(<Textarea label="label" autoGrow maxRows={4} />);
      const textarea = screen.getByLabelText("label");
      expect(textarea).toHaveStyle({ height: "72px", overflowY: "hidden" });
    });

    it("should cap its height at maxRows and scroll", () => {
      scrollHeight = 22 + 24 * 6;
      render(<Textarea label="label" autoGrow maxRows={4} />);
      const textarea = screen.getByLabelText("label");
      expect(textarea).toHaveStyle({ height: "120px", overflowY: "auto" });
    });

    it("should resize as the user types", async () => {
      scrollHeight = 22 + 24;
      const { user } = render(<Textarea label="label" autoGrow maxRows={4} />);
      const textarea = screen.getByLabelText("label");
      expect(textarea).toHaveStyle({ height: "48px" });
      scrollHeight = 22 + 24 * 3;
      await userType(user, textarea, "a");
      expect(textarea).toHaveStyle({ height: "96px" });
    });

    it("should resize when a controlled value changes", () => {
      scrollHeight = 22 + 24;
      const { rerender } = render(
        <Textarea
          label="label"
          autoGrow
          maxRows={4}
          value=""
          onChange={() => {}}
        />,
      );
      const textarea = screen.getByLabelText("label");
      expect(textarea).toHaveStyle({ height: "48px" });
      scrollHeight = 22 + 24 * 2;
      rerender(
        <Textarea
          label="label"
          autoGrow
          maxRows={4}
          value="a"
          onChange={() => {}}
        />,
      );
      expect(textarea).toHaveStyle({ height: "72px" });
    });

    it("should grow without limit when maxRows is omitted", () => {
      scrollHeight = 22 + 24 * 20;
      render(<Textarea label="label" autoGrow />);
      const textarea = screen.getByLabelText("label");
      expect(textarea).toHaveStyle({ height: "504px", overflowY: "hidden" });
    });

    it("should leave the height alone without autoGrow", () => {
      scrollHeight = 22 + 24 * 6;
      render(<Textarea label="label" />);
      expect(screen.getByLabelText("label").style.height).toBe("");
    });

    it("should warn and ignore maxRows without autoGrow in untyped code", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      scrollHeight = 22 + 24 * 6;
      // @ts-expect-error `maxRows` requires `autoGrow`
      render(<Textarea label="label" maxRows={4} />);
      expect(screen.getByLabelText("label").style.height).toBe("");
      expect(warn).toHaveBeenCalledWith(
        "`maxRows` has no effect without `autoGrow`",
      );
    });
  });
});
