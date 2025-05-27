import { Suspense } from "react";
import AddNewTransaction from "./_components/AddNewTransaction";
import { TransactionsContainer } from "./_components/TransactionsContainer";
import { TransactionsSkeleton } from "./_components/TransactionsSkeleton";

export default function TransactionsPage() {
  return (
    <div className="container space-y-6 py-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <AddNewTransaction />
      </div>

      <Suspense fallback={<TransactionsSkeleton />}>
        <TransactionsContainer />
      </Suspense>
    </div>
  );
}
