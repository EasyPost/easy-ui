import { screen } from "@testing-library/react";
import React, { ReactNode } from "react";
import { vi } from "vitest";
import { render, selectCheckbox } from "../utilities/test";
import { Text } from "../Text";
import {
  SplitToggleCard,
  SplitToggleCardProps,
  useSplitToggleCardState,
} from "./SplitToggleCard";

describe("<SplitToggleCard />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("should render a toggle with related content", () => {
    render(
      <SplitToggleCard aria-label="Split Toggle">
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    expect(screen.getByRole("switch")).toBeInTheDocument();
    expect(screen.getByRole("switch")).not.toBeChecked();
    expect(screen.getByText(/toggle label/i)).toBeInTheDocument();
  });

  it("should support uncontrolled", async () => {
    const { user } = render(
      <SplitToggleCard defaultSelected={true} aria-label="Split Toggle">
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    expect(screen.getByRole("switch")).toBeChecked();
    await selectCheckbox(user, screen.getByRole("switch"));
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("should support controlled", async () => {
    const handleChange = vi.fn();
    const { user, rerender } = render(
      <SplitToggleCard
        isSelected={false}
        onChange={handleChange}
        aria-label="Split Toggle"
      >
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    await selectCheckbox(user, screen.getByRole("switch"));
    expect(handleChange).toBeCalled();
    expect(screen.getByRole("switch")).not.toBeChecked();
    rerender(
      <SplitToggleCard
        isSelected={true}
        onChange={handleChange}
        aria-label="Split Toggle"
      >
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("should support isDisabled", () => {
    render(
      <SplitToggleCard isDisabled aria-label="Split Toggle">
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("should support isReadOnly", async () => {
    render(
      <SplitToggleCard isReadOnly aria-label="Split Toggle">
        <Text>Toggle Label</Text>
      </SplitToggleCard>,
    );
    expect(screen.getByRole("switch")).not.toBeChecked();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-readonly", "true");
  });

  describe("composed", () => {
    function Composed(
      props: Partial<SplitToggleCardProps> & {
        status?: ReactNode;
        title?: ReactNode;
      },
    ) {
      const {
        status = <SplitToggleCard.Status on="Enrolled" off="Not enrolled" />,
        title = (
          <SplitToggleCard.Title>Shipping Insurance</SplitToggleCard.Title>
        ),
        ...cardProps
      } = props;
      return (
        <SplitToggleCard {...cardProps}>
          <SplitToggleCard.ToggleContainer>
            <SplitToggleCard.Toggle />
            {status}
          </SplitToggleCard.ToggleContainer>
          <SplitToggleCard.ContentContainer>
            {title}
            <Text>Insure every eligible shipment.</Text>
          </SplitToggleCard.ContentContainer>
        </SplitToggleCard>
      );
    }

    const visibleCopy = (container: HTMLElement) =>
      container.querySelector(`[data-state]:not([class*="hidden"])`);

    it("should name the switch with the title", () => {
      render(<Composed />);
      expect(
        screen.getByRole("switch", { name: "Shipping Insurance" }),
      ).toBeInTheDocument();
      expect(screen.getAllByText("Shipping Insurance")).toHaveLength(1);
    });

    it("should show the status for the current state", async () => {
      const { user, container } = render(<Composed />);
      expect(visibleCopy(container)).toHaveTextContent("Not enrolled");
      await selectCheckbox(user, screen.getByRole("switch"));
      expect(screen.getByRole("switch")).toBeChecked();
      expect(visibleCopy(container)).toHaveTextContent(/^Enrolled$/);
    });

    it("should render both status copies so the panel fits the wider one", () => {
      const { container } = render(<Composed isSelected />);
      const copies = container.querySelectorAll("[data-state]");
      expect(copies).toHaveLength(2);
      expect(copies[0]).toHaveTextContent(/^Enrolled$/);
      expect(copies[1]).toHaveTextContent("Not enrolled");
      expect(copies[1].className).toMatch(/hidden/);
    });

    it("should support a controlled state", async () => {
      const handleChange = vi.fn();
      const { user, container } = render(
        <Composed isSelected onChange={handleChange} />,
      );
      await selectCheckbox(user, screen.getByRole("switch"));
      expect(handleChange).toHaveBeenCalledWith(false);
      expect(screen.getByRole("switch")).toBeChecked();
      expect(visibleCopy(container)).toHaveTextContent(/^Enrolled$/);
    });

    it("should give each status copy the state it draws", async () => {
      function CustomStatus() {
        const { isSelected } = useSplitToggleCardState();
        return <span>{isSelected ? "Yes" : "No"}</span>;
      }
      const { user, container } = render(
        <Composed
          status={
            <SplitToggleCard.Status>
              <CustomStatus />
            </SplitToggleCard.Status>
          }
        />,
      );
      expect(screen.getByText("Yes")).toBeInTheDocument();
      expect(visibleCopy(container)).toHaveTextContent("No");
      await selectCheckbox(user, screen.getByRole("switch"));
      expect(visibleCopy(container)).toHaveTextContent("Yes");
    });

    it("should hide the status from assistive tech by default", () => {
      render(<Composed />);
      expect(screen.getByRole("switch")).not.toHaveAttribute(
        "aria-describedby",
      );
    });

    it("should describe the switch with the status when asked", async () => {
      const { user } = render(
        <Composed
          status={
            <SplitToggleCard.Status
              on="Enrolled"
              off="Not enrolled"
              describesToggle
            />
          }
        />,
      );
      expect(screen.getByRole("switch")).toHaveAccessibleDescription(
        "Not enrolled",
      );
      await selectCheckbox(user, screen.getByRole("switch"));
      expect(screen.getByRole("switch")).toHaveAccessibleDescription(
        "Enrolled",
      );
    });

    it("should let a custom title use titleId", () => {
      function CustomTitle() {
        const { titleId } = useSplitToggleCardState();
        return <h3 id={titleId}>Custom Title</h3>;
      }
      render(<Composed title={<CustomTitle />} />);
      expect(
        screen.getByRole("switch", { name: "Custom Title" }),
      ).toBeInTheDocument();
    });

    it("should let a custom toggle use the card state", async () => {
      function CustomToggle() {
        const { isSelected, toggle } = useSplitToggleCardState();
        return (
          <button type="button" onClick={toggle}>
            {isSelected ? "Turn off" : "Turn on"}
          </button>
        );
      }
      const { user, container } = render(
        <SplitToggleCard>
          <SplitToggleCard.ToggleContainer>
            <CustomToggle />
            <SplitToggleCard.Status on="Enrolled" off="Not enrolled" />
          </SplitToggleCard.ToggleContainer>
          <SplitToggleCard.ContentContainer>
            <Text>Content</Text>
          </SplitToggleCard.ContentContainer>
        </SplitToggleCard>,
      );
      await user.click(screen.getByRole("button", { name: "Turn on" }));
      expect(
        screen.getByRole("button", { name: "Turn off" }),
      ).toBeInTheDocument();
      expect(visibleCopy(container)).toHaveTextContent(/^Enrolled$/);
    });

    it("should support isDisabled and isReadOnly on the root", () => {
      render(<Composed isDisabled isReadOnly />);
      expect(screen.getByRole("switch")).toBeDisabled();
      expect(screen.getByRole("switch")).toHaveAttribute(
        "aria-readonly",
        "true",
      );
    });

    it("should warn when the switch has no name", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<Composed title={null} />);
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining("SplitToggleCard.Toggle has no name"),
      );
      warn.mockRestore();
    });

    it("should render outlined by default", () => {
      const { container } = render(<Composed />);
      expect((container.firstElementChild as HTMLElement).className).toMatch(
        /variantOutlined/,
      );
    });

    it("should render the solid variant without a border", () => {
      const { container } = render(<Composed variant="solid" />);
      expect(
        (container.firstElementChild as HTMLElement).className,
      ).not.toMatch(/variantOutlined/);
    });
  });

  it("should throw when useSplitToggleCardState is used outside a card", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    function Orphan() {
      useSplitToggleCardState();
      return null;
    }
    expect(() => render(<Orphan />)).toThrow(
      "useSplitToggleCardState must be used within a SplitToggleCard component",
    );
    error.mockRestore();
  });
});
