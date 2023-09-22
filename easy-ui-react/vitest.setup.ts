import "@testing-library/jest-dom";
import {
  installJestCompatibleFakeTimers,
  installScrollToMock,
} from "./src/utilities/test";

installJestCompatibleFakeTimers();
installScrollToMock();
