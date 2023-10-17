import MenuIcon from "@easypost/easy-ui-icons/Menu";
import React, { ReactNode } from "react";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { HelpButton } from "./HelpButton";

import styles from "./ProductLayoutHeader.module.scss";

export type ProductLayoutHeaderProps = {
  helpMenuItems: ReactNode[];
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
  const { primaryAction, renderLogo, secondaryAction, title } = props;
  return (
    <header className={styles.ProductLayoutHeader}>
      <div className={styles.logoBox}>
        <div className={styles.logoMenu}>
          <button className={styles.logoMenuBtn}>
            <Icon symbol={MenuIcon} />
          </button>
          {renderLogo()}
        </div>
        <Text as="h2" variant="heading4">
          {title}
        </Text>
      </div>
      <div className={styles.actions}>
        <HelpButton />
        {(primaryAction || secondaryAction) && <Divider />}
        {secondaryAction && (
          <Button
            onPress={secondaryAction.onAction}
            color="neutral"
            isDisabled={secondaryAction.isDisabled}
          >
            {secondaryAction.content}
          </Button>
        )}
        {primaryAction && (
          <Button
            onPress={primaryAction.onAction}
            color="primary"
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