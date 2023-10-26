import tokens from "@easypost/easy-ui-tokens/js/tokens";
import { Decorator } from "@storybook/react";
import React, { ComponentProps, ReactNode, SVGProps } from "react";
import type { Placement as AriaPlacement } from "react-aria";
import { getThemeTokenAliases } from "../Theme";
import { getTokenAliases } from "./tokens";
import { SortDescriptor } from "react-stately";

export function createLabelledOptionsControl(
  opts: Record<string, unknown>,
  control = {},
) {
  return {
    options: Object.keys(opts),
    mapping: opts,
    control: {
      type: "select",
      labels: Object.keys(opts).reduce((o, key) => ({ ...o, [key]: key }), {}),
      ...control,
    },
  };
}

export function createFontStyleTokensControl() {
  return getDesignTokensControl("font.style.{alias}.family");
}

export function createColorTokensControl() {
  return getThemeTokensControl("color.text.{alias}");
}

export function getDesignTokensControl(pattern: string) {
  return getTokensControl(getTokenAliases(tokens, pattern));
}

export function getThemeTokensControl(pattern: string) {
  return getTokensControl(getThemeTokenAliases(pattern));
}

function getTokensControl(tokenAliases: string[]) {
  return createLabelledOptionsControl(
    tokenAliases.reduce((o, alias) => ({ ...o, [alias]: alias }), {}),
  );
}

const inlineStoryStyles = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
} as React.CSSProperties;

const inlineStoryOnDarkBackgroundStyles = {
  backgroundColor: "var(--ezui-color-blue-800)",
  padding: "12px",
};

export const InlineStoryDecorator: Decorator = (Story) => (
  <div style={inlineStoryStyles}>
    <Story />
  </div>
);

export const InlineStoryOnDarkBackgroundDecorator: Decorator = (Story) => (
  <div style={{ ...inlineStoryOnDarkBackgroundStyles, ...inlineStoryStyles }}>
    <Story />
  </div>
);

// TODO: Is there a way to use better styling for this?
export const FullScreenStoryPreviewStyle = () => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `html,body,#storybook-root {
          height: 100%;
        }`,
      }}
    />
  );
};

/**
 * Centers trigger elements within the storybook frame with a user-specified
 * amount of space around the triggers to allow for an overlay to show within
 * the story window.
 *
 * @param Story
 * @param options.parameters.overlayLayout.framePaddingX Horizontal breathing room for overlays around story frame
 * @param options.parameters.overlayLayout.framePaddingY Vertical breathing room for overlays around story frame
 * @param options.parameters.overlayLayout.triggerSpacingX Horizontal breathing room between triggers
 * @param options.parameters.overlayLayout.triggerSpacingY Vertical breathing room between triggers
 * @returns React element representing decorator
 */
export const OverlayLayoutDecorator: Decorator = (Story, options) => {
  const { parameters } = options;
  const { overlayLayout = {} } = parameters;
  const {
    framePaddingX = 0,
    framePaddingY = 0,
    triggerSpacingX = 0,
    triggerSpacingY = 0,
  } = overlayLayout;
  return (
    <>
      <FullScreenStoryPreviewStyle />
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <div
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            justifyContent: "center",
            margin: "auto",
            rowGap: triggerSpacingY,
            columnGap: triggerSpacingX,
            paddingLeft: framePaddingX,
            paddingRight: framePaddingX,
            paddingTop: framePaddingY,
            paddingBottom: framePaddingY,
          }}
        >
          <Story />
        </div>
      </div>
    </>
  );
};

export const overlayPlacements = [
  "top",
  "bottom",
  "left",
  "right",
  "top left",
  "top right",
  "bottom left",
  "bottom right",
  "left top",
  "left bottom",
  "right top",
  "right bottom",
] as AriaPlacement[];

export type PlaceholderBoxProps = {
  children?: ReactNode;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
};

/**
 * Renders a placeholder box as a filler for components that need content.
 */
