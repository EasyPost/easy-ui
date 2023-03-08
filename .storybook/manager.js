import { addons } from "@storybook/addons";
import { theme } from "./theme";

import "./poppins.css";

addons.setConfig({
  panelPosition: "bottom",
  theme,
});
