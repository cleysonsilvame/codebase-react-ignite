import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { SignInButton } from ".";

jest.mock("next-auth/react");
const useSessionMock = jest.mocked(useSession);

describe("SignInButton component", () => {
  it("renders correctly when user is not authenticated", () => {
    useSessionMock.mockReturnValueOnce({} as any);

    render(<SignInButton />);

    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });
  it("renders correctly when user is authenticated", () => {
    useSessionMock.mockReturnValueOnce({
      data: { user: { name: "John Doe" } },
    } as any);

    render(<SignInButton />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