export const PlaceholderBox = ({
  width = 378,
  height = 224,
  children = <>Content</>,
  style = {},
}: PlaceholderBoxProps) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width,
      height,
      background: tokens["color.gray.100"],
      borderRadius: 4,
      padding: 12,
      ...style,
    }}
  >
    {children}
  </div>
);

export const InputDecorator: Decorator = (Story) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      maxWidth: "425px",
      gap: "12px",
    }}
  >
    <Story />
  </div>
);

export function EasyPostLogo(props: SVGProps<SVGSVGElement>) {
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

export function EasyPostFullLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="104"
      height="24"
      viewBox="0 0 104 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M101.237 9.95772H103.954V7.80128H101.237C101.057 7.80128 100.965 7.70795 100.965 7.5485V5.41345H98.5435V14.5914C98.5435 17.0007 99.5853 18.3326 102.302 18.3326H103.954V16.1742H102.663C101.237 16.1742 100.965 15.5326 100.965 14.2473V10.2319C100.967 10.0491 101.057 9.95772 101.237 9.95772ZM94.946 12.1142L94.0404 11.6553C93.0446 11.1497 92.7952 10.9436 92.7952 10.4847C92.7952 9.98105 93.1789 9.65827 93.8811 9.65827C94.4932 9.65827 95.2165 9.88772 96.055 10.37L96.9836 8.48963C95.8516 7.73128 94.7196 7.52516 93.7679 7.52516C91.7073 7.52516 90.3949 8.83381 90.3949 10.5547C90.3949 12.0228 91.1202 12.9406 92.9985 13.835L93.8581 14.2473C94.7637 14.6828 95.0362 15.0056 95.0362 15.4178C95.0362 16.0381 94.4471 16.3356 93.5185 16.3356C92.682 16.3356 91.8665 16.0829 91.007 15.5559L90.0553 17.5296C91.2334 18.286 92.5457 18.5387 93.6317 18.5387C95.8957 18.5387 97.4806 17.4148 97.4806 15.3031C97.4806 13.9031 96.7572 13.032 94.946 12.1142ZM84.1688 7.52516C80.955 7.52516 78.7351 9.77299 78.7351 13.032C78.7351 16.289 80.955 18.5387 84.1688 18.5387C87.3845 18.5387 89.6025 16.289 89.6025 13.032C89.6006 9.77299 87.3826 7.52516 84.1688 7.52516ZM84.1688 16.3356C82.3806 16.3356 81.2025 15.027 81.2025 13.032C81.2025 11.035 82.3806 9.72827 84.1688 9.72827C85.957 9.72827 87.1351 11.035 87.1351 13.032C87.1331 15.027 85.9551 16.3356 84.1688 16.3356ZM72.3056 7.52516C69.136 7.52516 67.0542 9.59021 67.0542 13.1467V23.1277H69.4756V17.5976C69.4756 17.4596 69.5447 17.3915 69.6349 17.3915C69.702 17.3915 69.7481 17.4148 69.8382 17.5062C70.4273 18.0798 71.4672 18.5387 72.5551 18.5387C75.6115 18.5387 77.8295 16.289 77.8295 13.032C77.8276 9.77299 75.6096 7.52516 72.3056 7.52516ZM72.3939 16.3356C70.6057 16.3356 69.4276 15.027 69.4276 13.032C69.4276 11.035 70.6057 9.72827 72.3939 9.72827C74.1821 9.72827 75.3602 11.035 75.3602 13.032C75.3602 15.027 74.1821 16.3356 72.3939 16.3356ZM53.9459 12.1142L53.0402 11.6553C52.0425 11.1497 51.795 10.9436 51.795 10.4847C51.795 9.98105 52.1788 9.65827 52.881 9.65827C53.493 9.65827 54.2164 9.88772 55.0549 10.37L55.9835 8.48963C54.8515 7.73128 53.7195 7.52516 52.7678 7.52516C50.7071 7.52516 49.3948 8.83381 49.3948 10.5547C49.3948 12.0228 50.1181 12.9406 51.9984 13.835L52.858 14.2473C53.7636 14.6828 54.036 15.0056 54.036 15.4178C54.036 16.0381 53.447 16.3356 52.5184 16.3356C51.6818 16.3356 50.8664 16.0829 50.0049 15.5559L49.0552 17.5296C50.2313 18.286 51.5456 18.5387 52.6316 18.5387C54.8956 18.5387 56.4804 17.4148 56.4804 15.3031C56.4785 13.9031 55.7571 13.032 53.9459 12.1142ZM45.6131 7.80128V8.4663C45.6131 8.60436 45.5459 8.67242 45.4557 8.67242C45.3867 8.67242 45.3425 8.64908 45.2524 8.55769C44.6633 7.98407 43.6215 7.52516 42.5355 7.52516C39.4791 7.52516 37.2592 9.77299 37.2592 13.032C37.2592 16.289 39.4791 18.5387 42.5355 18.5387C43.6215 18.5387 44.6633 18.0798 45.2524 17.5062C45.3425 17.4148 45.3867 17.3915 45.4557 17.3915C45.5459 17.3915 45.6131 17.4596 45.6131 17.5976V18.2626H48.0363V7.80128H45.6131ZM42.6928 16.3356C40.9046 16.3356 39.7266 15.027 39.7266 13.032C39.7266 11.035 40.9046 9.72827 42.6928 9.72827C44.481 9.72827 45.6591 11.035 45.6591 13.032C45.6591 15.027 44.4791 16.3356 42.6928 16.3356ZM28.3853 13.9031H36.2634C36.3094 13.6503 36.3535 13.3995 36.3535 12.9639C36.3535 9.84299 34.3159 7.52516 31.1463 7.52516C28.0898 7.52516 25.6685 9.77299 25.6685 13.0553C25.6685 16.289 27.8634 18.5387 31.1021 18.5387C33.0496 18.5387 34.6785 17.7357 35.8777 16.0148L34.1586 14.6148C33.1839 15.9234 32.2111 16.3356 31.1693 16.3356C29.1777 16.3356 28.2721 14.9142 28.1589 14.2025C28.1109 13.9731 28.1819 13.9031 28.3853 13.9031ZM28.2721 11.6086C28.6117 10.4613 29.7667 9.65827 31.0561 9.65827C32.3243 9.65827 33.4564 10.4613 33.796 11.6086C33.8631 11.838 33.8401 11.9994 33.6367 11.9994H28.4294C28.2241 11.9994 28.2011 11.838 28.2721 11.6086Z"
        fill="#061340"
      />
      <path
        d="M67.0796 7.7807L63.4694 17.3564C62.4244 20.1557 61.4468 21.4069 58.0406 23.0205L57.0206 20.9731C58.9451 19.9706 59.9188 19.2554 60.4981 18.2259L56.4067 7.7807H59.0182L61.6065 14.8097C61.6739 14.9678 61.7432 15.0141 61.8336 15.0141C61.9241 15.0141 62.0145 14.9678 62.0607 14.8097L64.5124 7.7807H67.0796Z"
        fill="#061340"
      />
      <path
        d="M10.8562 14.2855C10.6705 14.2855 10.5304 14.2624 10.3684 14.1717L5.42808 11.3744V13.8305L10.3684 16.6298C10.5304 16.7204 10.6705 16.7435 10.8562 16.7435C11.02 16.7435 11.2057 16.6972 11.3458 16.6298L21.7143 10.7594V13.2175L11.3458 19.0627C11.2057 19.1533 11.0437 19.1996 10.8562 19.1996C10.6942 19.1996 10.5304 19.1533 10.3684 19.0627L5.42808 16.2885V18.7215L10.3684 21.5208C10.5304 21.6114 10.6942 21.6345 10.8562 21.6345C11.0437 21.6345 11.2293 21.5882 11.3458 21.5208L21.7143 15.6735V17.2197C21.7143 17.7672 21.4122 18.2897 20.9225 18.5634L11.648 23.7956C11.4169 23.9306 11.1365 24 10.8562 24C10.5777 24 10.321 23.9306 10.0644 23.7956L0.791802 18.5634C0.30211 18.2897 0 17.7672 0 17.2197V6.77837C0 6.20965 0.30211 5.6872 0.791802 5.41345L10.0644 0.204353C10.321 0.0694027 10.5777 0 10.8562 0C11.1365 0 11.4169 0.0694027 11.648 0.204353L20.9225 5.41345C21.4122 5.6872 21.7143 6.20965 21.7143 6.77837V8.32645L11.3458 14.1717C11.2057 14.2411 11.02 14.2855 10.8562 14.2855Z"
        fill="#164DFF"
      />
    </svg>
  );
}

