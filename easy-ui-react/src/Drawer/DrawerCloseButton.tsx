import React from "react";
import CancelIcon from "@easypost/easy-ui-icons/Cancel";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { useDrawerTriggerContext } from "./context";

import styles from "./Drawer.module.scss";

export function DrawerCloseButton() {
  const drawerTriggerContext = useDrawerTriggerContext();

  if (!drawerTriggerContext.isDismissable) {
    return null;
  }

  return (
    <button
      className={styles.closeButton}
      onClick={() => {
        drawerTriggerContext.state.close();
      }}
    >
      <Text visuallyHidden>Close drawer</Text>
      <Icon symbol={CancelIcon} size="md" />
    </button>
  );
}
