import { createServer } from "miragejs";
import { Dashboard } from "./components/Dashboard";
import { Header } from "./components/Header";
import { GlobalStyle } from "./styles/global";

createServer({
  routes() {
    this.namespace = "api";

    this.get("/transactions", () => {
      return [
        {
          id: 1,
          title: "Transaction 1",
          amount: 100,
          type: 'deposit',
          category: 'Food',
          createdAt: new Date()
        }
      ];
    });
  },
});

export function App() {
  return (
    <>
      <Header />
      <Dashboard />
      <GlobalStyle />
    </>
  );
}
