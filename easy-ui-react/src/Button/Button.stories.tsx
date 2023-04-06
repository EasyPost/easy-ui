import AddIcon from "@easypost/easy-ui-icons/Add";
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import InfoIcon from "@easypost/easy-ui-icons/Info";
import React from "react";
import {
  ButtonStoryDecorator,
  ButtonStoryOnDarkBackgroundDecorator,
  createLabelledOptionsControl,
} from "../utilities/storybook";
import { Button, ButtonProps } from "./Button";

const Template = (args: ButtonProps) => <Button {...args} />;

export default {
  title: "Components/Button/Button",
  argTypes: {
    iconAtStart: createLabelledOptionsControl({
      ArrowBack: ArrowBackIcon,
      Add: AddIcon,
    }),
    iconAtEnd: createLabelledOptionsControl({
      ArrowBack: ArrowBackIcon,
      Add: AddIcon,
    }),
    children: {
      control: "text",
    },
  },
  component: Button,
};

export const Controls = {
  render: Template.bind({}),
  args: {},
};

export const FilledButtons = {
  render: () => (
    <>
      <Button />
      <Button color="secondary" />
      <Button color="success" />
      <Button color="warning" />
      <Button color="neutral" />
      <Button size="sm" />
      <Button color="secondary" size="sm" />
      <Button color="success" size="sm" />
      <Button color="warning" size="sm" />
      <Button color="neutral" size="sm" />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const OutlinedButtons = {
  render: () => (
    <>
      <Button variant="outlined" />
      <Button color="secondary" variant="outlined" />
      <Button color="support" variant="outlined" />
      <Button variant="outlined" size="sm" />
      <Button color="secondary" variant="outlined" size="sm" />
      <Button color="support" variant="outlined" size="sm" />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const LinkButtons = {
  render: () => (
    <>
      <Button variant="link" />
      <Button color="secondary" variant="link" />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const InverseButtons = {
  render: () => (
    <>
      <Button color="inverse" variant="outlined" />
      <Button color="inverse" variant="outlined" size="sm" />
    </>
  ),
  decorators: [ButtonStoryOnDarkBackgroundDecorator],
};

export const WithHref = {
  render: () => (
    <>
      <Button href="https://www.easypost.com/" />
      <Button variant="outlined" href="https://www.easypost.com/" />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const WithIcons = {
  render: () => (
    <>
      <Button iconAtEnd={CheckCircleIcon} />
      <Button color="neutral" iconAtEnd={AddIcon} />
      <Button color="success" iconAtStart={ArrowBackIcon} />
      <Button color="warning" iconAtStart={InfoIcon} />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const BlockButton = {
  render: () => <Button isBlock />,
  decorators: [ButtonStoryDecorator],
};

export const DisabledButtons = {
  render: () => (
    <>
      <Button isDisabled />
      <Button variant="outlined" isDisabled />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const ClickEvent = {
  render: () => <Button onPress={() => alert("clicked!")} />,
  decorators: [ButtonStoryDecorator],
};
