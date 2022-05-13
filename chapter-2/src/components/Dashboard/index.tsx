import { useEffect } from "react";
import { useTransactions } from "../../hooks/TransactionsContext";
import { Summary } from "../Summary";
import { TransactionTable } from "../TransactionsTable";
import { Container } from "./styles";

export function Dashboard() {
  
  return (
    <Container>
      <Summary />
      <TransactionTable  />
    </Container>
  );
}
