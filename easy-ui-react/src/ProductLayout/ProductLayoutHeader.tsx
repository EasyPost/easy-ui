import MenuIcon from "@easypost/easy-ui-icons/Menu";
import { CollectionChildren } from "@react-types/shared";
import React, { ReactNode } from "react";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { HelpMenu } from "./HelpMenu";

import styles from "./ProductLayoutHeader.module.scss";
import { useProductLayout } from "./context";

export type ProductLayoutHeaderProps = {
  helpMenuItems: CollectionChildren<object>;
  primaryAction?: ProductLayoutHeaderActionProps;
  renderLogo: () => ReactNode;
  secondaryAction?: ProductLayoutHeaderActionProps;
  title: ReactNode;
};

export type ProductLayoutHeaderActionProps = {
  content: string;
  onAction: () => void;
  isDisabled?: boolean;
};

export function ProductLayoutHeader(props: ProductLayoutHeaderProps) {
  const { helpMenuItems, primaryAction, renderLogo, secondaryAction, title } =
    props;
  const { setIsMobileSidebarOpen } = useProductLayout();
  return (
    <header className={styles.ProductLayoutHeader}>
      <div className={styles.logoBox}>
        <div className={styles.logoMenu}>
          <button
            className={styles.logoMenuBtn}
            onClick={() => {
              setIsMobileSidebarOpen(true);
            }}
          >
            <Icon symbol={MenuIcon} />
          </button>
          {renderLogo()}
        </div>
        <Text as="h2" variant="heading4">
          {title}
        </Text>
      </div>
      <div className={styles.actions}>
        <HelpMenu items={helpMenuItems} />
        {(primaryAction || secondaryAction) && <Divider />}
        {secondaryAction && (
          <Button
            variant="outlined"
            onPress={secondaryAction.onAction}
            isDisabled={secondaryAction.isDisabled}
          >
            {secondaryAction.content}
          </Button>
        )}
        {primaryAction && (
          <Button
            onPress={primaryAction.onAction}
            isDisabled={primaryAction.isDisabled}
          >
            {primaryAction.content}
          </Button>
        )}
      </div>
    </header>
  );
}

function Divider() {
  return <div className={styles.divider} />;
}
