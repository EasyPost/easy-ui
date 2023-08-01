import CloseIcon from "@easypost/easy-ui-icons/Close";
import { FocusableElement } from "@react-types/shared";
import React, {
  DOMAttributes,
  ElementRef,
  ReactElement,
  ReactNode,
  RefObject,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Overlay,
  useDialog,
  useModalOverlay,
  useOverlayTrigger,
} from "react-aria";
import { OverlayTriggerState, useOverlayTriggerState } from "react-stately";
import { Button } from "../Button";
import { HorizontalStack } from "../HorizontalStack";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";
import { useScrollbar } from "./useScrollbar";

import styles from "./Modal.module.scss";

type HeaderElementType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type ModalSize = "sm" | "md" | "lg";

export type ModalClose = (close: () => void) => ReactElement;

type ModalProps = {
  /**
   * Content of the modal.
   */
  children: ReactNode;

  /**
   * Size of the modal.
   *
   * @default "lg"
   */
  size?: ModalSize;
};

type ModalHeaderProps = {
  /**
   * Modal header element type. Should be a valid document heading level.
   *
   * @default "h2"
   */
  as?: HeaderElementType;

  /**
   * The content for the title of the modal.
   */
  children: string;

  /**
   * The content for the subtitle of the modal.
   */
  subtitle?: string;

  /**
   * Icon to display at the start of the header title.
   */
  iconAtStart?: {
    accessibilityLabel?: string;
    symbol: IconSymbol;
  };

  /**
   * Icon to display at the end of the header title.
   */
  iconAtEnd?: {
    accessibilityLabel?: string;
    symbol: IconSymbol;
    size?: "md" | "2xl";
  };
};

type ModalBodyProps = {
  /**
   * Modal body content.
   */
  children: ReactNode;
};

type ModalFooterProps = {
  /**
   * Primary action slot.
   */
  primaryAction: {
    content: string;
    onAction: () => void;
  };

  /**
   * Secondary action slot.
   */
  secondaryAction?: {
    content: string;
    onAction: () => void;
  };
};

type ModalContainerProps = {
  state: OverlayTriggerState;
  children: ReactNode;
  isDismissable?: boolean;
};

type ModalTriggerProps = {
  /**
   * Content of modal trigger. Must be exactly two elements.
   */
  children: [ReactElement, ModalClose | ReactElement];
  isDismissable?: boolean;
};

type ModalContextType = {
  dialogProps: DOMAttributes<FocusableElement>;
  titleProps: DOMAttributes<FocusableElement>;
  isHeaderStuck: boolean;
  isFooterStuck: boolean;
  bodyRef: RefObject<HTMLDivElement>;
  headerInterceptorRef: RefObject<HTMLDivElement>;
  footerInterceptorRef: RefObject<HTMLDivElement>;
};

const ModalContext = createContext<ModalContextType | null>(null);

const useModal = () => {
  const modalContext = useContext(ModalContext);
  if (!modalContext) {
    throw new Error("Must be within a Modal");
  }
  return modalContext;
};

type ModalTriggerContextType = {
  isDismissable: boolean;
  state: OverlayTriggerState;
};

const ModalTriggerContext = createContext<ModalTriggerContextType | null>(null);

const useModalTrigger = () => {
  const modalTriggerContext = useContext(ModalTriggerContext);
  if (!modalTriggerContext) {
    throw new Error("Must be within a ModalTrigger");
  }
  return modalTriggerContext;
};

function ModalHeader(props: ModalHeaderProps) {
  const { as = "h2", children, subtitle, iconAtStart, iconAtEnd } = props;
  const modalContext = useModal();
  const modalTriggerContext = useModalTrigger();
  const className = classNames(
    styles.header,
    modalContext.isHeaderStuck && styles.stuck,
  );
  return (
    <div className={className}>
      <VerticalStack gap="1.5">
        <HorizontalStack align="space-between" blockAlign="center" wrap={false}>
          <HorizontalStack gap="2" wrap={false}>
            {iconAtStart && (
              <span>
                <Icon {...iconAtStart} size="lg" />
              </span>
            )}
            <Text
              as={as}
              variant="heading4"
              truncate
              {...modalContext.titleProps}
            >
              {children}
            </Text>
          </HorizontalStack>
          {iconAtEnd ? (
            <span className={styles.iconAtEnd} data-size={iconAtEnd.size}>
              <Icon {...iconAtEnd} />
            </span>
          ) : modalTriggerContext.isDismissable ? (
            <button
              className={styles.closeBtn}
              onClick={() => {
                modalTriggerContext.state.close();
              }}
            >
              <Icon symbol={CloseIcon} size="sm" />
            </button>
          ) : null}
        </HorizontalStack>
        {subtitle && <Text variant="subtitle1">{subtitle}</Text>}
      </VerticalStack>
    </div>
  );
}

