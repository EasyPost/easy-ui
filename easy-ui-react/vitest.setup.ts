import "@testing-library/jest-dom";
import {
  installJestCompatibleFakeTimers,
  installScrollToMock,
} from "./src/utilities/test";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

installJestCompatibleFakeTimers();
installScrollToMock();
