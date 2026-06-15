import "@testing-library/jest-dom";
import {
  installJestCompatibleFakeTimers,
  installScrollToMock,
} from "./src/utilities/test";

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

installJestCompatibleFakeTimers();
installScrollToMock();
