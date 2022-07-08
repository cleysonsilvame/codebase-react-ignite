import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Async } from ".";

it("renders correctly", async () => {
  render(<Async />);

  expect(screen.getByText("hello world")).toBeInTheDocument();
  await waitForElementToBeRemoved(() => screen.queryByText("click me"));
});
