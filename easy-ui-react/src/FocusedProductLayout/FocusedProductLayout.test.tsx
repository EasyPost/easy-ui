import { getAllByRole, screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { Menu } from "../Menu";
import { Stepper } from "../Stepper";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
  userClick,
} from "../utilities/test";
import {
  FocusedProductLayout,
  FocusedProductLayoutProps,
} from "./FocusedProductLayout";

describe("<FocusedProductLayout />", () => {
  let restoreGetComputedStyle: () => void;
  let restoreIntersectionObserver: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    restoreIntersectionObserver = mockIntersectionObserver();
    restoreGetComputedStyle = mockGetComputedStyle();
  });

  afterEach(() => {
    restoreGetComputedStyle();
    restoreIntersectionObserver();
    vi.useRealTimers();
  });

  it("should render a focused product layout", async () => {
    const handleHelpMenuAction = vi.fn();
    const handleBackArrowClick = vi.fn();

    const { user } = render(
      createFocusedProductLayout({
        onHelpMenuAction: handleHelpMenuAction,
        renderBackArrow: (props) => (
          <button {...props} onClick={handleBackArrowClick} />
        ),
      }),
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Account Settings" }),
    ).toBeInTheDocument();

    await userClick(user, screen.getByRole("button", { name: "Back" }));
    expect(handleBackArrowClick).toBeCalled();

    await userClick(user, screen.getByRole("button", { name: "Help" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await userClick(
      user,
      screen.getByRole("menuitem", { name: "Documentation" }),
    );
    expect(handleHelpMenuAction).toBeCalled();
  });

  it("should render a wizard focused product layout", async () => {
    const handleStepPressAction = vi.fn();
    const handlePreviousAction = vi.fn();
    const handleNextAction = vi.fn();

    const { user } = render(
      createFocusedProductLayout({
        sidePanel: null,
        content: (
          <FocusedProductLayout.WizardContent
            activeStepIndex={1}
            steps={["Step 1", "Step 2", "Step 3", "Step 4"].map(
              (step, index) => (
                <Stepper.Step
                  key={step}
                  stepIndex={index}
                  onPress={handleStepPressAction}
                  isComplete={index < 1}
                  isAccessible={false}
                >
                  {step}
                </Stepper.Step>
              ),
            )}
            previousAction={{
              content: "Back",
              onAction: handlePreviousAction,
            }}
            nextAction={{
              content: "Next",
              onAction: handleNextAction,
            }}
          >
            Wizard Content
          </FocusedProductLayout.WizardContent>
        ),
      }),
    );

    expect(screen.getByText("Wizard Content")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Account Settings" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();

    await userClick(user, screen.getByRole("button", { name: "Next" }));
    expect(handleNextAction).toBeCalled();

    const [, stepperBackButton] = screen.getAllByRole("button", {
      name: "Back",
    });
    await userClick(user, stepperBackButton);
    expect(handlePreviousAction).toBeCalled();

    const stepButtons = getAllByRole(
      screen.getByTestId("focused-product-layout-wizard-content-stepper"),
      "button",
    );
    await userClick(user, stepButtons[0]);
    expect(handleStepPressAction).toBeCalled();
  });
});

function createFocusedProductLayout(
  props: {
    content?: FocusedProductLayoutProps["content"];
    sidePanel?: FocusedProductLayoutProps["sidePanel"];
    sidePanelPosition?: FocusedProductLayoutProps["sidePanelPosition"];
    renderBackArrow?: FocusedProductLayoutProps["renderBackArrow"];
    onHelpMenuAction?: () => void;
  } = {},
) {
  const {
    content = (
      <FocusedProductLayout.Content>
        <div>Content</div>
      </FocusedProductLayout.Content>
    ),
    sidePanel = (
      <FocusedProductLayout.SidePanel>
        <div>Side panel content</div>
      </FocusedProductLayout.SidePanel>
    ),
    renderBackArrow = (props) => <button {...props} onClick={() => {}} />,
    onHelpMenuAction = vi.fn(),
  } = props;
  return (
    <FocusedProductLayout
      title={<>Account Settings</>}
      helpMenuItems={[<Menu.Item key="1">Documentation</Menu.Item>]}
      onHelpMenuAction={onHelpMenuAction}
      renderBackArrow={renderBackArrow}
      renderLogo={() => <div />}
      content={content}
      sidePanel={sidePanel}
    />
  );
}
