import { render, screen } from "@testing-library/react";
import { getSession } from "next-auth/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { createClient } from "../../services/prismic";

jest.mock("next-auth/react");
jest.mock("../../services/prismic");

const post = {
  slug: "my-new-post",
  title: "My New Post",
  content: "<p>Post excerpt </>",
  updatedAt: "08 de Julho",
};
describe("Post page", () => {
  it("renders correctly", () => {
    render(<Post post={post} />);

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
    expect(screen.getByText("08 de Julho")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const response = await getServerSideProps({
      req: {
        cookies: {},
      },
      params: {},
    } as any);

    expect(response).toEqual({
      redirect: {
        destination: "/",
        permanent: false,
      },
    });
  });

  it("loads initial data", async () => {
    const getSessionResolvedValueMock = {
      activeSubscription: true,
    };
    const getByUIDResolvedValueMock = {
      data: {
        title: [{ type: "heading", text: "My New Post" }],
        content: [{ type: "paragraph", text: "Post excerpt", spans: [] }],
      },
      last_publication_date: "07-08-2022",
    };

    jest
      .mocked(getSession)
      .mockResolvedValueOnce(getSessionResolvedValueMock as any);
    jest.mocked(createClient).mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce(getByUIDResolvedValueMock),
    } as any);

    const response = await getServerSideProps({ params: { slug: "my-new-post" } } as any);

    expect(response).toEqual({
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
});