export function StripeLogo(props: SVGProps<SVGSVGElement>) {
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

export function createNaiveSortingFunction(sortDescriptor: SortDescriptor) {
  return (a: object, b: object) => {
    const sign = sortDescriptor.direction === "descending" ? -1 : 1;
    const first = a[sortDescriptor.column as keyof typeof a];
    const second = b[sortDescriptor.column as keyof typeof b];
    const firstValue = parseInt(first) || first;
    const secondValue = parseInt(second) || second;
    return (firstValue < secondValue ? -1 : 1) * sign;
  };
}

export function FakeSidebarNav() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        height: "100%",
        padding: 24,
        overflow: "auto",
      }}
    >
      <div
        style={{ flex: "1", display: "flex", flexDirection: "column", gap: 20 }}
      >
        <div style={{ height: 38, width: 165, background: "#ddd" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ height: 24, width: 120, background: "#eee" }} />
          <div style={{ height: 24, width: 140, background: "#eee" }} />
          <div style={{ height: 24, width: 130, background: "#eee" }} />
          <div style={{ height: 24, width: 150, background: "#eee" }} />
          <div style={{ height: 24, width: 110, background: "#eee" }} />
          <div style={{ height: 24, width: 150, background: "#eee" }} />
          <div style={{ height: 24, width: 120, background: "#eee" }} />
          <div style={{ height: 24, width: 130, background: "#eee" }} />
        </div>
      </div>
      <div
        style={{ flex: "0 0 auto", height: 18, width: 128, background: "#eee" }}
      />
    </div>
  );
}

