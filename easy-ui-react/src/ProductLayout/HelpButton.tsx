import ArrowDropDownIcon from "@easypost/easy-ui-icons/ArrowDropDown";
import SupportIcon from "@easypost/easy-ui-icons/Support";
import React from "react";
import { Icon } from "../Icon";
import { Text } from "../Text";

export function HelpButton() {
  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        appearance: "none",
        padding: 0,
        margin: 0,
        border: 0,
        background: "transparent",
        cursor: "pointer",
      }}
    >
      <Icon symbol={SupportIcon} />
      <Text variant="subtitle1">Help</Text>
      <span style={{ display: "inline-flex", margin: -4 }}>
        <Icon symbol={ArrowDropDownIcon} />
      </span>
    </button>
  );
}
