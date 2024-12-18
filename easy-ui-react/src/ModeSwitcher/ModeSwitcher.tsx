import React, { useState, createContext, useContext, ReactNode } from "react";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";
import ExpandMoreIcon400 from "@easypost/easy-ui-icons/ExpandMore400";
import { Text } from "../Text";
import {
  RadioGroup,
  RadioGroupItemProps,
  useRadioGroupContext,
} from "../RadioGroup";
import { Icon } from "../Icon";
import { VerticalStack } from "../VerticalStack";
import { classNames } from "../utilities/css";

import styles from "./ModeSwitcher.module.scss";

// not the actual component

export function FakeTopLevelForgeModeSwitcher() {
  const [mode, setMode] = useState("production");

  return (
    <FakeForgeComponent mode={mode as "production" | "test"}>
      <ModeSwitcher onModeChange={setMode} />
    </FakeForgeComponent>
  );
}

type FakeForgeComponentProps = {
  mode: "test" | "production";
  children: ReactNode;
};

export function FakeForgeComponent({
  children,
  mode,
}: FakeForgeComponentProps) {
  const context = {
    mode,
  };
  return (
    <FakeForgeContext.Provider value={context}>
      {children}
    </FakeForgeContext.Provider>
  );
}

type FakeForgeContextType = {
  mode: "production" | "test";
};

export const FakeForgeContext = createContext<FakeForgeContextType | null>(
  null,
);

export function useFakeForgeContext() {
  const forgeContext = useContext(FakeForgeContext);
  if (!forgeContext) {
    throw new Error("boom");
  }
  return forgeContext;
}

// the actual component

export type ModeSwitcherProps = {
  onModeChange?: (value: string) => void;
};

export function ModeSwitcher(props: ModeSwitcherProps) {
  const { onModeChange } = props;
  const state = useFakeForgeContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DialogTrigger>
      <Button
        className={classNames(
          styles.trigger,
          isOpen && styles.triggerPopoverOpen,
        )}
        onPress={() => setIsOpen(true)}
      >
        <Text
          variant="subtitle1"
          color={state.mode === "test" ? "warning.600" : "positive.600"}
          truncate
        >
          {state.mode === "test" ? "Test" : "Production"}
        </Text>
        <Icon symbol={ExpandMoreIcon400} size="md" color="neutral.500" />
      </Button>
      <Popover
        className={styles.popover}
        offset={2}
        crossOffset={102}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <Dialog>
          <VerticalStack gap="1">
            <Text variant="subtitle1" color="neutral.800">
              Instance Switcher
            </Text>
            <RadioGroup
              aria-label="Select a mode"
              onChange={onModeChange}
              value={state.mode}
            >
              <ModeSwitcherRadioGroupItem value="test" />
              <ModeSwitcherRadioGroupItem value="production" />
            </RadioGroup>
          </VerticalStack>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}

function ModeSwitcherRadioGroupItem(
  props: Omit<RadioGroupItemProps, "children">,
) {
  const { value, ...restProps } = props;
  const state = useRadioGroupContext();
  const isSelected = value === state.selectedValue;
  return (
    <RadioGroup.Item value={value} {...restProps}>
      <VerticalStack>
        <Text
          variant="subtitle2"
          color={isSelected ? "primary.800" : "primary.700"}
        >
          {value === "test" ? "Test" : "Production"}
        </Text>
        <Text variant="overline">
          View data using the{" "}
          <Text color={value === "test" ? "warning.600" : "positive.600"}>
            {value === "test" ? "TEST" : "PRODUCTION"} API{" "}
          </Text>
          keys
        </Text>
      </VerticalStack>
    </RadioGroup.Item>
  );
}
