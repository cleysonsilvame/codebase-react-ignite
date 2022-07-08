import { render, screen } from "@testing-library/react";
import Home, { getStaticProps } from "../../pages";
import { stripe } from "../../services/stripe";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn().mockReturnValue({}),
}));
jest.mock("../../services/stripe");

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Home product={{ priceId: "fake-price-id", amount: "R$10,00" }} />);

    expect(
      screen.getByText("Get access to all the publications")
    ).toBeInTheDocument();
    expect(screen.getByText(/R\$10,00/i)).toBeInTheDocument();
    expect(screen.getByAltText("Girl coding")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const retrieveResolvedValue = {
      id: "fake-price-id",
      unit_amount: 1000,
    };
    jest
      .mocked(stripe.prices.retrieve)
      .mockResolvedValueOnce(retrieveResolvedValue as any);

    const response = await getStaticProps({});

    expect(response).toMatchObject({
      props: { product: { priceId: "fake-price-id", amount: "$10.00" } },
    });
  });
});
