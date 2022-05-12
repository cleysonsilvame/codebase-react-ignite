import { createServer, Model } from "miragejs";
import ReactDOM from "react-dom/client";
import { App } from "./App";

createServer({
  models: {
    transaction: Model,
  },
  seeds(server) {
    server.db.loadData({
      transactions: [
        {
          id: 1,
          title: "Desenvolvimento de website",
          amount: 12000,
          category: "Desenvolvimento",
          type: "deposit",
          createdAt: new Date("2021-02-20"),
        },
        {
          id: 2,
          title: "Aluguel",
          amount: 1000,
          category: "Casa",
          type: "withdraw",
          createdAt: new Date("2021-02-21"),
        },
      ],
    });
  },
  routes() {
    this.namespace = "api";

    this.get("/transactions", () => {
      return this.schema.all("transaction");
    });
    this.post("/transactions", (schema, request) => {
      const data = JSON.parse(request.requestBody);

      return schema.create("transaction", data);
    });
  },
});

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(<App />);