// This story uses a `button` as a link, only as an example for showing that
// the link element can be customized for custom routers like next/link.
// TabNav shouldn't use `button`s in production.
export function FakeClientSideRouterLink(props: ComponentProps<"button">) {
  return <button {...props} />;
}

export function EasyPostLogoMark() {
  return (
    <svg
      width="22"
      height="24"
      viewBox="0 0 22 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.9158 14.2855C10.7292 14.2855 10.5882 14.2624 10.4254 14.1717L5.4579 11.3744V13.8305L10.4254 16.6298C10.5882 16.7204 10.7292 16.7435 10.9158 16.7435C11.0806 16.7435 11.2672 16.6972 11.4082 16.6298L21.8336 10.7594V13.2175L11.4082 19.0627C11.2672 19.1533 11.1044 19.1996 10.9158 19.1996C10.753 19.1996 10.5882 19.1533 10.4254 19.0627L5.4579 16.2885V18.7215L10.4254 21.5208C10.5882 21.6114 10.753 21.6345 10.9158 21.6345C11.1044 21.6345 11.291 21.5882 11.4082 21.5208L21.8336 15.6735V17.2197C21.8336 17.7672 21.5298 18.2897 21.0374 18.5634L11.712 23.7956C11.4797 23.9306 11.1977 24 10.9158 24C10.6359 24 10.3778 23.9306 10.1197 23.7956L0.796153 18.5634C0.30377 18.2897 0 17.7672 0 17.2197V6.77837C0 6.20965 0.30377 5.6872 0.796153 5.41345L10.1197 0.204353C10.3778 0.0694027 10.6359 0 10.9158 0C11.1977 0 11.4797 0.0694027 11.712 0.204353L21.0374 5.41345C21.5298 5.6872 21.8336 6.20965 21.8336 6.77837V8.32645L11.4082 14.1717C11.2672 14.2411 11.0806 14.2855 10.9158 14.2855Z"
        fill="#164DFF"
      />
    </svg>
  );
}
