import { useCallback, useState } from "react";
import { SearchResults } from "../components/SearchResults";

export default function Home() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState({ data: [], totalPrice: 0 });

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (!search.trim()) return;

    const response = await fetch(`http://localhost:3333/products?q=${search}`);
    const data = await response.json();

    const totalPrice = data.reduce(
      (total: number, product: { price: number }) => {
        return total + product.price;
      },
      0
    );

    setResults({ data, totalPrice });
  }

  const addToWishlist = useCallback(async (id: number) => {
    console.log(id);
  }, []);

  return (
    <div>
      <h1>Search</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <button type="submit">Buscar</button>
      </form>

      <SearchResults
        results={results.data}
        totalPrice={results.totalPrice}
        onAddToWishlist={addToWishlist}
      />
    </div>
  );
}
