import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import React, { SVGProps } from "react";
import { Button } from "../Button";
import { PlaceholderBox } from "../utilities/storybook";
import { Modal } from "./Modal";
import { ModalTrigger } from "./ModalTrigger";

type ModalStory = StoryObj<typeof Modal>;
type ModalTriggerStory = StoryObj<typeof ModalTrigger>;

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  parameters: {
    controls: {
      exclude: ["children"],
    },
  },
};

export default meta;

export const Simple: ModalStory = {
  render: () => (
    <Modal.Trigger onOpenChange={action("Modal open state changed!")}>
      <Button>Open modal</Button>
      <Modal>
        <Modal.Header>H4 Title</Modal.Header>
        <Modal.Body>
          <PlaceholderBox width="100%">Space for content</PlaceholderBox>
        </Modal.Body>
        <Modal.Footer
          primaryAction={{
            content: "Button 1",
            onAction: action("Button 1 clicked!"),
          }}
        />
      </Modal>
    </Modal.Trigger>
  ),
};

export const Advanced: ModalStory = {
  render: () => (
    <Modal.Trigger onOpenChange={action("Modal open state changed!")}>
      <Button>Open modal</Button>
      {(close) => (
        <Modal>
          <Modal.Header
            iconAtStart={{
              accessibilityLabel: "EasyPost Logo",
              symbol: EasyPostLogo,
            }}
            iconAtEnd={{
              accessibilityLabel: "Stripe Logo",
              symbol: StripeLogo,
              size: "2xl",
            }}
            subtitle="Optional subtitle"
          >
            H4 Title
          </Modal.Header>
          <Modal.Body>
            <PlaceholderBox width="100%" height={800}>
              Space for content
            </PlaceholderBox>
          </Modal.Body>
          <Modal.Footer
            primaryAction={{
              content: "Button 1",
              onAction: () => {
                action("Button 1 clicked!")();
                close();
              },
            }}
            secondaryAction={{
              content: "Optional Button 2",
              onAction: () => {
                action("Button 2 clicked!")();
                close();
              },
            }}
          />
        </Modal>
      )}
    </Modal.Trigger>
  ),
};

export const Nondismissable: ModalTriggerStory = {
  render: (args) => (
    <Modal.Trigger isDismissable={args.isDismissable}>
      <Button>Open modal</Button>
      {(close) => (
        <Modal>
          <Modal.Header>H4 Title</Modal.Header>
          <Modal.Body>
            <PlaceholderBox width="100%">Space for content</PlaceholderBox>
          </Modal.Body>
          <Modal.Footer
            primaryAction={{
              content: "Button 1",
              onAction: () => {
                action("Button 1 clicked!");
                close();
              },
            }}
          />
        </Modal>
      )}
    </Modal.Trigger>
  ),
  args: {
    isDismissable: false,
  },
  parameters: {
    controls: { include: ["isDismissable"] },
  },
};

export const CustomSize: ModalStory = {
  render: (args) => (
    <Modal.Trigger>
      <Button>Open modal</Button>
      <Modal size={args.size}>
        <Modal.Header>H4 Title</Modal.Header>
        <Modal.Body>
          <PlaceholderBox width="100%">Space for content</PlaceholderBox>
        </Modal.Body>
        <Modal.Footer
          primaryAction={{
            content: "Button 1",
            onAction: action("Button 1 clicked!"),
          }}
        />
      </Modal>
    </Modal.Trigger>
  ),
  args: {
    size: "sm",
  },
  parameters: {
    controls: { include: ["size"] },
  },
};

export const DefaultOpen: ModalTriggerStory = {
  render: (args) => (
    <Modal.Trigger {...args} onOpenChange={action("Open state changed!")}>
      <Button>Open modal</Button>
      <Modal>
        <Modal.Header>H4 Title</Modal.Header>
        <Modal.Body>
          <PlaceholderBox width="100%">Space for content</PlaceholderBox>
        </Modal.Body>
        <Modal.Footer
          primaryAction={{
            content: "Button 1",
            onAction: action("Button 1 clicked!"),
          }}
        />
      </Modal>
    </Modal.Trigger>
  ),
  args: {
    defaultOpen: true,
  },
  parameters: {
    controls: { include: ["defaultOpen"] },
  },
};

export const Controlled: ModalTriggerStory = {
  render: (args) => (
    <Modal.Trigger {...args} onOpenChange={action("Open state changed!")}>
      <Button>Open modal</Button>
      <Modal>
        <Modal.Header>H4 Title</Modal.Header>
        <Modal.Body>
          <PlaceholderBox width="100%">Space for content</PlaceholderBox>
        </Modal.Body>
        <Modal.Footer
          primaryAction={{
            content: "Button 1",
            onAction: action("Button 1 clicked!"),
          }}
        />
      </Modal>
    </Modal.Trigger>
  ),
  args: {
    isOpen: true,
  },
  parameters: {
    controls: { include: ["isOpen"] },
  },
};

function EasyPostLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="28"
      height="31"
      viewBox="0 0 28 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.6677 18.4521C13.434 18.4521 13.2575 18.4222 13.0536 18.3052L6.83383 14.6919V17.8644L13.0536 21.4801C13.2575 21.5972 13.434 21.627 13.6677 21.627C13.874 21.627 14.1077 21.5673 14.2842 21.4801L27.3378 13.8976V17.0725L14.2842 24.6227C14.1077 24.7397 13.9038 24.7995 13.6677 24.7995C13.4638 24.7995 13.2575 24.7397 13.0536 24.6227L6.83383 21.0394V24.1819L13.0536 27.7977C13.2575 27.9147 13.4638 27.9446 13.6677 27.9446C13.9038 27.9446 14.1375 27.8848 14.2842 27.7977L27.3378 20.245V22.2421C27.3378 22.9493 26.9574 23.6241 26.3409 23.9777L14.6645 30.736C14.3737 30.9104 14.0207 31 13.6677 31C13.3171 31 12.994 30.9104 12.6708 30.736L0.996861 23.9777C0.38035 23.6241 0 22.9493 0 22.2421V8.7554C0 8.0208 0.38035 7.34597 0.996861 6.99237L12.6708 0.263956C12.994 0.0896452 13.3171 0 13.6677 0C14.0207 0 14.3737 0.0896452 14.6645 0.263956L26.3409 6.99237C26.9574 7.34597 27.3378 8.0208 27.3378 8.7554V10.755L14.2842 18.3052C14.1077 18.3948 13.874 18.4521 13.6677 18.4521Z"
        fill="#164DFF"
      />
    </svg>
  );
}

function StripeLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="36"
      height="15"
      viewBox="0 0 36 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35.6922 7.70287C35.6922 5.28669 34.4734 3.38018 32.1439 3.38018C29.8046 3.38018 28.3892 5.28669 28.3892 7.684C28.3892 10.5249 30.0602 11.9595 32.4585 11.9595C33.6281 11.9595 34.5127 11.7047 35.1811 11.346V9.45838C34.5127 9.77928 33.7461 9.97748 32.773 9.97748C31.8196 9.97748 30.9743 9.65658 30.8662 8.54287H35.6726C35.6726 8.42018 35.6922 7.92939 35.6922 7.70287ZM30.8367 6.80624C30.8367 5.73973 31.5149 5.29613 32.1341 5.29613C32.7337 5.29613 33.3726 5.73973 33.3726 6.80624H30.8367ZM24.5952 3.38018C23.632 3.38018 23.0127 3.81433 22.6687 4.11636L22.541 3.53119H20.3786V14.5361L22.8358 14.0359L22.8456 11.3649C23.1995 11.6103 23.7204 11.9595 24.5854 11.9595C26.3448 11.9595 27.9469 10.6004 27.9469 7.60849C27.9371 4.87141 26.3153 3.38018 24.5952 3.38018ZM24.0055 9.8831C23.4256 9.8831 23.0815 9.6849 22.8456 9.4395L22.8358 5.93793C23.0914 5.66422 23.4452 5.47546 24.0055 5.47546C24.8999 5.47546 25.5192 6.43815 25.5192 7.67456C25.5192 8.93928 24.9098 9.8831 24.0055 9.8831ZM16.9974 2.82332L19.4645 2.31366V0.397705L16.9974 0.89793V2.82332ZM16.9974 3.54063H19.4645V11.7991H16.9974V3.54063ZM14.3533 4.23905L14.1961 3.54063H12.073V11.7991H14.5303V6.2022C15.1102 5.47546 16.0931 5.60759 16.3978 5.71141V3.54063C16.0833 3.42737 14.9333 3.21973 14.3533 4.23905ZM9.43881 1.49254L7.04052 1.98332L7.03069 9.54332C7.03069 10.9402 8.12172 11.9689 9.57642 11.9689C10.3824 11.9689 10.9721 11.8274 11.2965 11.6575V9.74152C10.982 9.86422 9.42899 10.2984 9.42899 8.90152V5.55096H11.2965V3.54063H9.42899L9.43881 1.49254ZM2.79437 5.93793C2.79437 5.56984 3.1089 5.42827 3.62984 5.42827C4.37685 5.42827 5.32044 5.64535 6.06745 6.03231V3.81433C5.25163 3.50287 4.44565 3.38018 3.62984 3.38018C1.63454 3.38018 0.307617 4.38063 0.307617 6.05119C0.307617 8.65613 4.04266 8.24085 4.04266 9.364C4.04266 9.79815 3.6495 9.93973 3.09907 9.93973C2.28326 9.93973 1.24138 9.61883 0.415737 9.18467V11.431C1.32984 11.8085 2.25377 11.9689 3.09907 11.9689C5.14351 11.9689 6.54907 10.9968 6.54907 9.30737C6.53924 6.49478 2.79437 6.99501 2.79437 5.93793Z"
        fill="#635BFF"
      />
    </svg>
  );
}
