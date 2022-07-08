import { render, screen } from "@testing-library/react";
import Posts, { getStaticProps } from "../../pages/posts";
import { createClient } from "../../services/prismic";

jest.mock("../../services/prismic");

const posts = [
  {
    slug: "my-new-post",
    title: "My New Post",
    excerpt: "Post excerpt",
    updatedAt: "08 de Julho",
  },
];

describe("Posts page", () => {
  it("renders correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
    expect(screen.getByText("08 de Julho")).toBeInTheDocument();

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/posts/preview/my-new-post"
    );
  });

  it("loads initial data", async () => {
    const getAllByTypeResolvedValue = [
      {
        uid: "my-new-post",
        data: {
          title: [{ type: "heading", text: "My New Post" }],
          content: [{ type: "paragraph", text: "Post excerpt" }],
        },
        last_publication_date: "07-08-2022",
      },
    ];
    jest.mocked(createClient).mockReturnValueOnce({
      getAllByType: jest.fn().mockResolvedValueOnce(getAllByTypeResolvedValue),
    } as any);

    const response = await getStaticProps({});
    
    expect(response).toMatchObject({
      props: {
        posts: [
          {
            slug: "my-new-post",
            title: "My New Post",
            excerpt: "Post excerpt",
            updatedAt: "08 de julho de 2022",
          },
        ],
      },
    });
  });
});
