/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { classNames, variationName } from "../utilities/css";

import styles from "./ForgeLayout.module.scss";

export function ForgeLayout(props: any) {
  const { backgroundDecoration = "01", children } = props;
  const className = classNames(
    styles.ForgeLayout,
    styles[variationName("backgroundDecoration", backgroundDecoration)],
  );
  return <div className={className}>{children}</div>;
}

function Container(props: any) {
  const { children } = props;
  return <div>{children}</div>;
}

ForgeLayout.Header = Container;
ForgeLayout.Actions = Container;
ForgeLayout.MenuAction = Container;
ForgeLayout.ActionBadge = Container;
ForgeLayout.LinkAction = Container;
ForgeLayout.Content = Container;
ForgeLayout.Controls = Container;
ForgeLayout.ModeSwitcher = Container;
ForgeLayout.Search = Container;
ForgeLayout.Menu = Container;
ForgeLayout.MenuLink = Container;
ForgeLayout.MenuSection = Container;
ForgeLayout.MenuCollapsedControls = Container;
ForgeLayout.Breadrumbs = Container;
ForgeLayout.Breadrumb = Container;
ForgeLayout.MenuExpandedControls = Container;
ForgeLayout.BreadrumbsNavigation = Container;
ForgeLayout.BackLink = Container;
ForgeLayout.BackButton = Container;
