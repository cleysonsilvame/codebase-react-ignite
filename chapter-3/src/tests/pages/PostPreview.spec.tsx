import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PostPreview, {
  getStaticPaths,
  getStaticProps,
} from "../../pages/posts/preview/[slug]";
import { createClient } from "../../services/prismic";

jest.mock("next-auth/react");
jest.mock("next/router");
jest.mock("../../services/prismic");

const post = {
  slug: "my-new-post",
  title: "My New Post",
  content: "<p>Post excerpt </>",
  updatedAt: "08 de Julho",
};
describe("Post preview page", () => {
  it("renders correctly", () => {
    jest.mocked(useSession).mockReturnValueOnce({} as any);

    render(<PostPreview post={post} />);

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
    expect(screen.getByText("08 de Julho")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Subscribe now 🤗" })
    ).toHaveAttribute("href", "/");
  });

  it("redirects user to full post when user is subscribed", () => {
    const useRouterReturnMock = {
      push: jest.fn(),
    };
    const useSessionReturnMock = {
      data: { activeSubscription: 1 },
    };
    jest.mocked(useRouter).mockReturnValueOnce(useRouterReturnMock as any);
    jest.mocked(useSession).mockReturnValueOnce(useSessionReturnMock as any);

    render(<PostPreview post={post} />);

    expect(useRouterReturnMock.push).toHaveBeenCalledWith("/posts/my-new-post");
  });

  it("loads initial data", async () => {
    const getByUIDResolvedValueMock = {
      data: {
        title: [{ type: "heading", text: "My New Post" }],
        content: [{ type: "paragraph", text: "Post excerpt", spans: [] }],
      },
      last_publication_date: "07-08-2022",
    };

    jest.mocked(createClient).mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce(getByUIDResolvedValueMock),
    } as any);

    const response = await getStaticProps({
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toMatchObject({
      props: {
        post: {
          slug: "my-new-post",
          title: "My New Post",
          content: "<p>Post excerpt</p>",
          updatedAt: "08 de julho de 2022",
        },
      },
    });
  });

  it("getStaticPaths returns correctly", async () => {
    const response = await getStaticPaths({});

    expect(response).toEqual({
      paths: [],
      fallback: "blocking",
    });
  });
});