function ModalBody(props: ModalBodyProps) {
  const modalContext = useModal();
  const { children } = props;
  useScrollbar(modalContext.bodyRef);
  return (
    <div className={styles.body} ref={modalContext.bodyRef}>
      <div className={styles.content}>
        <div data-intercept="header" ref={modalContext.headerInterceptorRef} />
        {children}
        <div data-intercept="footer" ref={modalContext.footerInterceptorRef} />
      </div>
    </div>
  );
}

function ModalFooter(props: ModalFooterProps) {
  const modalContext = useModal();
  const { primaryAction, secondaryAction } = props;
  const className = classNames(
    styles.footer,
    modalContext.isFooterStuck && styles.stuck,
  );
  return (
    <div className={className}>
      {secondaryAction && (
        <Button onPress={secondaryAction.onAction} color="neutral">
          {secondaryAction.content}
        </Button>
      )}
      <Button onPress={primaryAction.onAction}>{primaryAction.content}</Button>
    </div>
  );
}

export function Modal(props: ModalProps) {
  const { children, size = "lg" } = props;

  const bodyRef = useRef<ElementRef<"div">>(null);
  const headerInterceptorRef = useRef<ElementRef<"div">>(null);
  const footerInterceptorRef = useRef<ElementRef<"div">>(null);

  const [isHeaderStuck, setIsHeaderStuck] = useState(false);
  const [isFooterStuck, setIsFooterStuck] = useState(false);

  const dialogRef = React.useRef(null);
  const { dialogProps, titleProps } = useDialog({ role: "dialog" }, dialogRef);

  const context = useMemo(() => {
    return {
      bodyRef,
      headerInterceptorRef,
      footerInterceptorRef,
      isHeaderStuck,
      isFooterStuck,
      dialogProps,
      titleProps,
    };
  }, [dialogProps, isFooterStuck, isHeaderStuck, titleProps]);

  useEffect(() => {
    if (
      !headerInterceptorRef.current ||
      !footerInterceptorRef.current ||
      !bodyRef.current
    ) {
      return;
    }

    const hObserver = new IntersectionObserver(
      ([entry]) => {
        setIsHeaderStuck(!entry.isIntersecting);
      },
      { root: bodyRef.current },
    );

    const fObserver = new IntersectionObserver(
      ([entry]) => {
        setIsFooterStuck(!entry.isIntersecting);
      },
      { root: bodyRef.current },
    );

    hObserver.observe(headerInterceptorRef.current);
    fObserver.observe(footerInterceptorRef.current);

    return () => {
      hObserver.disconnect();
      fObserver.disconnect();
    };
  }, []);

  const className = classNames(
    styles.dialog,
    styles[variationName("size", size)],
  );

  return (
    <ModalContext.Provider value={context}>
      <div {...dialogProps} className={className} ref={dialogRef}>
        {children}
      </div>
    </ModalContext.Provider>
  );
}

function ModalContainer({ state, children, ...props }: ModalContainerProps) {
  const ref = React.useRef(null);
  const { isDismissable = true } = props;
  const { modalProps, underlayProps } = useModalOverlay(
    {
      ...props,
      isDismissable: isDismissable,
      isKeyboardDismissDisabled: !isDismissable,
    },
    state,
    ref,
  );
  return (
    <Overlay>
      <div className={styles.underlay} {...underlayProps}>
        <div {...modalProps} ref={ref} className={styles.Modal}>
          <div className={styles.before} />
          {children}
          <div className={styles.after} />
        </div>
      </div>
    </Overlay>
  );
}

function ModalTrigger(props: ModalTriggerProps) {
  const { children, isDismissable = true, ...inTriggerProps } = props;

  const state = useOverlayTriggerState(inTriggerProps);
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: "dialog" },
    state,
  );

  if (children.length !== 2) {
    throw new Error(
      "children must be exactly 2 elements—the trigger and the modal",
    );
  }

  const [trigger, modal] = children;

  const context = useMemo(() => {
    return { state, isDismissable };
  }, [isDismissable, state]);

  return (
    <ModalTriggerContext.Provider value={context}>
      {cloneElement(trigger, triggerProps)}
      {state.isOpen && (
        <ModalContainer {...props} state={state}>
          {cloneElement(
            typeof modal === "function" ? modal(state.close) : modal,
            overlayProps,
          )}
        </ModalContainer>
      )}
    </ModalTriggerContext.Provider>
  );
}

Modal.Trigger = ModalTrigger;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
