import { render, screen } from "@testing-library/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SubscribeButton } from ".";

jest.mock("next/router");
jest.mock("next-auth/react", () => ({
  useSession: jest.fn().mockReturnValue({}),
  signIn: jest.fn(),
}));

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });
  it("redirects user to sign in when not authenticated", () => {
    render(<SubscribeButton />);

    screen.getByText("Subscribe now").click();

    expect(signIn).toHaveBeenCalledWith("github");
  });
  it("redirects to posts when user already has a subscription", () => {
    const useRouterReturnMock = {
      push: jest.fn(),
    };
    const useSessionReturnMock = {
      data: { activeSubscription: 1 },
    };
    jest.mocked(useRouter).mockReturnValueOnce(useRouterReturnMock as any);
    jest.mocked(useSession).mockReturnValueOnce(useSessionReturnMock as any);

    render(<SubscribeButton />);

    screen.getByText("Subscribe now").click();

    expect(useRouterReturnMock.push).toHaveBeenCalledWith("/posts");
  });
});
